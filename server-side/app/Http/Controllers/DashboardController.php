<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;
use App\Models\Student;
use App\Models\Payment;
use App\Models\Contract;
use App\Models\Notification;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        // 🛠 Admin or Staff Dashboard
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
                    $bedAvailable = $room->bed_count - $room->active_contracts_count;

                    $status = $room->status === 'Maintenance'
                        ? 'Maintenance'
                        : ($bedAvailable == 0 ? 'Full' : 'Available');

                    return [
                        'id' => $room->id,
                        'building' => $room->building,
                        'room' => $room->room_code,
                        'status' => $status,
                        'bed_count' => $room->bed_count,
                        'bed_available' => $bedAvailable,
                    ];
                }),

                'notifications' => Notification::orderBy('created_at', 'desc')->take(5)->get(['id', 'message', 'created_at']),

                'finance' => [
                    'income' => Payment::where('status', 'paid')->whereMonth('payment_date', now()->month)->sum('amount'),
                    'expenses' => 0 // update later if expense system is added
                ],

                'monthlyFinance' => $this->getMonthlyFinance()
            ]);
        }

        // 🧑 Student Dashboard
        if ($user->role === 'student') {
            $student = Student::where('user_id', $user->id)->first();

            if (!$student) {
                return response()->json([
                    'message' => 'Student record not found!'
                ], 404);
            }

            $latestContract = Contract::where('student_id', $student->id)
                ->where('status', 'active')
                ->with(['room', 'payments' => function ($q) {
                    $q->whereNot('status', 'canceled');
                }])
                ->latest()
                ->first();

            $paymentStatus = 'No invoices';
            $paidAmount = 0;
            $unpaidAmount = 0;

            if ($latestContract) {
                $paidPayments = $latestContract->payments->where('status', 'paid');
                $pendingPayments = $latestContract->payments->where('status', 'pending');

                $paidAmount = $paidPayments->sum('amount');
                $unpaidAmount = $pendingPayments->sum('amount');

                if ($pendingPayments->count() > 0) {
                    $paymentStatus = 'Unpaid';
                } elseif ($paidPayments->count() > 0) {
                    $paymentStatus = 'Paid';
                }
            }

            // Student Notifications (system-wide + personal)
            $notifications = Notification::where(function ($query) use ($user) {
                    $query->whereNull('user_id')->orWhere('user_id', $user->id);
                })
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get(['id', 'message', 'created_at']);

            if (in_array($paymentStatus, ['No invoices', 'Paid'])) {
                $notifications = $notifications->reject(function ($n) {
                    return str_contains($n->message, 'unpaid');
                })->values();
            }

            return response()->json([
                'student' => [
                    'room' => $latestContract && $latestContract->room ? $latestContract->room->room_code : 'Not assigned',
                    'paymentStatus' => $paymentStatus,
                    'paid' => $paidAmount,
                    'unpaid' => $unpaidAmount,
                ],
                'notifications' => $notifications
            ]);
        }

        return response()->json([
            'message' => 'Access denied'
        ], 403);
    }

    private function getMonthlyFinance()
    {
        return Payment::select(
                DB::raw('MONTH(payment_date) as month'),
                DB::raw('SUM(CASE WHEN status = "paid" THEN amount ELSE 0 END) as income'),
                DB::raw('0 as expenses') 
            )
            ->whereYear('payment_date', now()->year)
            ->groupBy(DB::raw('MONTH(payment_date)'))
            ->orderBy(DB::raw('MONTH(payment_date)'))
            ->get();
    }
}
