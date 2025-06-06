<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Amenity;
use App\Models\PropertyType;

class PropertyMasterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            ['name' => 'Apartment', 'status' => 1],
            ['name' => 'Villa', 'status' => 1],
            ['name' => 'Studio', 'status' => 1],
            ['name' => 'Penthouse', 'status' => 1],
        ];

        foreach ($types as $type) {
            PropertyType::updateOrCreate(
                ['name' => $type['name']],
                ['status' => $type['status']]
            );
        }

         $amenities = [
            ['name' => 'Swimming Pool', 'status' => 1],
            ['name' => 'Gym', 'status' => 1],
            ['name' => 'Parking', 'status' => 1],
            ['name' => 'Security', 'status' => 1],
            ['name' => 'WiFi', 'status' => 1],
            ['name' => 'Power Backup', 'status' => 1],
        ];

        foreach ($amenities as $amenity) {
            Amenity::updateOrCreate(
                ['name' => $amenity['name']],
                ['status' => $amenity['status']]
            );
        }
    }
}
