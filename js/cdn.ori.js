"use strict";

var _tokenize = '';

function setWithExpiry(key, value, ttl) {
    var now = new Date();
    var item = {
        value: value,
        expiry: now.getTime() + ttl
    }
    localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key) {
    var itemStr = localStorage.getItem(key);
    if (!itemStr) {
        return null;
    }
    var item = JSON.parse(itemStr);
    var now = new Date();
    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    return item.value;
}

function _validateKey(_cb) {
    if(getWithExpiry('imgfo_tokenize') === null) {
        ajax({
            headers: {
              'x-auth-key': TextObfuscator.decode('f581f76766ff1c41be58370e8063d121',3)
            }
          }).post('https://imgproxify.com/api/generate-token',{}).then(function (response, xhr) {
            if(response.statusCode === 200) {
                _tokenize = response.data.token;
                setWithExpiry('imgfo_tokenize', _tokenize, 600000); // 10minute
                if(_cb && typeof _cb === "function") {
                    _cb(null, true);
                }
            }
        }).catch(function(response, xhr) {
            if(_cb && typeof _cb === "function") {
                _cb('Failed to get token!', false);
            } else {
                console.log('Failed to get token!');
            }
        });
    } else {
        _tokenize =  getWithExpiry('imgfo_tokenize');
        if(_cb && typeof _cb === "function") {
            _cb(null, true);
        }
    }
}

function cdnify(images, _cb) {
    if(images.length < 1) {
        return _cb('No images found!', false);
    }
    _validateKey(function (err, done) {
        if (err) {
            if (_cb && typeof _cb === "function") {
                return _cb(err, false);
            }
        }

        var newlist = [];
        for (var i=0;i<images.length;i++) {
            newlist.push({ url: images[i] });
        }

        ajax().post('https://imgproxify.com/api/generate-multiple',{ 
            images: newlist,
            token: _tokenize
        }).then(function (response, xhr) {
            if(response.statusCode === 200) {
                var imgsecured = [];
                for (var x=0;x<response.data.length;x++) {
                    if(response.data[x].success) {
                        imgsecured.push(response.data[x].image.secure);
                    }
                }
                if(_cb && typeof _cb === "function") {
                    _cb(null, imgsecured);
                }
            }
        }).catch(function(response, xhr) {
            if(_cb && typeof _cb === "function") {
                _cb('Failed to cdnify images!', []);
            } else {
                console.log('Failed to cdnify images!');
            }
        });

    })
}