<?php


function stringStartsWith($haystack, $needle, $case = true): bool
{
    if ($case) {
        return strpos($haystack, $needle) === 0;
    }
    return stripos($haystack, $needle) === 0;
}

$type = $_POST["type"];
$data = $_POST["data"];
if ($type === "id_viewer.get_ids") {
    $sql = "SELECT id, status FROM smoothie2.orders ORDER BY change_time";
    $data = "id;status";
} else if ($type === "id_viewer.get_products") {
    $sql = "SELECT smoothie2.products.name  AS product_name, smoothie2.products.price AS product_price, MIN(i.available) AS ingredients_exists FROM smoothie2.products LEFT JOIN smoothie2.ingredient_assign ia on products.id = ia.product_id LEFT JOIN smoothie2.ingredients i on i.id = ia.ingredient_id GROUP BY smoothie2.products.name";
    $data = "product_name;product_price;ingredients_exists";
} else if ($type === "customer.get_messages") {
    $data = explode(";", $data);
    $sql = "SELECT id, type, message FROM smoothie2.customer_info WHERE cashpoint = $data[0]";
    $data = "id;type;message";
} else if ($type === "customer.delete_message") {
    $data = explode(";", $data);
    $sql = "DELETE FROM smoothie2.customer_info WHERE id = $data[0]";
    $dats = "";
} else if ($type === "customer.live_orders") {
    $data = explode(";", $data);
    $sql = "SELECT products.name AS name, live_orders.amount AS amount, products.price AS price FROM smoothie2.live_orders INNER JOIN smoothie2.products ON live_orders.product_id = products.id WHERE cashpoint = $data[0] AND amount > 0";
    $data = "name;amount;price";
} else if ($type === "cuisine.get_orders") {
    $sql = "SELECT * FROM smoothie2.orders WHERE status = 0 OR status = 1 ORDER BY create_time";
    $data = "id;create_time;status";
} else if ($type === "cuisine.get_order_details") {
    $data = explode(";", $data);
    $sql = "SELECT * FROM smoothie2.order_details LEFT JOIN smoothie2.products ON order_details.product_id = products.id WHERE order_details.order_id = $data[0]";
    $data = "name;amount";
} else if ($type === "cuisine.update_status") {
    $data = explode(";", $data);
    $sql  = "UPDATE smoothie2.orders SET status = $data[1] WHERE id = $data[0]";
} else if ($type === "cashpoint.get_products") {
    $sql  = "SELECT smoothie2.products.name AS product_name, smoothie2.products.price AS product_price, MIN(smoothie2.ingredients.available) AS ingredients_exist FROM smoothie2.products LEFT JOIN smoothie2.ingredient_assign ON products.id = ingredient_assign.product_id LEFT JOIN smoothie2.ingredients ON smoothie2.ingredients.id = smoothie2.ingredient_assign.ingredient_id GROUP BY smoothie2.products.name ORDER BY products.name";
    $data = "product_name;product_price;ingredients_exist";
} else if ($type === "cashpoint.update_live_order") {
    $data = explode(";", $data);
    $sql  = "UPDATE smoothie2.live_orders SET amount = $data[2] WHERE product_id = (SELECT id FROM smoothie2.products WHERE name = '$data[1]' LIMIT 1) AND cashpoint = $data[0]";
    $data = "";
} else if ($type === "cashpoint.order") {
    $data = explode(";", $data);
    $sql  = "INSERT INTO smoothie2.orders (cashpoint, status) VALUES ('$data[0]', 0)";
    $data = "LAST_ROW_ID";
} else if ($type === "cashpoint.insert_message") {
    $data = explode(";", $data);
    $sql  = "INSERT INTO smoothie2.customer_info (type, cashpoint, message) VALUES (0, $data[0], '$data[1]')";
    $data = "";
} else if ($type === "cashpoint.insert_order_details") {
    $data = explode(";", $data);
    $sql  = "INSERT INTO smoothie2.order_details (order_id, product_id, amount) VALUES ($data[0], (SELECT id FROM smoothie2.products WHERE name = '$data[1]'), $data[2])";
    $data = "";
} else if ($type === "cashpoint.clear_messages") {
    $data = explode(";", $data);
    $sql = "INSERT INTO smoothie2.customer_info (type, cashpoint, message) VALUES (-1, $data[0], '')";
    $data = "";
} else if ($type === "administration.change_ingredient") {
    $data = explode(";", $data);
    $sql = "UPDATE smoothie2.ingredients SET available = $data[1] WHERE name = '$data[0]'";
    $data = "";
} else if ($type === "administration.get_product_data") {
    $sql = "SELECT smoothie2.products.name AS product_name, smoothie2.products.description AS product_description, smoothie2.products.price AS product_price, smoothie2.ingredients.name AS ingredient_name, smoothie2.ingredients.available AS ingredient_exists FROM smoothie2.products LEFT JOIN smoothie2.ingredient_assign ia on products.id = ia.product_id LEFT JOIN smoothie2.ingredients ON ia.ingredient_id = ingredients.id";
    $data = "product_name;product_description;product_price;ingredient_name;ingredient_exists";

} else {
    echo "NO DIRECT QUERIES ALLOWED";
    exit();
}

$conn = new mysqli("localhost", "webserver", "cloudiaserver");


if ($data !== "" && $data != "LAST_ROW_ID") {
    $result = $conn->query($sql);
    while ($row = mysqli_fetch_assoc($result)) {
        $columns = explode(";", $data);
        for ($i = 0; $i < count($columns); ++$i) {
            echo $row[$columns[$i]] . ";";
        }
        echo "\n";
    }
    if (mysqli_num_rows($result) === 0) {
        echo "EMPTY";
    }
} else {
    $conn->query($sql);
    if (stringStartsWith($sql, "INSERT") && $data == "LAST_ROW_ID") {
        echo mysqli_insert_id($conn);
    }
}

$conn->query("DELETE FROM smoothie2.live_orders WHERE amount < 0");