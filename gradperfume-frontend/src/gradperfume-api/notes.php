<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require "db.php";

$conn->set_charset("utf8mb4");

$limit  = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
$search = isset($_GET['search']) ? trim($_GET['search']) : "";

if ($search !== "") {
    $stmt = $conn->prepare("
        SELECT id, name
        FROM notes
        WHERE name LIKE CONCAT('%', ?, '%')
        ORDER BY name ASC
        LIMIT ? OFFSET ?
    ");
    $stmt->bind_param("sii", $search, $limit, $offset);
} else {
    $stmt = $conn->prepare("
        SELECT id, name
        FROM notes
        ORDER BY name ASC
        LIMIT ? OFFSET ?
    ");
    $stmt->bind_param("ii", $limit, $offset);
}

$stmt->execute();
$res = $stmt->get_result();

$data = $res->fetch_all(MYSQLI_ASSOC);

echo json_encode([
    "success" => true,
    "data" => $data,
    "limit" => $limit,
    "offset" => $offset
], JSON_UNESCAPED_UNICODE);
