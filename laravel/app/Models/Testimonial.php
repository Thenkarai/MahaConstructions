<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $table = 'testimonials';

    protected $fillable = [
        'client_name',
        'client_role',
        'rating',
        'feedback',
        'image_url',
        'video_url',
        'project_name',
        'duration'
    ];
}
