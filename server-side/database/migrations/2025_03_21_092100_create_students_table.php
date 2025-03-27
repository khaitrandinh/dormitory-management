<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->string('student_code')->unique();
            $table->string('gender');
            $table->date('birth_date');
            $table->string('class');
            $table->string('faculty');
            $table->string('phone');
            $table->string('room_code')->nullable();
            $table->boolean('is_paid')->default(false);
            $table->enum('room_request_status', ['pending', 'approved', 'rejected'])->nullable(); 
            $table->timestamps();
        });            
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
