<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PropertyDocument extends Model
{
    use HasFactory;

    protected $fillable = ['property_id', 'document_type', 'path', 'status'];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}

