import electron from 'electron';
import AppDispatcher from '../dispatcher/AppDispatcher';

let init = () => {

    electron.ipcRenderer.on('HTTPData', (event, type, data) => {
        if(type === 'res') {
            AppDispatcher.dispatch({
                type: 'HTTPData',
                msg: 'res',
                data: data
            });
        }
        if(type === 'req') {

            let obj = {
                type: 'HTTPData',
                msg: 'req',
                data: data
            };
            if(!(data.url.search(/assets\//ig) !== -1) && !(data.url.search(/\.woff/ig) !== -1) && !(data.url.search(/sound/ig) !== -1)) {
                //obj.log = `GET ${data.url}`;
            }
            AppDispatcher.dispatch(obj);
        }

    });

};

export default {
    'init': init
};