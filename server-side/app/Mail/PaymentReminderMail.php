<?php

namespace App\Mail;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaymentReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $payment;
    public $studentName;

    public function __construct(Payment $payment)
    {
        $this->payment = $payment;
        $this->studentName = optional($payment->contract->student->user)->name ?? 'Student';
    }

    public function build()
    {
        return $this->subject('Payment Reminder')
                    ->markdown('emails.payment_reminder')
                    ->with([
                        'payment' => $this->payment,
                        'studentName' => $this->studentName,
                    ]);
    }
}
