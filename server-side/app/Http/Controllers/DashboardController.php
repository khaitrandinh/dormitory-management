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

        
        if (in_array($user->role, ['staff', 'admin'])) {
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
                'roomStatus' => Room::select('id', 'building', 'room_code', 'status')->get()->map(function ($room) {
                    return [
                        'id' => $room->id,
                        'building' => $room->building,
                        'room' => $room->room_code,
                        'status' => $room->status 
                    ];
                }),


                'notifications' => Notification::orderBy('created_at', 'desc')->take(5)->get(['id', 'message', 'created_at']),
                'finance' => [
                    'income' => Payment::where('status', 'paid')->whereMonth('payment_date', now()->month)->sum('amount'),
                    'expenses' => 0 
                ]
            ]);
        }

        
        if ($user->role === 'student') {
            $student = Student::where('user_id', $user->id)->first();

            if (!$student) {
                return response()->json([
                    'message' => 'Không tìm thấy dữ liệu sinh viên!'
                ], 404);
            }

            $latestContract = Contract::where('student_id', $student->id)
                ->latest()
                ->with('room', 'payments')
                ->first();

            return response()->json([
                'student' => [
                    'room' => $latestContract && $latestContract->room ? $latestContract->room->room_code : 'Chưa có phòng',
                    'paymentStatus' => $latestContract && $latestContract->payments->where('status', 'pending')->count() > 0
                        ? 'Chưa thanh toán'
                        : 'Đã thanh toán'
                ],
                'notifications' => Notification::where('user_id', $user->id)->orderBy('created_at', 'desc')->take(5)->get(['id', 'message', 'created_at'])

            ]);
        }   

        // ❌ Không có quyền
        return response()->json([
            'message' => 'Không có quyền truy cập'
        ], 403);
    }
}
