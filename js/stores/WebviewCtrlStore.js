import EventEmitter from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';

let emitter = new EventEmitter();

AppDispatcher.register((action) => {
    if(action.type == 'gameWebviewCtrl') {
        if(action.msg) {
            emitter.emit('change', action);
        }
    }
});

export default {
    addEventListener(event, callback) {
        emitter.addListener(event,callback);
    },
    removeEventListener(event, callback) {
        emitter.removeListener(event,callback);
    }
};