import EventEmitter from 'events';
import url from 'url';
import AppDispatcher from '../dispatcher/AppDispatcher';

let emitter = new EventEmitter();

let _res = [];

let _req = [];

let _gameData = {
    user: {},
    userInfo: {
        waiting: true
    },
    status: {
        waiting: true
    },
    notiFlag: {
        ap: 1,
        bp: 1
    }
};

let parse = {
    user(data) {
        if(data.url.search(/user\/content\/index/ig) !== -1) {
            _gameData.user = url.parse(data.url, true).query;
            emitter.emit('UserUpdate');
        }
    },
    userInfo(data) {

        let userInfo = {
            waiting: false
        };
        // gbf.game.mbga.jp/user/content/index
        if(data.url.search(/user\/content\/index/ig) !== -1) {
            data.body.data = decodeURIComponent(data.body.data);

            let el = document.createElement('html');
            el.innerHTML = data.body.data;

            userInfo.userName = el.querySelector('.btn-user-name').innerHTML;
            userInfo.rank = el.querySelector('.txt-rank-value').innerHTML;
            userInfo.rankGauge = Number(el.querySelector('.prt-rank-gauge-inner').getAttribute('style').match(/\d+/i)[0]);
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
    },
    status(data) {

        let status = {
            waiting: false
        };

        let updateStatus = () => {
            _gameData.status = status;
            emitter.emit('StatusUpdate');
            if(_gameData.notiFlag.ap) {
                if(Number(_gameData.status.ap) === Number(_gameData.status.maxAp)) {
                    emitter.emit('ApMax', _gameData.status.ap);
                    _gameData.notiFlag.ap = 0;
                }else {
                    _gameData.notiFlag.ap = 1;
                }
            }
            if(_gameData.notiFlag.bp) {
                if(Number(_gameData.status.bp) === Number(_gameData.status.maxBp)) {
                    emitter.emit('BpMax', _gameData.status.bp);
                    _gameData.notiFlag.bp = 0;
                }else {
                    _gameData.notiFlag.bp = 1;
                }

            }
        };

        //gbf.game.mbga.jp/user/data_assets
        if(data.url.search(/user\/data_assets/ig) !== -1) {

            status.ap = data.body.mydata.status.now_action_point;
            status.maxAp = data.body.mydata.status.max_action_point;
            status.bp = data.body.mydata.status.now_battle_point;
            status.maxBp = data.body.mydata.status.max_battle_point;
            status.apGauge = data.body.mydata.status.action_point_gauge;
            status.apRemainTime = data.body.mydata.status.action_point_remain;
            status.bpRemainTime = data.body.mydata.status.battle_point_remain;

            updateStatus();
        }
        //gbf.game.mbga.jp/user/status
        if(data.url.search(/user\/status/ig) !== -1) {

            status.ap = data.body.status.now_action_point;
            status.maxAp = data.body.status.max_action_point;
            status.bp = data.body.status.now_battle_point;
            status.maxBp = data.body.status.max_battle_point;
            status.apGauge = data.body.status.action_point_gauge;
            status.apRemainTime = data.body.status.action_point_remain;
            status.bpRemainTime = data.body.status.battle_point_remain;

            updateStatus();
        }
    }
};

AppDispatcher.register((action) => {
    if(action.type === 'HTTPData') {
        if(action.data) {
            if(action.msg === 'res') {

                // parse gamedata
                
                parse.user(action.data);
                parse.userInfo(action.data);
                parse.status(action.data);

                console.log(action.data);

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
    getAllGameData() {
        return _gameData;
    },
    getUserInfo() {
        return _gameData.userInfo;
    },
    getStatus() {
        return _gameData.status;
    },
    getUser() {
        return _gameData.user;
    },
    addEventListener(event, callback) {
        emitter.addListener(event, callback);
    },
    removeEventListener(event, callback) {
        emitter.removeListener(event, callback);
    }
};