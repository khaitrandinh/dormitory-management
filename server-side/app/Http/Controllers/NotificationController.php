<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class NotificationController extends Controller
{
    
    public function index()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if (in_array($user->role, ['admin', 'staff'])) {
            // Admin và staff thấy tất cả thông báo
            $notifications = Notification::with('sender')->orderByDesc('created_at')->get();
        } else {
            // Student chỉ thấy thông báo gửi riêng cho mình hoặc toàn hệ thống
            $notifications = Notification::with('sender')
                ->whereNull('user_id')
                ->orWhere('user_id', $user->id)
                ->orderByDesc('created_at')
                ->get();
        }

        return response()->json($notifications);
    }


    
    public function show($id)
    {
        $notification = Notification::with('sender')->find($id);

        if (!$notification) {
            return response()->json(['message' => 'Không tìm thấy thông báo'], 404);
        }

        return response()->json($notification);
    }

    
   

    public function store(Request $request)
    {
        try {
            $request->validate([
                'sender_id' => 'required|exists:users,id',
                'title' => 'required|string|max:255',
                'message' => 'required|string',
                'user_id' => 'nullable|exists:users,id'
            ]);
    
            $notification = Notification::create($request->only([
                'sender_id', 'user_id', 'title', 'message'
            ]));
    
            // Gửi email
            if ($request->user_id) {
                $user = User::find($request->user_id);
                if ($user && $user->email) {
                    Mail::raw($request->message, function ($message) use ($user, $request) {
                        $message->to($user->email)
                                ->subject('[Notification] ' . $request->title);
                    });
                }
            } else {
                $users = User::whereNotNull('email')->get();
                foreach ($users as $user) {
                    Mail::raw($request->message, function ($message) use ($user, $request) {
                        $message->to($user->email)
                                ->subject('[Notification] ' . $request->title);
                    });
                }
            }
    
            return response()->json([
                'message' => 'Notification sent successfully.',
                'data' => $notification
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Notification Error: ' . $e->getMessage());
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }
    


    
    public function destroy($id)
    {
        $notification = Notification::find($id);
        if (!$notification) {
            return response()->json(['message' => 'Không tìm thấy thông báo'], 404);
        }

        $notification->delete();

        return response()->json(['message' => 'Thông báo đã bị xóa']);
    }
}
