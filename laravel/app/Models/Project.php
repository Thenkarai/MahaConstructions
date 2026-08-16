<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $table = 'projects';

    protected $fillable = [
        'name',
        'client',
        'location',
        'budget',
        'completion_date',
        'duration',
        'architecture_style',
        'description',
        'image_urls',
        'video_url',
        'category',
        'is_featured'
    ];

    protected $casts = [
        'image_urls' => 'array',
        'is_featured' => 'boolean',
    ];
}
