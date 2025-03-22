<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RepairRequest;
use App\Models\User;

class RepairRequestController extends Controller
{
    // ✅ Lấy danh sách tất cả yêu cầu sửa chữa
    public function index()
    {
        $requests = RepairRequest::with('user')->get();
        return response()->json($requests);
    }

    // ✅ Lấy thông tin yêu cầu sửa chữa theo id
    public function show($id)
    {
        $request = RepairRequest::with('user')->find($id);

        if (!$request) {
            return response()->json(['message' => 'Không tìm thấy yêu cầu sửa chữa'], 404);
        }

        return response()->json($request);
    }

    // ✅ Tạo yêu cầu sửa chữa
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'room_id' => 'required|exists:rooms,id',
            'description' => 'required|string',
            'status' => 'required|in:pending,in-progress,completed,canceled',
        ]);

        $repairRequest = RepairRequest::create($request->all());

        return response()->json(['message' => 'Yêu cầu sửa chữa đã được tạo', 'data' => $repairRequest], 201);
    }

    // ✅ Cập nhật trạng thái yêu cầu sửa chữa
    public function update(Request $request, $id)
    {
        $repairRequest = RepairRequest::find($id);
        if (!$repairRequest) {
            return response()->json(['message' => 'Không tìm thấy yêu cầu sửa chữa'], 404);
        }

        $request->validate([
            'status' => 'sometimes|in:pending,in-progress,completed,canceled',
        ]);

        $repairRequest->update($request->all());

        return response()->json(['message' => 'Yêu cầu sửa chữa đã được cập nhật', 'data' => $repairRequest]);
    }

    // ✅ Xóa yêu cầu sửa chữa
    public function destroy($id)
    {
        $repairRequest = RepairRequest::find($id);
        if (!$repairRequest) {
            return response()->json(['message' => 'Không tìm thấy yêu cầu sửa chữa'], 404);
        }

        $repairRequest->delete();

        return response()->json(['message' => 'Yêu cầu sửa chữa đã bị xóa']);
    }
}
