<?php

/**
 * Salon Configuration
 *
 * This file contains all configurable settings for the nail salon
 * including working hours, slot duration, and other operational settings.
 */

return [
    /*
    |--------------------------------------------------------------------------
    | Salon Basic Information
    |--------------------------------------------------------------------------
    */
    'name' => env('SALON_NAME', 'Nail Salon Pro'),
    'phone' => env('SALON_PHONE', '0123456789'),
    'email' => env('SALON_EMAIL', 'contact@nailsalon.com'),
    'address' => env('SALON_ADDRESS', '123 Main Street, City'),

    /*
    |--------------------------------------------------------------------------
    | Working Hours Configuration
    |--------------------------------------------------------------------------
    | Define opening and closing times for each day
    | Format: 'HH:MM' (24-hour format)
    */
    'working_hours' => [
        'monday' => ['open' => '09:00', 'close' => '18:00', 'closed' => false],
        'tuesday' => ['open' => '09:00', 'close' => '18:00', 'closed' => false],
        'wednesday' => ['open' => '09:00', 'close' => '18:00', 'closed' => false],
        'thursday' => ['open' => '09:00', 'close' => '18:00', 'closed' => false],
        'friday' => ['open' => '09:00', 'close' => '20:00', 'closed' => false],
        'saturday' => ['open' => '10:00', 'close' => '19:00', 'closed' => false],
        'sunday' => ['open' => '10:00', 'close' => '18:00', 'closed' => true],
    ],

    /*
    |--------------------------------------------------------------------------
    | Appointment Configuration
    |--------------------------------------------------------------------------
    */
    'appointment' => [
        // Duration of each appointment slot in minutes
        'slot_duration' => env('APPOINTMENT_SLOT_DURATION', 30),

        // Minimum advance booking time in hours
        'min_advance_hours' => env('APPOINTMENT_MIN_ADVANCE_HOURS', 1),

        // Maximum advance booking time in days
        'max_advance_days' => env('APPOINTMENT_MAX_ADVANCE_DAYS', 30),

        // Number of available slots per day
        'max_slots_per_day' => env('APPOINTMENT_MAX_SLOTS_PER_DAY', 20),

        // Cancellation deadline in hours before appointment
        'cancellation_hours' => env('APPOINTMENT_CANCELLATION_HOURS', 24),
    ],

    /*
    |--------------------------------------------------------------------------
    | Staff Configuration
    |--------------------------------------------------------------------------
    */
    'staff' => [
        // Maximum concurrent appointments per staff
        'max_concurrent_appointments' => env('STAFF_MAX_CONCURRENT', 1),

        // Enable automatic staff assignment
        'auto_assign' => env('STAFF_AUTO_ASSIGN', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Service Configuration
    |--------------------------------------------------------------------------
    */
    'service' => [
        // Default service category
        'default_category' => 'General',

        // Show inactive services (for admin only)
        'show_inactive' => false,
    ],

    /*
    |--------------------------------------------------------------------------
    | Notification Settings
    |--------------------------------------------------------------------------
    */
    'notifications' => [
        'email_enabled' => env('NOTIFICATION_EMAIL_ENABLED', true),
        'sms_enabled' => env('NOTIFICATION_SMS_ENABLED', false),
        'reminder_hours_before' => env('NOTIFICATION_REMINDER_HOURS', 24),
    ],

    /*
    |--------------------------------------------------------------------------
    | Booking Fee Configuration
    |--------------------------------------------------------------------------
    */
    'booking' => [
        // Deposit percentage for new bookings (0-100)
        'deposit_percentage' => env('BOOKING_DEPOSIT_PERCENTAGE', 30),

        // Enable online payment
        'online_payment_enabled' => env('BOOKING_ONLINE_PAYMENT', true),

        // Accepted payment methods
        'payment_methods' => ['cash', 'card', 'bank_transfer'],
    ],
];
