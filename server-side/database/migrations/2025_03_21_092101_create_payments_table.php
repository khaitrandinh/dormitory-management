<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained('contracts')->onDelete('cascade');
            $table->integer('amount');
            $table->date('payment_date')->nullable(); 
            $table->enum('status', ['pending', 'paid', 'canceled'])->default('pending');
            $table->string('type')->default('room_booking');
            $table->string('description')->nullable();
            $table->string('payos_transaction_code')->nullable(); 
            $table->timestamps();

        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
