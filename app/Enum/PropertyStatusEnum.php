<?php

namespace App\Enum;

enum PropertyStatusEnum: string
{
    case Available = 'available';
    case Rented = 'rented';
    case Maintenance = 'maintenance';
    case Sold = 'sold';

    public static function options(): array {
        return [
            ['value' => self::Available, 'label' => 'available'],
            ['value' => self::Rented, 'label' => 'rented'],
            ['value' => self::Maintenance, 'label' => 'maintenance'],
        ];
    }
}
