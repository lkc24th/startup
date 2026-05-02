<?php

// Chuyển hướng các yêu cầu file tĩnh (ảnh, css, js...) vào thư mục public
if (file_exists(__DIR__ . '/../public' . $_SERVER['REQUEST_URI'])) {
    return false;
}

// Đường dẫn trỏ đến file autoload.php trong thư mục vendor
require __DIR__ . '/../vendor/autoload.php';

// Đường dẫn trỏ đến file app.php trong thư mục bootstrap
$app = require_once __DIR__ . '/../bootstrap/app.php';

// Khởi tạo kernel và xử lý yêu cầu
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

$response->send();

$kernel->terminate($request, $response);
