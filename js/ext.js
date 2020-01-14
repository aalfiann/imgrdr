function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

if(isMobileDevice()) {
    ajax().get("chrome-extension://cnpniohnfphhjihaiiggeabnkjhpaldj/images/open.png")
        .then(function(json,xhr) {
            var e=document.createElement('div');
            e.id='extchrome';
            e.style.display='none';
            document.body.appendChild(e);
        });

    ajax().get("kiwi-extension://cnpniohnfphhjihaiiggeabnkjhpaldj/images/open.png")
        .then(function(json,xhr) {
            var e=document.createElement('div');
            e.id='extkiwi';
            e.style.display='none';
            document.body.appendChild(e);
        });

    ajax().get("chrome-extension://jfkjbfhcfaoldhgbnkekkoheganchiea/scripts/injected.js")
        .then(function(json,xhr) {
            var e=document.createElement('div');
            e.id='extchrome2';
            e.style.display='none';
            document.body.appendChild(e);
        });

    ajax().get("kiwi-extension://jfkjbfhcfaoldhgbnkekkoheganchiea/scripts/injected.js")
        .then(function(json,xhr) {
            var e=document.createElement('div');
            e.id='extkiwi2';
            e.style.display='none';
            document.body.appendChild(e);
        });
}

function isExtDetected() {
    if(document.getElementById('extchrome') || 
    document.getElementById('extkiwi') ||
    document.getElementById('extchrome2') || 
    document.getElementById('extkiwi2')) {
        return true;
    }
    return false;
}

function isBlacklistedMobileBrowser() {
    if(isMobileDevice()) {
        var ug = navigator.userAgent.toLowerCase();
        if (
            (ug.indexOf('firefox') > -1) || // Firefox
            (ug.indexOf('rocket') > -1) || // Firefox Lite
            (ug.indexOf('fxios') > -1) || // Firefox iOS Webkit
            (ug.indexOf('opera mini') > -1) ||  // Opera Mini
            (ug.indexOf('opios') > -1) ||  // Opera Mini iOS Webkit
            (ug.indexOf('ucbrowser') > -1) ||  // UCBrowser/Mini/Turbo
            (ug.indexOf('acheetahi') > -1) ||  // CMBrowser
            (ug.indexOf('mint browser') > -1) || // Mint Browser
            (ug.indexOf('phx') > -1) // PHX
        ) {
            return true;
        }
    }
    return false;
}