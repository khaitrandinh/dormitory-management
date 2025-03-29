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
                    'empty' => Room::withCount('activeContracts')
                                ->get()
                                ->where(fn($r) => $r->bed_count - $r->active_contracts_count > 0)
                                ->count(),
                    'total' => Room::count()
                ],

                'occupiedStudents' => Contract::where('status', 'active')->distinct('student_id')->count('student_id'),
                'paymentStatus' => [
                    'paid' => Payment::where('status', 'paid')->sum('amount'),
                    'unpaid' => Payment::where('status', 'pending')->sum('amount')
                ],
                'roomStatus' => Room::withCount('activeContracts')->get()->map(function ($room) {
                    $bed_available = $room->bed_count - $room->active_contracts_count;

                    $status = $room->status === 'Maintenance'
                        ? 'Maintenance'
                        : ($bed_available == 0 ? 'Full' : 'Available');

                    return [
                        'id' => $room->id,
                        'building' => $room->building,
                        'room' => $room->room_code,
                        'status' => $status,
                        'bed_count' => $room->bed_count,
                        'bed_available' => $bed_available,
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
                ->where('status', 'active') // 👉 chỉ lấy hợp đồng còn hiệu lực
                ->with(['room', 'payments' => function ($q) {
                    $q->whereNot('status', 'canceled'); // 👉 bỏ qua hóa đơn đã huỷ
                }])
                ->latest()
                ->first();
        
            $paymentStatus = 'Không có hoá đơn';
            if ($latestContract) {
                if ($latestContract->payments->where('status', 'pending')->count() > 0) {
                    $paymentStatus = 'Chưa thanh toán';
                } elseif ($latestContract->payments->where('status', 'paid')->count() > 0) {
                    $paymentStatus = 'Đã thanh toán';
                }
            }
        
            // 👉 Tùy chọn lọc notification hiển thị
            $notifications = Notification::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get(['id', 'message', 'created_at']);
        
            // 👉 Chỉ trả về thông báo nếu thật sự còn hóa đơn cần thanh toán
            if ($paymentStatus === 'Không có hoá đơn' || $paymentStatus === 'Đã thanh toán') {
                $notifications = $notifications->reject(function ($n) {
                    return str_contains($n->message, 'chưa thanh toán');
                })->values(); // Xoá bỏ các thông báo liên quan nếu không còn hóa đơn
            }
        
            return response()->json([
                'student' => [
                    'room' => $latestContract && $latestContract->room ? $latestContract->room->room_code : 'Chưa có phòng',
                    'paymentStatus' => $paymentStatus
                ],
                'notifications' => $notifications
            ]);
        }         

        // ❌ Không có quyền
        return response()->json([
            'message' => 'Không có quyền truy cập'
        ], 403);
    }
}
