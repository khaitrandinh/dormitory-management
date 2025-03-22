<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id', // ✅ Gắn với contract_id thay vì user_id
        'amount',
        'payment_date',
        'status',
    ];

    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }
}
