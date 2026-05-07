<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require "db.php";

$note_id = intval($_GET['id']);

if (!$note_id) {
    echo json_encode(["success" => false, "message" => "Missing note ID"]);
    exit;
}

// NOTE NAME
$stmt = $conn->prepare("SELECT name FROM notes WHERE id=?");
$stmt->bind_param("i", $note_id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Note not found"]);
    exit;
}

$note_name = $res->fetch_assoc()["name"];

// PERFUMES
$query = "
SELECT p.id, p.name, p.brand, p.rating_value, p.url, pn.role
FROM perfume_notes pn
JOIN perfumes p ON pn.perfume_id = p.id
WHERE pn.note_id = ?
ORDER BY p.name ASC
";

$stmt2 = $conn->prepare($query);
$stmt2->bind_param("i", $note_id);
$stmt2->execute();
$p_res = $stmt2->get_result();

$perfumes = [];

while ($row = $p_res->fetch_assoc()) {
    // 🔥 URL'deki ters slashları temizle
    $row["url"] = stripslashes($row["url"]);
    $perfumes[] = $row;
}

echo json_encode([
    "success" => true,
    "note_name" => $note_name,
    "perfumes" => $perfumes
], JSON_UNESCAPED_UNICODE);
