import { addLeadingZeros, getCookie, query, setCookie } from "./tools.js";
export function initPage() {
    // show cashpoint selector
    document.getElementById("div_select_cashpoint").style.display = "block";
    document.getElementById("div_cashpoint_content").style.display = "none";
}
function updateHeader() {
    setTimeout(function () {
        let currentDate = new Date();
        document.getElementById("header").innerText = "Kasse " + getCookie("cashpoint_customer") + " • " + currentDate.getDate() + "." + addLeadingZeros((currentDate.getMonth() + 1), 2) + "." + currentDate.getFullYear() + " • " + addLeadingZeros(currentDate.getHours(), 2) + ":" + addLeadingZeros(currentDate.getMinutes(), 2);
        updateHeader();
    }, 1000);
}
export function initialize_cashpoint() {
    // show cashpoint data
    document.getElementById("div_select_cashpoint").style.display = "none";
    document.getElementById("div_cashpoint_content").style.display = "block";
    // get cashpoint data
    const cashpoint = document.getElementById("input_select_cashpoint_id").value.toString();
    setCookie("cashpoint_customer", cashpoint, 1);
    updateHeader();
    update();
}
function update() {
    setTimeout(function () {
        let message = query("customer.get_messages", getCookie("cashpoint_customer"));
        if (message !== "EMPTY") {
            query("customer.delete_message", message.split(";")[0]);
            if (message.split(";")[1] === "-1") {
                document.getElementById("div_cashpoint_customer_info").parentNode.style.opacity = "0";
            }
            else {
                message = message.split(";");
                document.getElementById("div_cashpoint_customer_info").innerHTML = message[2];
                document.getElementById("div_cashpoint_customer_info").parentNode.style.opacity = "1";
            }
            update();
            return;
        }
        let content_before = document.getElementById("content").innerHTML;
        const orderlist = query("customer.live_orders", getCookie("cashpoint_customer")).split("\n");
        let total = 0;
        let cups = 0;
        let html = "<table class='live_order'><tr><th id='header_name'>Name</th><th id='header_amount'>Anzahl</th><th id='header_temp_total'>Zwischensumme</th></tr>";
        orderlist.forEach(function (item) {
            if (item.replaceAll(";", "") !== "" && item !== "EMPTY") {
                item = item.split(";");
                let amount = item[1];
                let price = item[2];
                cups = cups + Number(amount);
                total = total + (amount * price);
                let full_price = (amount * price / 100).toFixed(2);
                html = `${html}<tr><td>${item[0]}</td><td class="amount">${item[1]}</td><td>${full_price} €</td></tr>`;
            }
        });
        if (total)
            html = `${html}<tr style="border-top: 3pt double #ffffff"><td>Pfand (1€ pro Becher) </td><td class="amount">${cups}</td><td>${cups}.00 €</td></tr>`;
        html = html + "<tr class='invisible_row'><td></td><td></td><td></td></tr>";
        html = html + "</table>";
        if (orderlist.length === 1) { // Element 0 is always "EMPTY" or the first value
            document.getElementById("footer").innerHTML = "Herzlich willkommen!";
            document.getElementById("content").innerHTML = "";
        }
        else {
            document.getElementById("content").innerHTML = html;
            if (content_before !== document.getElementById("content").innerHTML) {
                document.getElementById("content").scrollTop = document.getElementById("content").scrollHeight;
            }
            document.getElementById("footer").innerHTML = "Gesamt: " + ((total / 100) + cups).toFixed(2) + " €";
        }
        update();
    }, 250);
}
//# sourceMappingURL=customer.js.map