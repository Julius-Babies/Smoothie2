<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Produkte</title>
    <link rel="stylesheet" type="text/css" href="css/product_overview.css">
</head>
<body>
<?php
$conn = new mysqli("localhost", "webserver", "cloudiaserver");
$result = $conn->query("SELECT smoothie2.products.name AS product_name, smoothie2.products.description AS product_description, smoothie2.products.price AS product_price, smoothie2.ingredients.name AS ingredient_name, smoothie2.ingredients.available AS ingredient_exists FROM smoothie2.products LEFT JOIN smoothie2.ingredient_assign ia on products.id = ia.product_id LEFT JOIN smoothie2.ingredients ON ia.ingredient_id = ingredients.id");

$product_data = array();

while ($row = mysqli_fetch_assoc($result)) {
    $product_data[$row["product_name"]][0] = array($row["product_price"], $row["product_description"]);
    $product_data[$row["product_name"]][1][] = array($row["ingredient_name"], $row["ingredient_exists"]);
}

foreach ($product_data as $product_name => $product) {
    echo "$product_name (" . $product[0][0] . " ct): <i>" . $product[0][1] . "</i> - benötigt: ";
    foreach ($product[1] as $ingredient) {
        if ($ingredient[1]) {
            echo "<span style='color: #00ff00' class='ingredient' id='ingredient_$ingredient[0]_0'>$ingredient[0]</span>, ";
        } else {
            echo "<span style='color: #ff0000' class='ingredient' id='ingredient_$ingredient[0]_1'>$ingredient[0]</span>, ";
        }
    }
    echo "<br>";
}
?>

</body>
<script type="module">
    import {initPage} from "./js/product_overview.js";
    document.querySelector("body").onload = function () { initPage(); };
</script>
</html>