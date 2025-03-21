<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contract;
use App\Models\Student;
use App\Models\Room;

class ContractController extends Controller
{
    // ✅ Lấy danh sách tất cả các hợp đồng
    public function index()
    {
        $contracts = Contract::with(['student', 'room'])->get();
        return response()->json($contracts);
    }

    // ✅ Lấy thông tin hợp đồng theo id
    public function show($id)
    {
        $contract = Contract::with(['student', 'room'])->find($id);

        if (!$contract) {
            return response()->json(['message' => 'Không tìm thấy hợp đồng'], 404);
        }

        return response()->json($contract);
    }

    // ✅ Tạo hợp đồng mới
    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'room_id' => 'required|exists:rooms,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:active,expired,canceled',
        ]);

        $contract = Contract::create($request->all());

        return response()->json(['message' => 'Hợp đồng đã được tạo', 'data' => $contract], 201);
    }

    // ✅ Cập nhật hợp đồng
    public function update(Request $request, $id)
    {
        $contract = Contract::find($id);
        if (!$contract) {
            return response()->json(['message' => 'Không tìm thấy hợp đồng'], 404);
        }

        $request->validate([
            'status' => 'sometimes|in:active,expired,canceled',
            'end_date' => 'sometimes|date|after:start_date',
        ]);

        $contract->update($request->all());

        return response()->json(['message' => 'Hợp đồng đã được cập nhật', 'data' => $contract]);
    }

    // ✅ Xóa hợp đồng
    public function destroy($id)
    {
        $contract = Contract::find($id);
        if (!$contract) {
            return response()->json(['message' => 'Không tìm thấy hợp đồng'], 404);
        }

        $contract->delete();

        return response()->json(['message' => 'Hợp đồng đã bị xóa']);
    }
}
