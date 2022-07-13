import {
    addLeadingZeros,
    getCookie,
    getTranslationOfID,
    iterateTroughClass,
    query,
    readTextFile,
    setCookie
} from "./tools.js";

interface Smoothie2Config extends Object {
    customer:Smoothie2Config_customer,
    enable_uk_video: boolean
}

interface Smoothie2Config_customer extends Object {
    header:boolean,
}

export function initPage() {
    // show cashpoint selector
    iterateTroughClass("select_cashpoint", function (element) {
        element.style.display = "inline-block";
    });

    // hide cashpoint stuff
    iterateTroughClass("cashpoint_data", function (element) {
        element.style.display = "none";
    });
}

function updateHeader() {
    setTimeout(function () {
        let currentDate = new Date();
        document.getElementById("header_span").innerText = "Kasse " + getCookie("cashpoint_customer") + " • " + currentDate.getDate() + "." + addLeadingZeros((currentDate.getMonth() + 1), 2) + "." + currentDate.getFullYear() + " • " + addLeadingZeros(currentDate.getHours(), 2) + ":" + addLeadingZeros(currentDate.getMinutes(), 2);
        updateHeader();
    }, 1000);
}

export function initialize_cashpoint() {
    // hide cashpoint select
    iterateTroughClass("select_cashpoint", function (element) {
        element.style.display = "none";
    });
    // show cashpoint data
    iterateTroughClass("cashpoint_data", function (element) {
        element.style.display = "inline-block";
    });

    // get cashpoint data
    const cashpoint = (<HTMLInputElement>document.getElementById("input_select_cashpoint_id")).value.toString();
    setCookie("cashpoint_customer", cashpoint, 1);

    let JSONData:Smoothie2Config;

    readTextFile("./config.json", function (text) {
        JSONData = JSON.parse(text);
        if (JSONData.customer.header) {
            (<HTMLElement>document.getElementById("header")).style.display = "table";
            updateHeader();
        } else {
            (<HTMLElement>document.getElementById("header")).style.display = "none";
            document.getElementById("video").style.removeProperty("height");
            document.getElementById("video").style.aspectRatio = "16 / 9";
        }

        if (JSONData.enable_uk_video) {
            (<HTMLVideoElement>document.getElementById("video")).src = "./imgassets/ads_uk.mp4";
        } else {
            (<HTMLVideoElement>document.getElementById("video")).src = "./imgassets/ads.mp4";
        }
    });
    update();
}

function update() {
    setTimeout(function () {

        let message = query("customer.get_messages", getCookie("cashpoint_customer"));
        if (message !== "EMPTY") {
            query("customer.delete_message", message.split(";")[0]);
            if (message.split(";")[1] === "-1") {
                (<HTMLElement>document.getElementById("div_cashpoint_customer_info").parentNode).style.opacity = "0";
                document.querySelector("video").style.display = "block";
            } else {
                message = message.split(";");
                document.getElementById("div_cashpoint_customer_info").innerHTML = message[2];
                document.querySelector("video").style.display = "none";
                (<HTMLElement>document.getElementById("div_cashpoint_customer_info").parentNode).style.opacity = "1";
            }
            update();
            return;
        }

        let content_before = document.getElementById("content").innerHTML;
        const orderlist = query("customer.live_orders", getCookie("cashpoint_customer"),).split("\n");
        let total = 0;
        let cups = 0;
        let html = "<table class='live_order'>";
        orderlist.forEach(function (item) {
            if (item.replaceAll(";", "") !== "" && item !== "EMPTY") {
                item = item.split(";");
                let amount = item[1];
                let price = item[2];
                cups = cups + Number(amount);
                total = total + (amount * price);
                let full_price = (amount * price / 100).toFixed(2);
                html = `${html}<tr><td>${item[0]}</td><td class="amount">${item[1]}</td><td>${full_price} €</td></tr>`
            }
        });
        if (total)
            html = `${html}<tr style="border-top: 3pt double #ffffff"><td><span>${getTranslationOfID(2)[0]}</span><br><span style="font-size: 15pt">${getTranslationOfID(2)[1]}</span> </td><td class="amount">${cups}</td><td>${cups}.00 €</td></tr>`
        html = html + "<tr class='invisible_row'><td></td><td></td><td></td></tr>"
        html = html + "</table>";
        if (orderlist.length === 1) { // Element 0 is always "EMPTY" or the first value
            document.getElementById("footer_span_de").innerHTML = getTranslationOfID(1)[0];
            document.getElementById("footer_span_uk").innerHTML = getTranslationOfID(1)[1];
            document.getElementById("content").innerHTML = "";
            document.querySelector("video").style.display = "block";
        } else {
            document.getElementById("content").innerHTML = html;
            document.querySelector("video").style.display = "none";
            if (content_before !== document.getElementById("content").innerHTML) {
                document.getElementById("content").scrollTop = document.getElementById("content").scrollHeight;
            }
            document.getElementById("footer_span_de").innerHTML = `${getTranslationOfID(10)[0]}: ${((total / 100) + cups).toFixed(2)} €`;
            document.getElementById("footer_span_uk").innerHTML = `${getTranslationOfID(10)[1]}: ${((total / 100) + cups).toFixed(2)} €`;
        }

        update();

    }, 250);
}