<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PropertyImage extends Model
{
    use HasFactory;

    protected $fillable = ['property_id', 'path', 'alt_text', 'status'];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}

