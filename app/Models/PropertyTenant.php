<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PropertyTenant extends Model
{
    use HasFactory;

    protected $table = 'property_tenant';

    protected $fillable = ['property_id', 'user_id', 'start_date', 'end_date', 'status'];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

