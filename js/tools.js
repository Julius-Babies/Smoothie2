"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLeadingZeros = exports.query = exports.setCookie = exports.getCookie = void 0;
const $ = require("./jquery.js");
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
exports.getCookie = getCookie;
function setCookie(name, value, expire_days) {
    const d = new Date();
    d.setTime(d.getTime() + (expire_days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
exports.setCookie = setCookie;
function query(type, data = "") {
    let serverdata;
    // noinspection JSUnresolvedVariable
    $.ajax({
        url: "./querymaster.php",
        method: "POST",
        async: false,
        data: {
            type: type,
            data: data
        },
        success: function (response) {
            serverdata = response;
        }
    });
    return serverdata;
}
exports.query = query;
function addLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, '0');
}
exports.addLeadingZeros = addLeadingZeros;
//# sourceMappingURL=tools.js.map