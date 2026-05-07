<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require __DIR__ . "/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");

if ($email === "" || $password === "") {
    echo json_encode(["success" => false, "message" => "Email or password missing"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT id, username, email, password_hash, name, surname, birthdate, bio, profile_image 
    FROM users
    WHERE email = ? AND is_active = 1
");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit;
}

$user = $result->fetch_assoc();

// Password doğrulama
if (!password_verify($password, $user["password_hash"])) {
    echo json_encode(["success" => false, "message" => "Wrong password"]);
    exit;
}

// Token oluşturma
$token = base64_encode(json_encode([
    "id" => $user["id"],
    "email" => $user["email"],
    "username" => $user["username"]
]));

unset($user["password_hash"]); // Şifreyi asla frontende gönderme

echo json_encode([
    "success" => true,
    "token" => $token,
    "user" => $user
]);
?>
