<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Contract;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\PaymentCreatedMail;
use App\Mail\PaymentReminderMail;
use App\Services\PayOSService;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with(['contract.student.user', 'contract.room'])->get();
        return response()->json($payments);
    }

    public function show($id)
    {
        $payment = Payment::with(['contract.student.user'])->find($id);
        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        return response()->json($payment);
    }

    public function store(Request $request)
    {
        $request->validate([
            'contract_id' => 'required|exists:contracts,id',
            'amount' => 'required|integer',
            'payment_date' => 'nullable|date',
            'status' => 'required|in:pending,paid,canceled',
            'type' => 'nullable|string',
            'description' => 'nullable|string',
            'payos_transaction_code' => 'nullable|string',
        ]);

        $payment = Payment::create($request->all());

        $contract = Contract::with('student.user')->find($request->contract_id);
        $studentUser = $contract->student->user ?? null;

        if ($studentUser) {
            Notification::create([
                'sender_id' => auth()->id(),
                'user_id' => $studentUser->id,
                'title' => 'New Payment Created',
                'message' => 'A new payment of ' . number_format($payment->amount) . ' VND has been created. Please complete it before ' . $payment->payment_date,
            ]);

            Mail::to($studentUser->email)->send(new PaymentCreatedMail($payment));
        }

        return response()->json(['message' => 'Payment created successfully', 'data' => $payment], 201);
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        $request->validate([
            'status' => 'sometimes|in:pending,paid,canceled',
            'type' => 'sometimes|string',
            'description' => 'sometimes|string',
            'payos_transaction_code' => 'sometimes|string',
        ]);

        $payment->update($request->all());

        return response()->json(['message' => 'Payment updated successfully', 'data' => $payment]);
    }

    public function destroy($id)
    {
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        $payment->delete();

        return response()->json(['message' => 'Payment deleted successfully']);
    }

    public function remind($id)
    {
        $payment = Payment::with(['contract.student.user'])->find($id);

        if (!$payment || !$payment->contract->student->user) {
            return response()->json(['message' => 'Payment or student not found'], 404);
        }

        $studentUser = $payment->contract->student->user;

        Notification::create([
            'sender_id' => auth()->id(),
            'user_id' => $studentUser->id,
            'title' => 'Payment Reminder',
            'message' => 'You have a pending invoice due by ' . $payment->payment_date,
        ]);

        Mail::to($studentUser->email)->send(new PaymentReminderMail($payment));

        return response()->json(['message' => 'Reminder sent successfully']);
    }

    public function initiatePayOS(Request $request, PayOSService $payOSService)
    {
        $request->validate([
            'contract_id' => 'required|exists:contracts,id',
            'amount' => 'required|integer|min:1000',
        ]);

        $result = $payOSService->createPaymentLink($request->amount, $request->contract_id);

        if (!isset($result['checkoutUrl'])) {
            return response()->json(['message' => 'Unable to create payment link'], 500);
        }

        return response()->json([
            'payment_url' => $result['checkoutUrl'],
            'message' => 'Payment initiated',
        ]);
    }

    public function handlePayOSWebhook(Request $request)
{
    $payload = $request->getContent(); // raw JSON
    $receivedSignature = $request->header('x-signature');
    $checksumKey = env('PAYOS_CHECKSUM_KEY');

    // Tính lại chữ ký
    $calculatedSignature = hash_hmac('sha256', $payload, $checksumKey);

    // Kiểm tra chữ ký
    if ($calculatedSignature !== $receivedSignature) {
        Log::warning('Invalid PayOS webhook signature');
        return response()->json(['message' => 'Invalid signature'], 401);
    }

    // Giải mã payload JSON
    $data = json_decode($payload, true);

    // Xử lý nếu đã thanh toán
    if ($data['status'] === 'PAID') {
        Payment::create([
            'contract_id' => $data['description'], 
            'amount' => $data['amount'],
            'payment_date' => now(),
            'status' => 'paid',
            'type' => 'payos',
            'description' => 'Paid via PayOS',
            'payos_transaction_code' => $data['transactionCode'] ?? null,
        ]);
    }

    return response()->json(['message' => 'Webhook received']);
}
}
