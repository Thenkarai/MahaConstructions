<?php

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Check If The Application Is Under Maintenance
|--------------------------------------------------------------------------
*/
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
*/
if (file_exists(__DIR__.'/../vendor/autoload.php')) {
    require __DIR__.'/../vendor/autoload.php';
}

/*
|--------------------------------------------------------------------------
| Run The Application / Static Fallback
|--------------------------------------------------------------------------
*/
if (file_exists(__DIR__.'/../bootstrap/app.php') && file_exists(__DIR__.'/../vendor/autoload.php')) {
    $app = require_once __DIR__.'/../bootstrap/app.php';
    $kernel = $app->make(Kernel::class);
    $response = $kernel->handle(
        $request = Request::capture()
    )->send();
    $kernel->terminate($request, $response);
} else {
    // Single Page Application Static Asset Fallback
    $uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
    $filePath = __DIR__ . $uri;

    if ($uri !== '/' && file_exists($filePath) && !is_dir($filePath)) {
        $mime = mime_content_type($filePath);
        header("Content-Type: " . $mime);
        readfile($filePath);
        exit;
    }

    require_once __DIR__ . '/index.html';
}
