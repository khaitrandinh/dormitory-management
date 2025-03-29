<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'amount',
        'payment_date',
        'status',
        'type',
        'description',
        'payos_transaction_code',
    ];
    
    

    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }

    public function student()
    {
        return $this->hasOneThrough(Student::class, Contract::class, 'id', 'id', 'contract_id', 'student_id');
    }

    
}
