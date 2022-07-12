<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Analyse</title>
</head>
<body>

<p>
<form action="./analytics.php" method="get">
    <label>
        <input type="text" placeholder="Von (Stunde)" name="starthour" value="<?php echo $_GET["starthour"]; ?>">
    </label>
    <label>
        <input type="text" placeholder="Bis (Stunde)" name="endhour" value="<?php echo $_GET["endhour"]; ?>">
    </label>
    <label>
        <input type="text" placeholder="Tag" name="day" value="<?php echo $_GET["day"]; ?>">
    </label>
    <label>
        <input type="text" placeholder="Monat" name="month" value="<?php echo $_GET["month"]; ?>">
    </label>
    <label>
        <input type="text" placeholder="Jahr" name="year" value="<?php echo $_GET["year"]; ?>">
    </label>
    <label>
        <input type="text" placeholder="Interval" name="interval" value="<?php echo $_GET["interval"]; ?>">
    </label>
    <input type="submit" value="OK">
</form>

<h1>Gesamtübersicht</h1>
<table>
    <tr>
        <th>Name</th>
        <th>Anzahl</th>
        <th>Einnahmen</th>
        <th>Anzahl Grafisch</th>
    </tr>

    <?php

    $money_sum = 0;
    $smoothie_sum = 0;
    $day = $_GET["day"];
    $month = $_GET["month"];
    $year = $_GET["year"];
    $startHour = $_GET["starthour"];
    $endHour = $_GET["endhour"];

    $conn = new mysqli("localhost", "webserver", "cloudiaserver");
    $result = $conn->query("SELECT name, SUM(price * od.amount) AS money, SUM(amount) AS amount FROM smoothie2.products LEFT JOIN smoothie2.order_details od on products.id = od.product_id LEFT OUTER JOIN smoothie2.orders o on o.id = od.order_id WHERE HOUR(create_time) < $endHour AND HOUR(create_time) >= $startHour AND YEAR(create_time) = $year AND MONTH(create_time) = $month AND DAY(create_time) = $day GROUP BY name");
    while ($row = mysqli_fetch_assoc($result)) {
        $money_sum += $row["money"];
        $smoothie_sum += $row["amount"];
        $money = number_format($row["money"] / 100, 2, ",", ".");
        echo "<tr><td>$row[name]</td><td>$row[amount]</td><td>$money €</td><td><img src='img/bar.png' width='$row[amount]' height='20px' alt='Bar'></td></tr>";
    }
    $money_sum = number_format($money_sum / 100, 2, ",", ".");
    echo "<tr><th colspan='4'>Gesamt: $money_sum € ($smoothie_sum Smoothies verkauft)</th></tr>";


    ?>
</table>
<hr>
<h1>Nach Zeit (pro <?php $interval = $_GET["interval"];
    echo $interval; ?> Minuten)</h1>
<table style="">
    <tr>
        <th>Zeitfenster</th>
        <th>Bestellungen</th>
        <th>Balken</th>
    </tr>
    <?php

    $times = array();
    for ($i = $startHour; $i < $endHour; $i++) {
        for ($j = 0; $j < 60; $j = $j + $interval) {
            $times[] = "$i:$j";
        }
    }

    foreach ($times as $time) {
        $start_minute = explode(":", $time)[1];
        $end_minute = explode(":", $time)[1] + $interval - 1;
        $hour = explode(":", $time)[0];
        $result = $conn->query("SELECT COUNT(create_time) as counter FROM smoothie2.orders LEFT JOIN smoothie2.order_details od on orders.id = od.order_id LEFT JOIN smoothie2.products p on p.id = od.product_id WHERE MINUTE(create_time) < $end_minute AND MINUTE(create_time) >= $start_minute AND HOUR(create_time) = $hour AND YEAR(create_time) = $year AND MONTH(create_time) = $month AND DAY(create_time) = $day");
        while ($row = mysqli_fetch_assoc($result)) {
            echo "<tr><td>$time - $hour:$end_minute</td><td>$row[counter]</td><td><img src='img/bar.png' alt='bar' height='20px' width='$row[counter]'></td></tr>";
        }

    }

    ?>

</table>

</body>
</html>