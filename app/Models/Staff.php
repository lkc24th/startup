<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    use HasFactory;
    protected $table = 'staffs';
    protected $fillable = [
        'name',
        'specialty',
    ];

    public function appointments()//truy xuất tất cả các cuộc hẹn liên quan đến nhân viên
    {
        return $this->hasMany(Appointment::class, 'staff_id');
    }
}
