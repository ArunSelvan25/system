<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PropertyTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'user_id',
        'transaction_type',
        'amount',
        'currency',
        'payment_method',
        'reference_id',
        'transaction_date',
        'notes',
        'invoice_number',
        'receipt_path',
        'status'
    ];

    protected $casts = [
        'transaction_date' => 'date',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

