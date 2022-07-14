import {query, getCookie, setCookie, ajax, getTranslationOfID} from "./tools.js";

var products_map = new Map();
var given = "";
var orderlist;

export function initPage() {
    // show cashpoint selector
    document.getElementById("div_select_cashpoint").style.display = "block";
    document.getElementById("div_cashpoint_content").style.display = "none";
    document.getElementById("screen_lock").style.display = "none";
    document.getElementById("div_cashpoint_content_payment_background").style.display = "none";
}

export function initCashpoint() {

    given = "";

    // show cashpoint data
    document.getElementById("div_select_cashpoint").style.display = "none";
    document.getElementById("div_cashpoint_content").style.display = "block";
    document.getElementById("div_cashpoint_content_payment").style.display = "none";
    document.getElementById("div_cashpoint_content_payment_background").style.display = "none";

    // get product data
    const cashpoint = (<HTMLInputElement>document.getElementById("input_select_cashpoint_id")).value.toString();
    const products = query("cashpoint.get_products");
    let product_list = products.split("\n");

    ajax("./inc/reset_order.ajax.php", "POST", `cashpoint=${cashpoint}`, false);

    setCookie("cashpoint_staff", cashpoint, 1);

    // create buttons for every product
    product_list.forEach(function (item) {
        if (item !== "") {
            let current_product = item.split(";");

            // key: name > value0 price; value1 available; value2 amount; value3 id
            products_map.set(current_product[0], [current_product[1], current_product[2], 0, current_product[3]]);
        }
    });
    updateUI();
}

