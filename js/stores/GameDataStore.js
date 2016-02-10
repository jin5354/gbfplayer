import EventEmitter from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';

let emitter = new EventEmitter();

let _res = {num: 1};

let _req = {};

let _gameData = {};

AppDispatcher.register((action) => {
    console.log('get action');
    if(action.type === 'HTTPData') {
        if(action.data) {
            if(action.msg === 'res') {
                _res.num++;
            }else if (action.msg === 'req') {
                _req = action.data;
            }
            emitter.emit('change');
        }
    }
});

export default {
    getRes() {
        return _res;
    },
    addEventListener(event, callback) {
        emitter.addListener(event, callback);
    },
    removeEventListener(event, callback) {
        emitter.removeListener(event, callback);
    }
};