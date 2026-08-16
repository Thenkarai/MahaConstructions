<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes for Maha Construction Platform
|--------------------------------------------------------------------------
*/

// Serve single-page web app entry view
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');
