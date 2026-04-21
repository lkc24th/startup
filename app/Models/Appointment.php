<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $table = 'appointments';

    protected $fillable = [
        'user_id',
        'staff_id',
        'appointment_date',
        'total_price',
        'status',
        'notes',
    ];

    protected $casts = [
        'appointment_date' => 'datetime',
    ];

    public function user()//1-n
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function staff()
    {
        return $this->belongsTo(Staff::class, 'staff_id');
    }

    public function details()//1-n
    {
        return $this->hasMany(AppointmentDetail::class, 'appointment_id');
    }

    public function services()//n-n
    {
        return $this->belongsToMany(Service::class, 'appointment_details', 'appointment_id', 'service_id');
    }
}
