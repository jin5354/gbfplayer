import EventEmitter from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';

let emitter = new EventEmitter();

let _log = [];

AppDispatcher.register((action) => {
    if(action.hasOwnProperty('log')) {
        _log.push(action.log);
        if(_log.length > 50) {
            _log.shift();
        }
        emitter.emit('log');
    }
});

export default {
    getLog() {
        return _log;
    },
    addEventListener(event, callback) {
        emitter.addListener(event,callback);
    },
    removeEventListener(event, callback) {
        emitter.removeListener(event,callback);
    }
};