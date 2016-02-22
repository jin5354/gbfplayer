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
            AppDispatcher.dispatch({
                type: 'HTTPData',
                msg: 'req',
                data: data,
                log: `GET ${data.url}`
            });
        }

    });

};

export default {
    'init': init
};