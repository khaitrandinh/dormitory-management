<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Contract;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with('contract')->get();
        return response()->json($payments);
    }

    public function show($id)
    {
        $payment = Payment::with('contract')->find($id);
        if (!$payment) {
            return response()->json(['message' => 'Không tìm thấy thanh toán'], 404);
        }

        return response()->json($payment);
    }

    public function store(Request $request)
    {
        $request->validate([
            'contract_id' => 'required|exists:contracts,id',  // ✅ Chỉ chấp nhận contract_id
            'amount' => 'required|integer',
            'payment_date' => 'required|date',
            'status' => 'required|in:pending,paid,canceled',
        ]);

        $payment = Payment::create($request->all());

        return response()->json(['message' => 'Thanh toán đã được tạo', 'data' => $payment], 201);
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['message' => 'Không tìm thấy thanh toán'], 404);
        }

        $request->validate([
            'status' => 'sometimes|in:pending,paid,canceled',
        ]);

        $payment->update($request->all());

        return response()->json(['message' => 'Thanh toán đã được cập nhật', 'data' => $payment]);
    }

    public function destroy($id)
    {
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['message' => 'Không tìm thấy thanh toán'], 404);
        }

        $payment->delete();

        return response()->json(['message' => 'Thanh toán đã bị xóa']);
    }
}