function updateUI() {
    document.getElementById("div_cashpoint_content_products").innerHTML = "";
    document.getElementById("div_cashpoint_content_orderlist").innerHTML = "";

    orderlist = Array();

    // create buttons for every product
    products_map.forEach(function (value, key) {
        let product_button = document.createElement("div");
        if (value[1] !== "0") {
            product_button.addEventListener("click", function () { addProduct(key); })
        } else {
            product_button.classList.add("disabled");
        }
        product_button.classList.add("product_button");
        product_button.id = key;

        // span name
        let product_button_span_name = document.createElement("span");
        product_button_span_name.classList.add("name");
        product_button_span_name.innerText = "[" + value[3] + "] " + key;
        product_button.appendChild(product_button_span_name);

        // span price
        let product_button_span_price = document.createElement("span");
        product_button_span_price.classList.add("price");
        product_button_span_price.innerText = (parseInt(value[0]) / 100).toFixed(2) + " €";
        product_button.appendChild(product_button_span_price);

        // span amount
        let product_button_span_amount = document.createElement("span");
        product_button_span_amount.classList.add("price");
        product_button_span_amount.innerText = value[2];
        product_button.appendChild(product_button_span_amount);

        // div remove
        let product_button_div_remove = document.createElement("div");
        product_button_div_remove.classList.add("remove");

        // span remove one
        let product_button_remove_one = document.createElement("span");
        product_button_remove_one.innerText = "-";
        product_button_remove_one.addEventListener("click", function (e) { removeProduct(e, key, false) });
        product_button_div_remove.appendChild(product_button_remove_one);

        // span remove all
        let product_button_remove_all = document.createElement("span");
        product_button_remove_all.innerText = "CL";
        product_button_remove_all.addEventListener("click", function (e) { removeProduct(e, key, true) });
        product_button_div_remove.appendChild(product_button_remove_all);

        product_button.appendChild(product_button_div_remove);
        document.getElementById("div_cashpoint_content_products").appendChild(product_button);


        if (value[2] !== 0) {
            orderlist.push([key, value[2], value[2] * value[0]]);
        }
    });

    // set orderlist

    // prepare order button
    let prepare_order_button = document.createElement("div");
    prepare_order_button.addEventListener("click", function () { prepareOrder(); })
    prepare_order_button.innerText = "Weiter";
    prepare_order_button.style.marginRight = "1pt"
    prepare_order_button.style.marginBottom = "1pt"
    prepare_order_button.classList.add("order_button");

    // clear order button
    let clear_order_button = document.createElement("div");
    clear_order_button.addEventListener("click", function () { clearOrder(); });
    clear_order_button.innerText = "CL";
    clear_order_button.style.marginLeft = "1pt";
    clear_order_button.style.marginBottom = "1pt";
    clear_order_button.classList.add("clear_order")

    // close customer window
    let clear_customer_window_button = document.createElement("div");
    clear_customer_window_button.classList.add("clear_message");
    clear_customer_window_button.addEventListener("click", function () { clearCustomerWindow(); });
    clear_customer_window_button.innerText = "Close information window on customer screen";

    // heading
    let header = document.createElement("h1");
    header.innerText = "Aktuelle Bestellung";


    let total_span = document.createElement("span");
    total_span.classList.add("div_cashpoint_content_payment_info_sum");
    total_span.style.padding = "2pt";
    total_span.style.border = "1pt solid red";
    total_span.style.marginTop = "2pt";

    document.getElementById("div_cashpoint_content_orderlist").appendChild(prepare_order_button);
    document.getElementById("div_cashpoint_content_orderlist").appendChild(clear_order_button);
    document.getElementById("div_cashpoint_content_orderlist").appendChild(document.createElement("br"));
    document.getElementById("div_cashpoint_content_orderlist").appendChild(clear_customer_window_button);
    document.getElementById("div_cashpoint_content_orderlist").appendChild(header);
    document.getElementById("div_cashpoint_content_orderlist").appendChild(total_span);

    // table
    let order_table = document.createElement("table");

    // table header
    let header_row = document.createElement("tr");
    header = document.createElement("th");
    header.innerText = "Name";
    header_row.appendChild(header);
    header = document.createElement("th");
    header.innerText = "Anzahl";
    header_row.appendChild(header);
    header = document.createElement("th");
    header.innerText = "Zwischentotal";
    header_row.appendChild(header);

    order_table.appendChild(header_row);


    orderlist.forEach(function (item) {
        let row = document.createElement("tr");
        let colName = document.createElement("td");
        colName.innerText = item[0];
        row.appendChild(colName);

        let colAmount = document.createElement("td");
        colAmount.innerText = item[1];
        row.appendChild(colAmount);

        let colPrice = document.createElement("td");
        colPrice.innerText = `${(item[2] / 100).toFixed(2)} €`
        row.appendChild(colPrice);
        order_table.appendChild(row);

        console.log("1")
    });
    console.log("2")
    document.getElementById("div_cashpoint_content_orderlist").appendChild(order_table);


    setTimeout(function () {
        updateLiveOrders()
    }, 0);

    updateMoneyUI();
}

function updateLiveOrders() {
    products_map.forEach(function (value, key) {
        query("cashpoint.update_live_order", getCookie("cashpoint_staff") + ";" + key + ";" + value[2]);
    });
}

function addProduct(name) {
    products_map.set(name, [products_map.get(name)[0], products_map.get(name)[1], products_map.get(name)[2] + 1, products_map.get(name)[3]]);
    updateUI();
}

function removeProduct(e, name, deleteAll) {
    e.stopPropagation();
    if (deleteAll) {
        products_map.set(name, [products_map.get(name)[0], products_map.get(name)[1], 0, products_map.get(name)[3]]);
    } else {
        if (products_map.get(name)[2] === 1 || products_map.get(name)[2] === 0) {
            products_map.set(name, [products_map.get(name)[0], products_map.get(name)[1], 0, products_map.get(name)[3]]);
        } else {
            products_map.set(name, [products_map.get(name)[0], products_map.get(name)[1], products_map.get(name)[2] - 1, products_map.get(name)[3]]);
        }
    }

    updateUI();
}

function prepareOrder() {
    if (orderlist.length !== 0) {
        document.getElementById("div_cashpoint_content_payment").style.display = "block";
        document.getElementById("div_cashpoint_content_payment_background").style.display = "block";
    } else {
        alert("Bestellung ist leer")
    }
}

