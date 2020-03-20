// DON'T AUTO COMPRESS BELOW THIS
function showComment(hash) {
    var fullpath = window.location.href.split('?');
    var oripath = fullpath[0].replace('embed','view');
    var canonical = oripath+'?content='+hash;
    
    var disqus_config = function () {
        this.page.url = canonical;  // Replace PAGE_URL with your page's canonical URL variable
        this.page.identifier = hash; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    
    (function() { // DON'T EDIT BELOW THIS LINE
        var d = document, s = d.createElement('script');
        s.src = 'https://imgfo.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    })();
}