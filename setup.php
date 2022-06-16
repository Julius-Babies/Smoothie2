<?php
// setup database

$conn = new mysqli("localhost", "webserver", "cloudiaserver");
$conn->query("CREATE DATABASE IF NOT EXISTS smoothie2");
$conn->query("CREATE TABLE IF NOT EXISTS smoothie2.products (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64),
    `price` INT,
    description TEXT)
    
");

$conn->query("CREATE TABLE IF NOT EXISTS smoothie2.badges (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    text VARCHAR(32)
)");

$conn->query("CREATE TABLE IF NOT EXISTS smoothie2.product_badges (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    smoothie_id INT,
    badge_id INT, 
    FOREIGN KEY (smoothie_id) REFERENCES products(id),
    FOREIGN KEY (badge_id) REFERENCES badges(id)
)");

$conn->query("CREATE TABLE IF NOT EXISTS smoothie2.live_orders (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    amount INT,
    cashpoint INT,
    FOREIGN KEY (product_id) REFERENCES products(id)
)");

$conn->query("CREATE TABLE IF NOT EXISTS smoothie2.orders (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    status INT,
    cashpoint INT,
    create_time DATETIME
)");

$conn->query("CREATE TABLE IF NOT EXISTS smoothie2.order_details (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    amount INT,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
)")

?>