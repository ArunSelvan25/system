<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Property extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'property_id',
        'user_id',
        'property_name',
        'property_type',
        'description',
        'property_status',
        'status',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'postal_code',
        'country',
        'latitude',
        'longitude',
        'status'
    ];

    protected static function booted(): void
    {
        static::creating(function (Property $property) {
            $property->property_id = 'PRP-' . now()->getTimestampMs();
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function amenities()
    {
        return $this->belongsToMany(Amenity::class)->withPivot('status')->withTimestamps();
    }

    public function images()
    {
        return $this->hasMany(PropertyImage::class);
    }

    public function documents()
    {
        return $this->hasMany(PropertyDocument::class);
    }

    public function financials()
    {
        return $this->hasOne(PropertyFinancial::class);
    }

    public function tenants()
    {
        return $this->belongsToMany(User::class, 'property_tenant')
                    ->withPivot('start_date', 'end_date', 'status')
                    ->withTimestamps();
    }

    public function transactions()
    {
        return $this->hasMany(PropertyTransaction::class);
    }

    public function logs()
    {
        return $this->hasMany(PropertyLog::class);
    }
}

