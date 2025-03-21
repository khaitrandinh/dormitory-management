<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;

class RoomController extends Controller
{
    // ✅ Lấy danh sách tất cả các phòng
    public function index()
    {
        $rooms = Room::all();
        return response()->json($rooms);
    }

    // ✅ Lấy thông tin phòng theo id
    public function show($id)
    {
        $room = Room::find($id);

        if (!$room) {
            return response()->json(['message' => 'Không tìm thấy phòng'], 404);
        }

        return response()->json($room);
    }

    // ✅ Tạo phòng mới
    public function store(Request $request)
    {
        $request->validate([
            'room_code' => 'required|string|unique:rooms',
            'building' => 'required|string',
            'floor' => 'required|integer',
            'bed_count' => 'required|integer',
            'room_type' => 'required|in:thường,vip',
            'status' => 'required|in:trống,đã thuê,bảo trì',
            'price' => 'required|integer',
        ]);

        $room = Room::create($request->all());

        return response()->json(['message' => 'Phòng đã được tạo', 'data' => $room], 201);
    }

    // ✅ Cập nhật thông tin phòng
    public function update(Request $request, $id)
    {
        $room = Room::find($id);
        if (!$room) {
            return response()->json(['message' => 'Không tìm thấy phòng'], 404);
        }

        $request->validate([
            'room_code' => 'sometimes|string|unique:rooms,room_code,'.$id,
            'building' => 'sometimes|string',
            'floor' => 'sometimes|integer',
            'bed_count' => 'sometimes|integer',
            'room_type' => 'sometimes|in:thường,vip',
            'status' => 'sometimes|in:trống,đã thuê,bảo trì',
            'price' => 'sometimes|integer',
        ]);

        $room->update($request->all());

        return response()->json(['message' => 'Thông tin phòng đã được cập nhật', 'data' => $room]);
    }

    // ✅ Xóa phòng
    public function destroy($id)
    {
        $room = Room::find($id);
        if (!$room) {
            return response()->json(['message' => 'Không tìm thấy phòng'], 404);
        }

        $room->delete();

        return response()->json(['message' => 'Phòng đã bị xóa']);
    }
}
