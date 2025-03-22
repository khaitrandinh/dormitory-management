<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('repair_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // ✅ Người gửi yêu cầu
            $table->foreignId('room_id')->constrained('rooms')->onDelete('cascade'); // ✅ Phòng cần sửa
            $table->text('description'); // ✅ Mô tả vấn đề cần sửa
            $table->enum('status', ['pending', 'in-progress', 'completed', 'canceled'])->default('pending'); // ✅ Trạng thái
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('repair_requests');
    }
};
