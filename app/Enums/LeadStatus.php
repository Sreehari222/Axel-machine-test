<?php

namespace App\Enums;

enum LeadStatus: string
{
    case New = 'New';
    case Contacted = 'Contacted';
    case Converted = 'Converted';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
