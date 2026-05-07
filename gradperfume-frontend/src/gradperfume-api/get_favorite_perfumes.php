<?php
header("Content-Type: application/json");
require "db.php";

$user_id = $_GET["user_id"] ?? null;

if (!$user_id) {
    echo json_encode(["success" => false, "message" => "Missing user_id"]);
    exit;
}

$sql = $db->prepare("
    SELECT p.id, p.name, p.brand, p.imageUrl, p.rating_value, p.main_accords
    FROM favorite_perfumes f
    JOIN perfumes p ON p.id = f.perfume_id
    WHERE f.user_id = ?
");
$sql->execute([$user_id]);
$data = $sql->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "favorites" => $data
]);
