<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;

class RoomController extends Controller
{
    // Get all rooms
    public function index()
    {
        $rooms = Room::with(['contracts' => function ($query) {
            $query->where('status', 'active');
        }])->get();

        $updatedRooms = [];

        foreach ($rooms as $room) {
            $occupiedBeds = $room->contracts->count();
            $bedAvailable = $room->bed_count - $occupiedBeds;

            // Ưu tiên trạng thái do người dùng đặt khi là Maintenance
            if ($room->status === 'Maintenance') {
                $statusDisplay = 'Maintenance';
            } elseif ($bedAvailable <= 0) {
                $statusDisplay = 'Full';
            } elseif ($occupiedBeds === 0) {
                $statusDisplay = 'Available';
            } else {
                $statusDisplay = 'Occupied';
            }

            $room->bed_available = $bedAvailable;
            $room->status_display = $statusDisplay;

            $updatedRooms[] = $room;
        }

        return response()->json($updatedRooms);
    }

    // Get room by id
    public function show($id)
    {
        $room = Room::with(['contracts' => function ($query) {
            $query->where('status', 'active');
        }])->find($id);

        if (!$room) {
            return response()->json(['message' => 'Room not found'], 404);
        }

        // Tính toán status_display và bed_available
        $occupiedBeds = $room->contracts->count();
        $room->bed_available = $room->bed_count - $occupiedBeds;
        
        if ($room->status === 'Maintenance') {
            $room->status_display = 'Maintenance';
        } elseif ($room->bed_available <= 0) {
            $room->status_display = 'Full';
        } elseif ($occupiedBeds === 0) {
            $room->status_display = 'Available';
        } else {
            $room->status_display = 'Occupied';
        }

        return response()->json($room);
    }

    // Create a new room
    public function store(Request $request)
    {
        $request->validate([
            'room_code' => 'required|string|unique:rooms',
            'building' => 'required|string',
            'floor' => 'required|integer',
            'bed_count' => 'required|integer',
            'room_type' => 'required|in:standard,vip',
            'status' => 'required|in:Available,Occupied,Maintenance,Full',
            'price' => 'required|integer',
        ]);

        $room = Room::create($request->all());

        return response()->json(['message' => 'Room created successfully', 'data' => $room], 201);
    }

    // Update room information
    public function update(Request $request, $id)
    {
        $room = Room::find($id);
        if (!$room) {
            return response()->json(['message' => 'Room not found'], 404);
        }

        $validated = $request->validate([
            'room_code' => 'sometimes|string|unique:rooms,room_code,'.$id,
            'building' => 'sometimes|string',
            'floor' => 'sometimes|integer',
            'bed_count' => 'sometimes|integer',
            'room_type' => 'sometimes|in:standard,vip',
            'status' => 'sometimes|in:Available,Occupied,Maintenance,Full',
            'price' => 'sometimes|integer',
        ]);

        $room->update($validated);

        // Tính lại status_display sau khi cập nhật status
        if ($request->has('status')) {
            $room = $room->fresh(['contracts' => function ($query) {
                $query->where('status', 'active');
            }]);
            
            $occupiedBeds = $room->contracts->count();
            $bedAvailable = $room->bed_count - $occupiedBeds;
            $room->bed_available = $bedAvailable;
            
            // Ưu tiên trạng thái do người dùng đặt khi là Maintenance
            if ($room->status === 'Maintenance') {
                $statusDisplay = 'Maintenance';
            } elseif ($bedAvailable <= 0) {
                $statusDisplay = 'Full';
            } elseif ($occupiedBeds === 0) {
                $statusDisplay = 'Available';
            } else {
                $statusDisplay = 'Occupied';
            }
            
            $room->status_display = $statusDisplay;
        }

        return response()->json([
            'message' => 'Room updated successfully',
            'data' => $room
        ], 200);
    }

    // Delete room
    public function destroy($id)
    {
        $room = Room::find($id);
        if (!$room) {
            return response()->json(['message' => 'Room not found'], 404);
        }

        $room->delete();

        return response()->json(['message' => 'Room deleted successfully']);
    }
}