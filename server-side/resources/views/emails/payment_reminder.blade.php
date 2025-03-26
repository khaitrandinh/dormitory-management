<h2>⏰ Payment Reminder</h2>
<p>Hello {{ $studentName }},</p>
<p>This is a reminder that you have a pending payment due on <strong>{{ $payment->payment_date }}</strong>.</p>

<ul>
    <li><strong>Amount:</strong> {{ number_format($payment->amount) }} VND</li>
    <li><strong>Status:</strong> {{ ucfirst($payment->status) }}</li>
</ul>

<p>Please proceed to payment soon.</p>

<p>Thank you.</p>
