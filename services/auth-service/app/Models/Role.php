<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    // ✅ Quan hệ Nhiều - Nhiều giữa Role và Permission (phải giữ lại)
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permissions');
    }

    // ✅ Quan hệ Một - Nhiều: Một Role có nhiều User (One to Many)
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
