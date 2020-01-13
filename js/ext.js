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