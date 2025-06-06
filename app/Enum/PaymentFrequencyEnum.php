<?php

namespace App\Enum;

enum PaymentFrequencyEnum: string
{
    case Monthly = 'monthly';
    case Quarterly = 'quarterly';
    case Yearly = 'yearly';

    public static function options(): array {
        return [
            ['value' => self::Monthly, 'label' => 'monthly'],
            ['value' => self::Quarterly, 'label' => 'quarterly'],
            ['value' => self::Yearly, 'label' => 'yearly'],
        ];
    }
}
