<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AppointmentDetail extends Model
{
    use HasFactory;
    protected $table = 'appointment_details';
    protected $fillable = [
        'appointment_id',
        'service_id',
    ];

    public function appointment()//truy xuất cuộc hẹn liên quan đến chi tiết cuộc hẹn
    {
        return $this->belongsTo(Appointment::class, 'appointment_id');
    }

    public function service()//truy xuất dịch vụ liên quan đến chi tiết cuộc hẹn
    {
        return $this->belongsTo(Service::class, 'service_id');
    }
}
