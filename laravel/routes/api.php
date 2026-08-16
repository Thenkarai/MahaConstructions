<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\MediaUploadController;

/*
|--------------------------------------------------------------------------
| API Routes for Maha Construction Platform
|--------------------------------------------------------------------------
*/

// Testimonials API
Route::get('/testimonials', [ApiController::class, 'getTestimonials']);
Route::post('/testimonials', [ApiController::class, 'createTestimonial']);
Route::put('/testimonials/{id}', [ApiController::class, 'updateTestimonial']);
Route::delete('/testimonials/{id}', [ApiController::class, 'deleteTestimonial']);

// Projects API
Route::get('/projects', [ApiController::class, 'getProjects']);
Route::post('/projects', [ApiController::class, 'createProject']);
Route::put('/projects/{id}', [ApiController::class, 'updateProject']);
Route::delete('/projects/{id}', [ApiController::class, 'deleteProject']);

// Packages API
Route::get('/packages', [ApiController::class, 'getPackages']);
Route::post('/packages', [ApiController::class, 'createPackage']);
Route::put('/packages/{id}', [ApiController::class, 'updatePackage']);
Route::delete('/packages/{id}', [ApiController::class, 'deletePackage']);

// Settings API
Route::get('/settings/{key}', [ApiController::class, 'getSetting']);
Route::post('/settings', [ApiController::class, 'saveSetting']);

// Leads & Contact API
Route::post('/leads/contact', [ApiController::class, 'submitContact']);

// FAQs & Blogs
Route::get('/faqs', [ApiController::class, 'getFaqs']);
Route::get('/blogs', [ApiController::class, 'getBlogs']);

// Media Uploads
Route::post('/upload', [MediaUploadController::class, 'upload']);
Route::post('/media/upload', [MediaUploadController::class, 'upload']);
