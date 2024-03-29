// Don't obfuscated this code
"use strict";

var git_client_id = '2133bdf4fcf96f2bb227';
var git_client_secret = '45cb23a-390ce0-8c632ca-e2a875416-464b6af769e';
var git_ls_key = 'git_access_token';
var git_redirect_uri = 'https://imgfo.com';
var git_ttl = (3600*1000*8);

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

function gitLogin() {
    return location.href='https://github.com/login/oauth/authorize?client_id='+git_client_id+'&scope=gist&redirect_uri='+git_redirect_uri;
}

function gitLogout() {
    localStorage.removeItem(git_ls_key);
    checkGitAccess();
}

function gitAccessToken(code, _cb) {
    ajax({
        headers: {
            'Accept': 'application/json'
        }
    }).post('https://imgfo-gist.herokuapp.com/https://github.com/login/oauth/access_token?client_id='+git_client_id+'&client_secret='+git_client_secret.replace(/-/g, "")+'&code='+code, {})
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
    var btnGitLogin = document.getElementById('git-login');
    if(getWithExpiry(git_ls_key) === null) {
        var gat = parse_query_string(window.location.search)['code'];
        btnGitLogin.innerText = 'GitHub Login';
        btnGitLogin.disabled = false;
        // if not found
        if(gat === undefined || gat.length < 1) {
            // Show github login button
            btnGitLogin.style.display = 'inline';
            document.getElementById('git-logout').style.display = 'none';
            document.getElementById('generate').style.display = 'none';
        } else {
            btnGitLogin.innerText = 'Logging in...'
            btnGitLogin.disabled = true;
            // get access token
            gitAccessToken(gat, function(err, token) {
                if(err) {
                    localStorage.removeItem(git_ls_key);
                    // remove code in param query
                    window.history.replaceState({}, document.title, "/");
                    // Show github login button
                    btnGitLogin.style.display = 'inline';
                    document.getElementById('git-logout').style.display = 'none';
                    document.getElementById('generate').style.display = 'none';
                } else {
                    setWithExpiry(git_ls_key, token, git_ttl);
                    // remove code in param query
                    window.history.replaceState({}, document.title, "/");
                    // show Upload to Gist
                    btnGitLogin.style.display = 'none';
                    document.getElementById('git-logout').style.display = 'inline';
                    document.getElementById('generate').style.display = 'inline';
                }
                btnGitLogin.innerText = 'GitHub Login';
                btnGitLogin.disabled = false;
            });
        }
    } else {
        // show Upload to Gist
        btnGitLogin.style.display = 'none';
        document.getElementById('git-logout').style.display = 'inline';
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