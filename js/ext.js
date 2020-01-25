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
        
    ajax().get("chrome-extension://jfkjbfhcfaoldhgbnkekkoheganchiea/scripts/injected.js")
        .then(function(json,xhr) {
            var e=document.createElement('div');
            e.id='extchrome2';
            e.style.display='none';
            document.body.appendChild(e);
        });

    ajax().get("chrome-extension://ndfgffclcpdbgghfgkmooklaendohaef/scripts/injected.js")
        .then(function(json,xhr) {
            var e=document.createElement('div');
            e.id='extchrome3';
            e.style.display='none';
            document.body.appendChild(e);
        });

}

function isExtDetected() {
    if(document.getElementById('extchrome') || 
    document.getElementById('extchrome2') ||
    document.getElementById('extchrome3')) {
        return true;
    }
    return false;
}

function isBlacklistedMobileBrowser() {
    if(isMobileDevice()) {
        var ug = navigator.userAgent.toLowerCase();
        if (
            (ug.indexOf('firefox') > -1) || // Firefox
            // (ug.indexOf('rocket') > -1) || // Firefox Lite
            // (ug.indexOf('fxios') > -1) || // Firefox iOS Webkit
            // (ug.indexOf('opt') > -1) ||  // Opera Touch
            // (ug.indexOf('opera mini') > -1) ||  // Opera Mini
            // (ug.indexOf('opios') > -1) ||  // Opera Mini iOS Webkit
            // (ug.indexOf('ucbrowser') > -1) ||  // UCBrowser/Mini/Turbo
            // (ug.indexOf('acheetahi') > -1) ||  // CMBrowser
            // (ug.indexOf('mint browser') > -1) || // Mint Browser
            // (ug.indexOf('maxthon') > -1) || // Maxthon Browser
            // (ug.indexOf('surfybrowser') > -1) || // Surfy Browser
            // (ug.indexOf('alohabrowser') > -1) || // Aloha Browser
            // (ug.indexOf('turbobrowser') > -1) || // Turbo Browser
            // (ug.indexOf('noxbrowser') > -1) || // Nox Browser
            // (ug.indexOf('duckduckgo') > -1) || // DuckDuckGo Browser
            // (ug.indexOf('focus') > -1) || // Focus Browser
            // (ug.indexOf('puffin') > -1) || // Puffin Browser
            // (ug.indexOf('phx') > -1) || // PHX
            (ug.indexOf('headlesschrome') > -1) || // HeadlessChrome/Puppeteer
            (ug.indexOf('phantomjs') > -1) // PhantomJS
            // (ug.indexOf('wv') > -1) // All WebView Browser
        ) {
            return true;
        }
    }
    return false;
}