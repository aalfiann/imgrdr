// Don't obfuscated this code
"use strict";

var git_client_id = '00c20f97853bedd9c033';
var git_client_secret = '7cfff52023ef207a1b58623757182cbb0806b3c6';
var git_ls_key = 'git_access_token';
var git_redirect_uri = 'https://imgfo.com';

function parse_query_string(e){for(var o=e.replace("?","").split("&"),n={},t=0;t<o.length;t++){var d=o[t].split("="),p=decodeURIComponent(d[0]),r=decodeURIComponent(d[1]);if(void 0===n[p])n[p]=decodeURIComponent(r);else if("string"==typeof n[p]){var i=[n[p],decodeURIComponent(r)];n[p]=i}else n[p].push(decodeURIComponent(r))}return n}

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

function gitLogin(website) {
    return location.href='https://github.com/login/oauth/authorize?client_id='+git_client_id+'&scope=gist&redirect_uri='+git_redirect_uri;
}

function gitAccessToken(code, _cb) {
    ajax({
        headers: {
            'Accept': 'application/json'
        }
    }).post('https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token?client_id='+git_client_id+'&client_secret='+git_client_secret+'&code='+code, {})
    .then(function(response, xhr) {
        if(xhr.status === 200) {
            if(_cb && typeof _cb === "function") {
                if(response.error) {
                    _cb(response.error, null);
                } else {
                    _cb(null, response.access_token);
                }
            }
        }
    })
    .catch(function(response, xhr) {
        console.log(xhr.responseText);
        if(_cb && typeof _cb === "function") {
            _cb('Failed to get Git Access Token!',null);
        }
    })
}

function checkGitAccess() {
    if(getWithExpiry(git_ls_key) === null) {
        var gat = parse_query_string(window.location.search)['code'];
        // if not found
        if(gat === undefined || gat.length < 1) {
            // Show github login button
            document.getElementById('git-login').style.display = 'inline';
            document.getElementById('generate').style.display = 'none';
        } else {
            // get access token
            gitAccessToken(gat, function(err, token) {
                console.log(err, token);
                if(err) {
                    localStorage.removeItem(git_ls_key);
                    // Show github login button
                    document.getElementById('git-login').style.display = 'inline';
                    document.getElementById('generate').style.display = 'none';
                } else {
                    setWithExpiry(git_ls_key, token, 3600);
                    // show Upload to Gist
                    document.getElementById('git-login').style.display = 'none';
                    document.getElementById('generate').style.display = 'inline';
                }
            });
        }
    } else {
        // show Upload to Gist
        document.getElementById('git-login').style.display = 'none';
        document.getElementById('generate').style.display = 'inline';
    }
}

function createGist(name,data,_cb) {
    ajax({
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token '+getWithExpiry(git_ls_key)
        }
      }).post('https://api.github.com/gists',data).then(function (response, xhr) {
        if(xhr.status === 201) {
            if(_cb && typeof _cb === "function") {
                _cb(null, response.files[name].raw_url.replace('gist.githubusercontent.com','gistcdn.githack.com'));
            }
        } else {
            if(_cb && typeof _cb === "function") {
                _cb(response.message, null);
            }
        }
    }).catch(function(response, xhr) {
        checkGitAccess()
        if(_cb && typeof _cb === "function") {
            _cb(response.message, null);
        }
        console.log(xhr.responseText);
    });
}

checkGitAccess();