export function returnToOrderscreen() {
    document.getElementById("div_cashpoint_content_payment").style.display = "none";
    document.getElementById("div_cashpoint_content_payment_background").style.display = "none";
    given = "";
    updateUI();
}

function clearOrder() {
    if (confirm("Bist du sicher?")) {
        products_map.forEach(function (value, key) {
            products_map.set(key, [value[0], value[1], 0, value[3]])
        });
        given = "";
        initCashpoint();
    }
}

export function order() {
    document.getElementById("screen_lock").style.display = "block";
    let id = query("cashpoint.order", getCookie("cashpoint_staff"));

    // id info
    let paragraph = document.createElement("p");
    let heading1 = document.createElement("span");
    heading1.innerText = getTranslationOfID(3)[0];
    heading1.style.fontSize = "74pt";
    paragraph.appendChild(heading1);
    heading1 = document.createElement("span");
    heading1.innerText = getTranslationOfID(3)[1];
    heading1.style.fontSize = "35pt";
    paragraph.appendChild(document.createElement("br"));
    paragraph.appendChild(heading1);
    paragraph.appendChild(document.createElement("br"));

    let id_div = document.createElement("span");
    id_div.innerText = id;
    id_div.classList.add("id");
    paragraph.appendChild(id_div);

    query("cashpoint.insert_message", `${getCookie("cashpoint_staff")};<p><span style="font-size: 74pt">${getTranslationOfID(3)[0]}</span><br><span style="font-size: 35pt">${getTranslationOfID(3)[1]}</span><br><span class="id">${id}</span>`);
    let total = 0;
    products_map.forEach(function (value, key) {
        if (value[2] !== 0) {
            query("cashpoint.insert_order_details",`${id};${key};${value[2]}`);
        }
        total = total + value[2] * value[0] + value[2] * 100;
    });

    document.getElementById("screen_lock").style.display = "none";
    initCashpoint();
}

function clearCustomerWindow() {
    query("cashpoint.clear_messages", getCookie("cashpoint_staff"));
}

export function updateGiven(update_char) {
    if (update_char === "CL") {
        given = "";
    } else if (update_char === "<") {
        given = given.slice(0, given.length - 1)
    } else {
        if ((update_char === "." && given.includes(".")) || (given.includes(".") && given.split(".")[1].length === 2)) {
            return;
        }

        if (given.length === 0 && update_char === ".") {
            update_char = "0."
        }
        if (given.startsWith("0") && update_char !== "." && !given.startsWith("0.")) {
            given = update_char;
        } else {
            given = given + update_char;
        }
    }
    updateMoneyUI();
}

function updateMoneyUI() {
    // add 0 after .
    if (given !== "") {
        if (given.includes(".") && given.split(".")[1].length === 1) {
            document.getElementById("payment_given").innerHTML = given + "<span style='color: gray'>0</span> €";
        } else if (given.includes(".") && given.split(".")[1].length === 0) {
            document.getElementById("payment_given").innerHTML = given + "<span style='color: gray'>00</span> €";
        } else {
            document.getElementById("payment_given").innerHTML = given + " €";
        }
    } else {
        document.getElementById("payment_given").innerHTML = "<br>";
    }

    let total = calculateTotal();

    // display total
    document.querySelectorAll('.div_cashpoint_content_payment_info_sum').forEach(function(button) {
        button.innerHTML = (total / 100).toFixed(2) + " €";
    });

    // display change
    document.querySelectorAll('.div_cashpoint_content_payment_info_change').forEach(function(button) {
        let tempGiven = given;
        if (tempGiven === null || tempGiven === undefined || tempGiven === "") {
            button.innerHTML = "-";
            return;
        }
        if (tempGiven.includes(".") && tempGiven.split(".")[1].length === 0) {
            tempGiven = tempGiven.split(".")[0];
        }
        button.innerHTML = ((parseInt(tempGiven) * 100 - total) / 100).toFixed(2).toString();
    });
}

function calculateTotal() {
    let total = 0;
    products_map.forEach(function (value) {
       total = total + value[2] * value[0] + value[2] * 100;
    });
    return total;
}