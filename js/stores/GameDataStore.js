import EventEmitter from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';

let emitter = new EventEmitter();

let _res = [];

let _req = [];

let _gameData = {
    userInfo: {}
};

let parse = {
    userInfo(data) {
        data.data = decodeURIComponent(data.data);

        let userInfo = {};

        let el = document.createElement('html');
        el.innerHTML = data.data;

        userInfo.guildName = el.querySelector('.txt-guild-name').innerHTML;
        userInfo.userName = el.querySelector('.btn-user-name').innerHTML;
        userInfo.rank = el.querySelector('.txt-rank-value').innerHTML;
        userInfo.jobLv = el.querySelector('.txt-joblv-value').innerHTML;
        userInfo.lupi = el.querySelector('.prt-lupi').innerHTML;
        userInfo.stone = el.querySelector('.prt-stone').innerHTML;
        userInfo.jp = el.querySelector('.prt-jp').innerHTML;
        userInfo.rowStone = el.querySelector('.prt-rawstone').innerHTML;
        userInfo.power = el.querySelector('.prt-power-number').getAttribute('title');
        userInfo.powerLv = el.querySelector('.icon-power').getAttribute('title');

        _gameData.userInfo = userInfo;
        emitter.emit('UserInfoUpdate');
    }
};

AppDispatcher.register((action) => {
    if(action.type === 'HTTPData') {
        if(action.data) {
            if(action.msg === 'res') {

                // parse gamedata
                
                // parse userInfo 
                // /user/content/index
                if(action.data.url.search(/user\/content\/index/ig) !== -1) {
                    parse.userInfo(action.data.body);
                }

                //console.log(action.data);
                //_res.push(action.data);
            }else if (action.msg === 'req') {
                //_req.push(action.data);
            }
            emitter.emit('HTTPDataUpdate');
        }
    }
});

export default {
    getRes() {
        return _res;
    },
    getReq() {
        return _req;
    },
    getUserInfo() {
        return _gameData.userInfo;
    },
    addEventListener(event, callback) {
        emitter.addListener(event, callback);
    },
    removeEventListener(event, callback) {
        emitter.removeListener(event, callback);
    }
};