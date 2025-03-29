<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contract;
use App\Models\Student;
use App\Models\Room;

class ContractController extends Controller
{
    public function index()
    {
        $contracts = Contract::with(['student.user', 'room', 'payments'])->get();
        return response()->json($contracts);
    }

    public function show($id)
    {
        $contract = Contract::with(['student', 'room'])->find($id);

        if (!$contract) {
            return response()->json(['message' => 'Contract not found'], 404);
        }

        return response()->json($contract);
    }

    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'room_id' => 'required|exists:rooms,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:active,expired,canceled',
            'deposit_amount' => 'nullable|integer',
            'notes' => 'nullable|string',
        ]);

        // Check if student already has active contract
        $existing = Contract::where('student_id', $request->student_id)
            ->where('status', 'active')
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Student already has an active contract'], 400);
        }

        $contract = Contract::create($request->all());

        return response()->json(['message' => 'Contract created successfully', 'data' => $contract], 201);
    }

    public function update(Request $request, $id)
    {
        $contract = Contract::find($id);
        if (!$contract) {
            return response()->json(['message' => 'Contract not found'], 404);
        }

        $request->validate([
            'status' => 'sometimes|in:active,expired,canceled',
            'end_date' => 'sometimes|date|after:start_date',
            'deposit_amount' => 'sometimes|integer',
            'notes' => 'sometimes|string',
        ]);

        $contract->update($request->all());

        return response()->json(['message' => 'Contract updated successfully', 'data' => $contract]);
    }

    public function destroy($id)
    {
        $contract = Contract::find($id);
        if (!$contract) {
            return response()->json(['message' => 'Contract not found'], 404);
        }

        $contract->delete();

        return response()->json(['message' => 'Contract deleted successfully']);
    }
}
