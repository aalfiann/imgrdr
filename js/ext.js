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
        
    ajax().get("moz-extension://785672cb-62b8-421f-8101-37baee7cb5d8/open.png")
        .then(function(json,xhr) {
            var e=document.createElement('div');
            e.id='extmozilla';
            e.style.display='none';
            document.body.appendChild(e);
        });
}

function isExtDetected() {
    if(document.getElementById('extchrome') || 
    document.getElementById('extkiwi') ||
    document.getElementById('extchrome2') || 
    document.getElementById('extkiwi2') || 
    document.getElementById('extmozilla')) {
        return true;
    }
    return false;
}