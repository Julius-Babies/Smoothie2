// methods
// noinspection SqlInsertValues,JSDeprecatedSymbols

function init_page() {
    // show cashpoint selector
    document.getElementById("div_select_cashpoint").style.display = "block";
    document.getElementById("div_cashpoint_content").style.display = "none";
}

function initialize_cashpoint() {

    // show cashpoint data
    document.getElementById("div_select_cashpoint").style.display = "none";
    document.getElementById("div_cashpoint_content").style.display = "block";

    // get cashpoint data
    const cashpoint = document.getElementById("input_select_cashpoint_id").value.toString();
    const products  = query("SELECT * FROM smoothie2.products LEFT JOIN smoothie2.live_orders ON products.id = live_orders.product_id AND live_orders.cashpoint = " + cashpoint + " ORDER BY products.name ASC", "name;price;amount");
    let product_list = products.split("\n");
    const button = "<div onclick='addProduct(\"%NAME%\")' class='product_button'><span class='name'>%NAME%</span><span class'price'>%PRICE%</span><span class='amount'>%AMOUNT%</span><div class='remove'><span onclick='removeProduct(event, \"%NAME%\", false)'>-</span><span onclick='removeProduct(event, \"%NAME%\", true)'>CL</span></div></div>";
    document.getElementById("div_cashpoint_content_products").innerHTML = "";

    setCookie("cashpoint_staff", cashpoint, 1);

    let orderlist = Array();
    let total     = 0;

    // create buttons for every product
    product_list.forEach(function(item) {
        if (item !== "") {
            let current_product = item.split(";");
            let price = (current_product[1]/100).toFixed(2);
            let html = document.getElementById("div_cashpoint_content_products").innerHTML + button.replaceAll("%NAME%", current_product[0]).replaceAll("%PRICE%", price + " €");

            if (current_product[2] !== "") {
                html = html.replaceAll("%AMOUNT%", current_product[2]);
                orderlist.push([current_product[0], current_product[2], ((current_product[1]*current_product[2])/100).toFixed(2) + " €"]);
                total = total + current_product[1]*current_product[2];
            } else {
                html = html.replaceAll("%AMOUNT%", "0");
            }
            document.getElementById("div_cashpoint_content_products").innerHTML = html;
        }
    });

    // set orderlist
    let html = "";
    html = html + "<div onclick='order()' class='order_button'>OK</div><div class='clear_order' onclick='clearOrder()'>CL</div><p>"
    html = html + "<h1>Aktive Bestellung</h1><table><tr><th>Name</th><th>Anzahl</th><th>Zwischentotal</th></tr>";
    orderlist.forEach(function (item) {
        html = html + "<tr><td>" + item[0] + "</td><td>" + item[1] + "</td><td>" + item[2] + "</td></tr>";
    })
    document.getElementById("div_cashpoint_content_orderlist").innerHTML = html + "</table><p class='total'>Total: " + (total/100).toFixed(2) + " €</p>"
}

function addProduct(name) {
    if (query(`SELECT * FROM smoothie2.live_orders WHERE cashpoint = ${getCookie("cashpoint_staff")} AND product_id = (SELECT id FROM smoothie2.products WHERE name = "${name}" LIMIT 1)`, "id") === "EMPTY") {
        query(`INSERT INTO smoothie2.live_orders (product_id, amount, cashpoint) VALUES ((SELECT id FROM smoothie2.products WHERE name = "${name}" LIMIT 1),1,${getCookie("cashpoint_staff")});`, "")
    } else {
        query(`UPDATE smoothie2.live_orders SET amount = amount + 1 WHERE cashpoint = ${getCookie("cashpoint_staff")} AND product_id = (SELECT id FROM smoothie2.products WHERE name = "${name}" LIMIT 1)`, "");
    }
    initialize_cashpoint();
}

function removeProduct(e, name, deleteAll) {
    e.stopPropagation();
    if (deleteAll) {
        query(`DELETE FROM smoothie2.live_orders WHERE cashpoint = ${getCookie("cashpoint_staff")} AND product_id = (SELECT id FROM smoothie2.products WHERE name = "${name}" LIMIT 1)`, "");
    } else {
        query(`UPDATE smoothie2.live_orders SET amount = amount - 1 WHERE cashpoint = ${getCookie("cashpoint_staff")} AND product_id = (SELECT id FROM smoothie2.products WHERE name = "${name}" LIMIT 1)`, "")
    }
    initialize_cashpoint();
}

function clearOrder() {
    if (confirm("Bist du sicher?")) {
        query("DELETE FROM smoothie2.live_orders WHERE cashpoint = " + getCookie("cashpoint_staff"), "");
        initialize_cashpoint();
    }
}

function order() {
    let id = query("INSERT INTO smoothie2.orders (cashpoint, create_time, status) VALUES (" + getCookie("cashpoint_staff") + ", NOW(), 0)", "LAST_ROW_ID");
    let orderlist = query("SELECT * FROM smoothie2.live_orders WHERE cashpoint = " + getCookie("cashpoint_staff"), "product_id;amount").split("\n");
    orderlist.forEach(function (item) {
        let entry = item.split(";");
        query("INSERT INTO smoothie2.order_details (order_id, product_id, amount) VALUES (" + id + ", " + entry[0] + ", " + entry[1] + ")", "");
    });
    query("DELETE FROM smoothie2.live_orders WHERE cashpoint = " + getCookie("cashpoint_staff"), "");
    initialize_cashpoint();
}