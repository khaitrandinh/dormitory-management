<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();

            // ✅ Người nhận thông báo (nullable vì có thể là thông báo chung)
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');

            // ✅ Người gửi thông báo
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');

            $table->string('title');
            $table->text('message');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
};
