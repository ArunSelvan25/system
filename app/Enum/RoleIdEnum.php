<?php

namespace App\Enum;

enum RoleIdEnum: string
{
    case ADMIN = '1';
    case OWNER = '2';
    case TENANT = '3';

    public function label(): string
    {
        return match($this) {
            self::ADMIN => 'Admin',
            self::OWNER => 'Owner',
            self::TENANT => 'Tenant',
        };
    }

    public static function toArray(): array
    {
        return array_map(
            fn (self $case) => [
                'value' => $case->value,
                'label' => $case->label(),
            ],
            self::cases()
        );
    }
}
