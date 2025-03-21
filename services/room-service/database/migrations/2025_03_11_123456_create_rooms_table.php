<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');           // Tên phòng
            $table->integer('floor');         // Tầng
            $table->string('building');       // Tòa nhà
            $table->integer('bed_count');     // Số giường
            $table->string('type');           // Loại phòng
            $table->decimal('price', 10, 2);  // Giá thuê
            $table->enum('status', ['available', 'occupied', 'maintenance'])->default('available'); // Trạng thái
            $table->timestamps();             // created_at, updated_at

            // Unique trên name + building
            $table->unique(['name', 'building']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('rooms');
    }
};
?>