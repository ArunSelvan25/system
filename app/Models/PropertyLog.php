<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PropertyLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'user_id',
        'action_type', // create, update, delete, assign_tenant, etc.
        'description',
        'data_snapshot',
    ];

    protected $casts = [
        'data_snapshot' => 'array',
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

