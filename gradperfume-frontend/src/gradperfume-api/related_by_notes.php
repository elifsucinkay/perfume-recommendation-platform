<?php
header("Content-Type: application/json; charset=UTF-8");
require "db.php";

$perfume_id = intval($_GET['id']);
if (!$perfume_id) {
    echo json_encode(["success" => false]);
    exit;
}

$q = $conn->prepare("
    SELECT DISTINCT p.id, p.name, p.brand, p.rating_value
    FROM perfume_notes pn
    JOIN perfume_notes pn2 ON pn.note_id = pn2.note_id AND pn2.perfume_id != pn.perfume_id
    JOIN perfumes p ON p.id = pn2.perfume_id
    WHERE pn.perfume_id = ?
    LIMIT 12
");
$q->bind_param("i", $perfume_id);
$q->execute();
$res = $q->get_result()->fetch_all(MYSQLI_ASSOC);

echo json_encode([
    "success" => true,
    "related" => $res
]);
