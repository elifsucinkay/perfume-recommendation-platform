<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

echo json_encode([
    "success" => true,
    "message" => "Logout successful. Please remove token on client side."
]);
