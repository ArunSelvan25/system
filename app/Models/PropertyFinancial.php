<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PropertyFinancial extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'monthly_rent',
        'security_deposit',
        'maintenance_charges',
        'lease_duration',
        'rent_due_day',
        'is_negotiable',
        'payment_frequency',
        'charges',
        'status',
        'currency',
    ];

    protected $casts = [
        'charges' => 'array',
        'is_negotiable' => 'boolean',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}

