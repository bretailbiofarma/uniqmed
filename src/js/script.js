function imgFormatSupport(imgType) {
    const elem = document.createElement("canvas");

    if (
        !!(elem.getContext && elem.getContext("2d")) &&
        elem.toDataURL("image/webp").indexOf(`data:image/${imgType}`) == 0
    ) {
        document.body.classList.add(`js-${imgType}`);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const year = document.querySelector(".js-year");
    const mobileMenuBtn = document.querySelector(".js-mobile-menu");
    const menu = document.querySelector(".js-submenu");
    const header = document.querySelector("header");

    imgFormatSupport("webp");

    year.innerHTML = new Date().getFullYear();

    if (!document.body.classList.contains("js-webp")) {
        document.body.classList.add("js-jpg");
    }

    mobileMenuBtn.onclick = function (e) {
        header.classList.toggle("js-open");
    };

    window.onclick = function (event) {
        if (!header.contains(event.target)) {
            header.classList.remove("js-open");
        }
    };
});
