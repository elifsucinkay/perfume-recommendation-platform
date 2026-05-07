<?php
// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "db.php";

$input = json_decode(file_get_contents("php://input"), true);

$username  = $input["username"] ?? "";
$email     = $input["email"] ?? "";
$password  = $input["password"] ?? "";
$name      = $input["name"] ?? "";
$surname   = $input["surname"] ?? "";
$birthdate = $input["birthdate"] ?? NULL;
$bio       = $input["bio"] ?? NULL;

if (!$username || !$email || !$password) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$stmt = $conn->prepare("SELECT id FROM users WHERE username=? OR email=?");
$stmt->bind_param("ss", $username, $email);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Username or email already exists"]);
    exit;
}

$hash = password_hash($password, PASSWORD_BCRYPT);

$stmt = $conn->prepare("
    INSERT INTO users (username, email, password_hash, name, surname, birthdate, bio) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
");
$stmt->bind_param("sssssss", $username, $email, $hash, $name, $surname, $birthdate, $bio);
$stmt->execute();

echo json_encode(["success" => true]);
