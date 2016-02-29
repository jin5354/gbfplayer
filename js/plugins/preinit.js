if(window.$) {
    $.ajaxSetup({
        crossDomain: true
    });
}

if(window.Game) {
    Game.reportError = function(msg, url, line, column, err){
        console.info(msg);
        console.info(url);
        console.info(line);
        console.info(column);
        console.info(err);
    };
}