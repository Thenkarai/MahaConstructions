<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageDetail extends Model
{
    use HasFactory;

    protected $table = 'package_details';

    protected $fillable = [
        'division',
        'tier',
        'title',
        'subtitle',
        'price_per_sqft',
        'description',
        'features',
        'inclusions',
        'exclusions',
        'is_highlighted',
        'warranty_years',
        'delivery_months'
    ];

    protected $casts = [
        'features' => 'array',
        'inclusions' => 'array',
        'exclusions' => 'array',
        'is_highlighted' => 'boolean',
    ];
}
