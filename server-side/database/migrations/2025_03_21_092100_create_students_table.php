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
            $table->unsignedBigInteger('user_id')->unique(); // 1 user chỉ có 1 sinh viên
            $table->string('student_code')->unique(); // Mã sinh viên
            $table->string('gender');
            $table->date('birth_date');
            $table->string('class');
            $table->string('faculty');
            $table->string('phone');
            $table->string('room_code')->nullable(); // Mã phòng đang ở
            $table->boolean('is_paid')->default(false); // Trạng thái thanh toán
            $table->timestamps();
        
            // Khóa ngoại liên kết với bảng users
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
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
