<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject // ⚠️ Phải implement JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // ✅ Đảm bảo role có thể gán giá trị
        'status'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // ✅ Cài đặt các phương thức bắt buộc của JWT
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    // 🔗 Quan hệ 1-1 với Student
    public function student()
    {
        return $this->hasOne(Student::class);
    }

    // 🔗 Quan hệ 1-n với Contract
    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    // 🔗 Quan hệ 1-n với Payment
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // 🔗 Quan hệ 1-n với RepairRequest (Sinh viên gửi yêu cầu)
    public function repairRequests()
    {
        return $this->hasMany(RepairRequest::class, 'user_id');
    }

    // 🔗 Quan hệ 1-n với RepairRequest (Nhân viên kỹ thuật xử lý yêu cầu)
    public function handledRepairs()
    {
        return $this->hasMany(RepairRequest::class, 'handled_by');
    }

    // 🔗 Quan hệ 1-n với Notification (Gửi thông báo)
    public function sentNotifications()
    {
        return $this->hasMany(Notification::class, 'sender_id');
    }
}
