<?php

$cashpoint = $_POST["cashpoint"];
$conn = new mysqli("localhost", "webserver", "cloudiaserver");

$conn->query("DELETE FROM smoothie2.live_orders WHERE cashpoint = $cashpoint");
$result = $conn->query("SELECT * FROM smoothie2.products");
while ($row = mysqli_fetch_assoc($result)) {
    $conn->query("INSERT INTO smoothie2.live_orders (product_id, amount, cashpoint) VALUES ($row[id], 0, $cashpoint)");
}

echo "OK";