import EventEmitter from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';

let emitter = new EventEmitter();

AppDispatcher.register((action) => {
    if(action.type == 'gameWebviewCtrl') {
        if(action.msg) {
            emitter.emit('change', action.msg);
        }
    }
});

export default {
    addChangeListener(callback) {
        emitter.addListener('change',callback);
    },
    removeChangeListener(callback) {
        emitter.removeListener('change',callback);
    }
};