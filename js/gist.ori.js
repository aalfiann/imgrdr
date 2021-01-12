"use strict";

var _gistToken = [
    'a67fc7f93079bbdf58249f1bd83e7ee486daae12'
];
  
function randomizerToken(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function createGist(name,data,_cb) {
    ajax({
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token '+randomizerToken(_gistToken)
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
        if(_cb && typeof _cb === "function") {
            _cb(response.message, null);
        }
        console.log(xhr.responseText);
    });
}