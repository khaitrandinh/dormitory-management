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
        $notifications = Notification::with('sender')->get();
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
