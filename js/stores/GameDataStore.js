import EventEmitter from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';

let emitter = new EventEmitter();

let _res = [];

let _req = [];

let _gameData = {};

AppDispatcher.register((action) => {
    if(action.type === 'HTTPData') {
        if(action.data) {
            if(action.msg === 'res') {
                console.log(action.data);
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
    addEventListener(event, callback) {
        emitter.addListener(event, callback);
    },
    removeEventListener(event, callback) {
        emitter.removeListener(event, callback);
    }
};