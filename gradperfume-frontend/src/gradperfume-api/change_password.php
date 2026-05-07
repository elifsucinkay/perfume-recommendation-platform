<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data["user_id"] ?? 0;
$old = $data["old"] ?? "";
$new = $data["new"] ?? "";

if (!$user_id || !$old || !$new) {
  echo json_encode([
    "success" => false,
    "message" => "Missing data"
  ]);
  exit;
}

$q = $conn->prepare("SELECT password_hash FROM users WHERE id=?");
$q->bind_param("i", $user_id);
$q->execute();
$res = $q->get_result();

if ($res->num_rows === 0) {
  echo json_encode(["success" => false, "message" => "User not found"]);
  exit;
}

$row = $res->fetch_assoc();

if (!password_verify($old, $row["password_hash"])) {
  echo json_encode([
    "success" => false,
    "message" => "Old password is incorrect"
  ]);
  exit;
}

$newHash = password_hash($new, PASSWORD_DEFAULT);

$u = $conn->prepare("UPDATE users SET password_hash=? WHERE id=?");
$u->bind_param("si", $newHash, $user_id);
$u->execute();

echo json_encode([
  "success" => true,
  "message" => "Password updated successfully"
]);
