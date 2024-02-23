document.addEventListener("DOMContentLoaded", function () {
    var cookieConsent = document.getElementById("cookie-consent");
    var acceptButton = document.getElementById("cookie-consent-accept");
    var closeButton = document.getElementById("cookie-consent-close");

    function setCookie(name, value, days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        var expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + encodeURIComponent(value) + "; " + expires + "; path=/; Secure; SameSite=Lax";
    }

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    function checkCookieConsent() {
        var consent = getCookie("cookie-consent");
        console.log('cookie consent', consent)
        if (!consent) {
            cookieConsent.style.display = "block";
        }
    }

    acceptButton.addEventListener("click", function () {
        setCookie("cookie-consent", "accepted", 365);
        cookieConsent.style.display = "none";
    });

    checkCookieConsent();

    closeButton.addEventListener("click", function () {
        cookieConsent.style.display = "none";
    });
});