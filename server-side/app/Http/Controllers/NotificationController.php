<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use App\Models\User;

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
        $request->validate([
            'sender_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $notification = Notification::create($request->all());

        return response()->json(['message' => 'Thông báo đã được tạo', 'data' => $notification], 201);
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
