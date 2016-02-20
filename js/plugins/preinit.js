$.ajaxSetup({
    crossDomain: true
});

Game.reportError = function(msg, url, line, column, err){
    console.info(msg);
    console.info(url);
    console.info(line);
    console.info(column);
    console.info(err);
}