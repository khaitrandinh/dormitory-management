<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;
use App\Models\Student;
use App\Models\Payment;
use App\Models\Contract;
use App\Models\Notification;

class DashboardController extends Controller
{
    public function index(Request $request)
{
    $user = auth()->user();

    // ✅ Nếu là "manager" → Lấy toàn bộ dữ liệu
    if ($user->role === 'staff') {
        return response()->json([
            'rooms' => [
                'empty' => Room::whereDoesntHave('contracts')->count(),
                'total' => Room::count()
            ],
            'occupiedStudents' => Student::whereHas('contracts')->count(),
            'paymentStatus' => [
                'paid' => Payment::where('status', 'paid')->sum('amount'),
                'unpaid' => Payment::where('status', 'pending')->sum('amount')
            ],
            'roomStatus' => Room::with('contracts')->get()->map(function ($room) {
                return [
                    'id' => $room->id,
                    'building' => $room->building,
                    'room' => $room->room_code,
                    'status' => $room->contracts->count() > 0 ? 'Đã thuê' : 'Trống'
                ];
            }),
            'notifications' => Notification::orderBy('created_at', 'desc')->take(5)->get(['id', 'message', 'created_at']),
            'finance' => [
                'income' => Payment::where('status', 'paid')->whereMonth('payment_date', now()->month)->sum('amount'),
                'expenses' => 0
            ]
        ]);
    }

    // ✅ Nếu là "student" → Lấy dữ liệu cá nhân
    if ($user->role === 'student') {
        $student = Student::where('user_id', $user->id)->with(['contract.room'])->first();

        if (!$student) {
            return response()->json([
                'message' => 'Không tìm thấy dữ liệu sinh viên!'
            ], 404);
        }

        return response()->json([
            'student' => [
                'room' => $student->contract ? $student->contract->room->room_code : 'Chưa có phòng',
                'paymentStatus' => $student->contract && $student->contract->payments->where('status', 'pending')->count() > 0 ? 'Chưa thanh toán' : 'Đã thanh toán'
            ],
            'notifications' => Notification::where('user_id', $user->id)->orderBy('created_at', 'desc')->take(5)->get(['id', 'message', 'created_at'])
        ]);
    }

    return response()->json([
        'message' => 'Không có quyền truy cập'
    ], 403);
}

}
