<h2>🧾 New Payment Created</h2>
<p>Hello {{ $studentName }},</p>
<p>You have a new invoice with the following details:</p>

<ul>
    <li><strong>Amount:</strong> {{ number_format($payment->amount) }} VND</li>
    <li><strong>Due Date:</strong> {{ $payment->payment_date }}</li>
</ul>

<p>Please make your payment before the due date to avoid service interruptions.</p>

<p>Thank you.</p>
