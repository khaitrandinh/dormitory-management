<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RepairRequest;
use App\Models\User;
use App\Models\Room;
use Illuminate\Support\Facades\Mail;

class RepairRequestController extends Controller
{
    // ✅ List all repair requests
    public function index()
    {
        $requests = RepairRequest::with(['user', 'room'])->get();
        return response()->json($requests);
    }


    // ✅ Show repair request by ID
    public function show($id)
    {
        $request = RepairRequest::with('user')->find($id);

        if (!$request) {
            return response()->json(['message' => 'Repair request not found'], 404);
        }

        return response()->json($request);
    }

    // ✅ Student creates repair request for their own room
    public function store(Request $request)
    {
        $user = auth()->user();

        if ($user->role !== 'student') {
            return response()->json(['message' => 'Only students can submit repair requests'], 403);
        }

        $student = $user->student;

        if (!$student || !$student->room_code) {
            return response()->json(['message' => 'Student is not assigned to a room'], 400);
        }

        $room = Room::where('room_code', $student->room_code)->first();

        if (!$room) {
            return response()->json(['message' => 'Room not found'], 404);
        }

        $request->validate([
            'description' => 'required|string',
        ]);

        $repairRequest = RepairRequest::create([
            'user_id' => $user->id,
            'room_id' => $room->id,
            'description' => $request->description,
            'status' => 'pending',
        ]);

        $this->notifyAdminsAndStaff($repairRequest);

        return response()->json([
            'message' => 'Repair request submitted successfully',
            'data' => $repairRequest
        ], 201);
    }

    // ✅ Update repair request status
    public function update(Request $request, $id)
    {
        $repairRequest = RepairRequest::find($id);
        if (!$repairRequest) {
            return response()->json(['message' => 'Repair request not found'], 404);
        }

        $request->validate([
            'status' => 'sometimes|in:pending,in-progress,completed,canceled',
        ]);

        $repairRequest->update($request->all());

        return response()->json([
            'message' => 'Repair request updated successfully',
            'data' => $repairRequest
        ]);
    }

    // ✅ Delete repair request
    public function destroy($id)
    {
        $repairRequest = RepairRequest::find($id);
        if (!$repairRequest) {
            return response()->json(['message' => 'Repair request not found'], 404);
        }

        $repairRequest->delete();

        return response()->json(['message' => 'Repair request deleted']);
    }

    // ✅ Notify admin/staff via email
    protected function notifyAdminsAndStaff($repairRequest)
    {
        $recipients = User::whereIn('role', ['admin', 'staff'])->get();

        foreach ($recipients as $recipient) {
            Mail::raw(
                "New repair request submitted by: {$repairRequest->user->name}\n" .
                "Room: {$repairRequest->room->room_code}\n" .
                "Description: {$repairRequest->description}",
                function ($message) use ($recipient) {
                    $message->to($recipient->email)
                            ->subject('🔧 New Repair Request');
                }
            );
        }
    }
}
