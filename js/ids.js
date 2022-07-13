// noinspection JSJQueryEfficiency
import { getTranslationOfID, query, readTextFile } from "./tools.js";
let prev_html = "";
export function update(recursion = true) {
    document.getElementById("our_menu").innerHTML = `<span style='font-size: 30pt'>${getTranslationOfID(4)[0]}</span><br><span style="font-size: 20pt">${getTranslationOfID(4)[1]}</span>`;
    setTimeout(function () {
        let html = `<table id='table_ids'><tr><th><span style='font-size: 25pt; margin: 0'>${getTranslationOfID(7)[0]}</span><br><span style="font-size: 15pt; margin: 0">${getTranslationOfID(7)[1]}</span></th><th><span style='font-size: 25pt; margin: 0'>${getTranslationOfID(8)[0]}</span><br><span style="font-size: 15pt; margin: 0">${getTranslationOfID(8)[1]}</span></th></tr>`;
        let inProgress = [];
        let finished = [];
        let orders = query("id_viewer.get_ids").split("\n");
        orders.forEach(function (order) {
            if (order !== "EMPTY" && order !== "") {
                order = order.split("\n");
                for (let i = 0; i < order.length; ++i) {
                    if (order[i] !== "") {
                        let item = order[i].split(";");
                        if (item[1] === "0") {
                            inProgress.push(item[0]);
                        }
                        if (item[1] === "1") {
                            finished.push(item[0]);
                        }
                    }
                }
            }
        });
        let rows;
        if (inProgress.length < finished.length) {
            rows = finished.length;
        }
        else {
            rows = inProgress.length;
        }
        for (let i = 0; i < rows; ++i) {
            let progress_id0 = inProgress[2 * i];
            if (progress_id0 === undefined) {
                progress_id0 = "";
            }
            else {
                progress_id0 = `<span>${progress_id0}</span>`;
            }
            let progress_id1 = inProgress[2 * i + 1];
            if (progress_id1 === undefined) {
                progress_id1 = "";
            }
            else {
                progress_id1 = `<span>${progress_id1}</span>`;
            }
            let finished_id = finished[i];
            if (finished_id === undefined) {
                finished_id = "";
            }
            else {
                finished_id = `<span>${finished_id}</span>`;
            }
            html = `${html}
<tr><td>${progress_id0}${progress_id1}</td><td>${finished_id}</td></tr>`;
        }
        document.getElementById("id_viewer").innerHTML = html + "</table>";
        let products = query("id_viewer.get_products").split("\n");
        let not_available = [];
        products.forEach(function (product) {
            if (product !== "" && product !== "EMPTY") {
                product = product.split(";");
                if (product[2] === "0") {
                    not_available.push(product[0]);
                }
            }
        });
        console.log(not_available);
        if (not_available.length !== 0) {
            document.getElementById("info").style.visibility = "visible";
            let html = "";
            not_available.forEach(function (value, index, array) {
                html = html + value;
                if (index !== array.length - 1) {
                    html = html + ", ";
                }
            });
            html = ` +++ ${html}${not_available.length === 1 ? " ist " : " sind "} aktuell nicht verfügbar +++ ${html} ${getTranslationOfID(5)[1]} +++`;
            if (prev_html !== html) {
                document.getElementById("info").innerHTML = "<marquee scrolldelay='20' truespeed>" + html + "</marquee>";
                prev_html = html;
            }
            document.getElementById("video").style.bottom = "80px";
        }
        else {
            document.getElementById("info").style.visibility = "hidden";
            document.getElementById("video").style.bottom = "0";
        }
        if (recursion) {
            update();
        }
    }, 500);
}
export function initPage() {
    readTextFile("./config.json", function (text) {
        let JSONData = JSON.parse(text);
        if (JSONData.enable_uk_video) {
            document.getElementById("video_tag").src = "./imgassets/ads_uk.mp4";
        }
    });
}
//# sourceMappingURL=ids.js.map