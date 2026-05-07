<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data["user_id"] ?? 0;

if (!$user_id) {
  echo json_encode(["success" => false, "message" => "No user id"]);
  exit;
}

/* soft delete (önerilen) */
$q = $conn->prepare("UPDATE users SET is_active=0 WHERE id=?");
$q->bind_param("i", $user_id);
$q->execute();

echo json_encode([
  "success" => true,
  "message" => "Account deleted"
]);
