<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"] ?? 0;
if (!$id) {
  echo json_encode(["success" => false, "message" => "No user id"]);
  exit;
}

$stmt = $conn->prepare("
  UPDATE users SET
    name = ?,
    surname = ?,
    bio = ?,
    birthdate = ?,
    profile_image = ?
  WHERE id = ?
");

$stmt->bind_param(
  "sssssi",
  $data["name"],
  $data["surname"],
  $data["bio"],
  $data["birthdate"],
  $data["profile_image"],
  $id
);

$stmt->execute();

$res = $conn->query("SELECT * FROM users WHERE id = $id");
echo json_encode([
  "success" => true,
  "user" => $res->fetch_assoc()
]);
