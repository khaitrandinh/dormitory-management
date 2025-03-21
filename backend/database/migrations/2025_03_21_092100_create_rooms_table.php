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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('room_code')->unique();           // Ví dụ: A101, B202
            $table->string('building');                      // Ví dụ: Tòa A, Tòa B
            $table->integer('floor');                        // Tầng
            $table->integer('bed_count');                    // Số giường
            $table->enum('room_type', ['thường', 'vip']);   // Loại phòng
            $table->enum('status', ['trống', 'đã thuê', 'bảo trì'])->default('trống');
            $table->integer('price');                        // Giá thuê
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
