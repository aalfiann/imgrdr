// Don't forget to obfucate this protection library
// use this >> https://javascriptobfuscator.com/Javascript-Obfuscator.aspx

// Security Configuration
var pkey = "xsilent"; // change this with your pin
var domainorigin = 'imgfo.com'; // change with your origin domain
var uniquepath = '/view'; // leave blank if you don't want to detect spesific page.
var secondpath = '/embed'; // leave blank if you don't allow embed feature.

/**
 * Bot Protection
 */
(function (d, w) {
    var bD = {
            tests: {},
            isBot: true,
            isUser: false,
        },
        userCallbacks = [],
        tests = {},
        addEvent = function (elm, type, handler) {
            if ( elm.addEventListener ) {
                elm.addEventListener( type, handler, false );
            } else if ( elm.attachEvent ) {
                elm.attachEvent( "on" + type, handler );
            }
        },
        removeEvent = function (elm, type, handle) {
            if (d.removeEventListener) {
                if ( elm.removeEventListener ) {
                    elm.removeEventListener( type, handle, false );
                }
            } else {
                var name = "on" + type;
                if ( elm.detachEvent ) {
                    if ( typeof elm[ name ] === 'undefined' ) {
                        elm[ name ] = null;
                    }
                    elem.detachEvent( name, handle );
                }
            }
        };

    w.AI = bD;

    tests.scroll = function () {
        var e = function () {
            tests.scroll = true;
            updateTests();
            removeEvent(w, 'scroll', e);
            removeEvent(d, 'scroll', e);
        };
        addEvent(d, 'scroll', e);
        addEvent(w, 'scroll', e);
    };
    tests.mouse = function () {
        var e = function () {
            tests.mouse = true;
            updateTests();
            removeEvent(w, 'mousemove', e);
        };
        addEvent(w, 'mousemove', e);
    };
    tests.key = function () {
        var e = function () {
            tests.key = true;
            updateTests();
            removeEvent(w, 'keyUp', e);
        };
        addEvent(w, 'keyUp', e);
    };

    function runTests() {
        for(var i in tests) {
            if (tests.hasOwnProperty(i)) {
                tests[i].call();
            }
        }
        updateTests();
    }

    function updateTests() {
        var count = 0, i;
        for(i in tests) {
            if (tests.hasOwnProperty(i)) {
                bD.tests[i] = tests[i] === true;
                if (tests[i] === true) {
                    count ++;
                }
            }
        }

        bD.isUser = count > 0;
        bD.isBot = !bD.isUser;
        if (bD.isUser) {
            while(userCallbacks.length) {
                var cb = userCallbacks.shift();
                cb.call(bD);
            }
        }
    }

    bD.onUser = function (callback) {
        if (bD.isUser) {
            callback.call(bD);
        } else {
            userCallbacks.push(callback);
        }
    };

    runTests();
})(document, window);

/**
 * Devtools protection
 */
(function () {
    'use strict';
  
    var devtools = {
      isOpen: false,
      orientation: undefined
    };
    var threshold = 160;
  
    var emitEvent = function emitEvent(isOpen, orientation) {
      window.dispatchEvent(new CustomEvent('devtoolschange', {
        detail: {
          isOpen: isOpen,
          orientation: orientation
        }
      }));
    };
  
    setInterval(function () {
      var widthThreshold = window.outerWidth - window.innerWidth > threshold;
      var heightThreshold = window.outerHeight - window.innerHeight > threshold;
      var orientation = widthThreshold ? 'vertical' : 'horizontal';
  
      if (!(heightThreshold && widthThreshold) && (window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized || widthThreshold || heightThreshold)) {
        if (!devtools.isOpen || devtools.orientation !== orientation) {
          emitEvent(true, orientation);
        }
  
        devtools.isOpen = true;
        devtools.orientation = orientation;
      } else {
        if (devtools.isOpen) {
          emitEvent(false, undefined);
        }
  
        devtools.isOpen = false;
        devtools.orientation = undefined;
      }
    }, 500);
  
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = devtools;
    } else {
      window.devtools = devtools;
    }
  })();

function isHeadless() {
    var ug = navigator.userAgent.toLowerCase();
    if (
        (ug.indexOf('headless') > -1) || // HeadlessChrome/Puppeteer
        (ug.indexOf('phantomjs') > -1) || // PhantomJS
        (navigator.languages == "")  // Browser with no languages
    ) {
        return true;
    }
    return false;
}

function parse_query_string(e){for(var o=e.replace("?","").split("&"),n={},t=0;t<o.length;t++){var d=o[t].split("="),p=decodeURIComponent(d[0]),r=decodeURIComponent(d[1]);if(void 0===n[p])n[p]=decodeURIComponent(r);else if("string"==typeof n[p]){var i=[n[p],decodeURIComponent(r)];n[p]=i}else n[p].push(decodeURIComponent(r))}return n}
function isSecured(){
    var pin = parse_query_string(window.location.search)['pin'];
    if(pin === undefined || pin.length < 1 || pin !== pkey) {
        return true;
    }
    return false;
}


if(isSecured()) {
    /**
     * User Control Protection
     */
    document.ontouchstart = document.body.ontouchstart = function() {return false;}
    document.oncontextmenu = document.body.oncontextmenu = function() {return false;}
    // document.onkeydown = function(e) {
    //     if (e.ctrlKey && 
    //         (e.keyCode === 67 || //ctrl+c
    //             e.keyCode === 86 || //ctrl+v
    //             e.keyCode === 85 || //ctrl+u
    //             e.keyCode === 117 || //ctrl+F6
    //             e.shiftKey && e.keyCode===73)) { //ctrl+shift+i
    //         return false;
    //     } else if (e.keyCode === 123){ //F12
    //         return false;
    //     } else {
    //         return true;
    //     }
    // };

    /**
     * Web Proxy, Web Mirror and Direct IP Protection
     */
    var urla = window.location.href;
    var urlb = urla.split('//');
    var urlc = urlb[1];
    var domain = '';
    if(urlc.indexOf('/')>0) {
        urlc = urlc.split('/');
        domain = urlc[0];
    } else {
        domain = urlc;
    }
    if(domain !== domainorigin) {
        urla = urla.replace(domain,domainorigin);
        if(uniquepath) {
            if(urla.indexOf(uniquepath)>0) { // detect if direct mirror ("view" is the unique path of your address)
                location.href = urla;
            } else { // detect if embed page or proxy mirror
                if(secondpath) {
                    if(urla.indexOf(secondpath)>0) { // detect if direct mirror ("embed" is the second unique path of your address)
                        location.href = urla;
                    } else { // detect if proxy mirror
                        location.href = domainorigin;
                    }
                } else {
                    location.href = domainorigin;        
                }
            }
        } else {
            location.href = domainorigin;
        }
    }
}

function botCheck() {
    let err = new Error('Puppeteer Detected!');
    console.log('err.stack: ', err.stack);
    if (err.stack.toString().includes('puppeteer')) {
        document.getElementById("data-content").innerHTML = '';
        document.getElementById("content-images").innerHTML = '';
    }
}

function overrideFunction(item) {
    item.obj[item.propName] = (function (orig) {
        return function () {
            botCheck();
            let args = arguments;
            let value = orig.apply(this, args);
            return value;
        };
    }(item.obj[item.propName]));
}

overrideFunction({
    propName: 'querySelector',
    obj: document
});