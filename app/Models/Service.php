<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;
    protected $table = 'services';
    protected $fillable = [
        'name',
        'price',
        'duration',
        'description',
        'image',
        'is_active',
    ];

    public function appointments()//truy xuất tất cả các cuộc hẹn liên quan đến dịch vụ
    {
        return $this->belongsToMany(Appointment::class, 'appointment_details', 'service_id', 'appointment_id');
    }
}
