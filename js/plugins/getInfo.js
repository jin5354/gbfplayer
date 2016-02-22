function getInfo() {
    $.ajax({
        type: 'GET',
        url: 'user/status'
    });
    $.ajax({
        type: 'GET',
        url: 'user/content/index'
    });
    var now = new Date();
    console.info(now.toLocaleTimeString() + '自动拉取信息。');
}

var getStatusTimer = setInterval(getInfo, 60000 + Math.random()*20000 - 10000);