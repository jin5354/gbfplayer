import React from 'react';
import AppDispatcher from '../dispatcher/AppDispatcher';
import {Button, message} from 'antd';
import remote from 'remote';
import {ipcRenderer} from 'electron';

class DevPanel extends React.Component {
    componentDidMount() {
        ipcRenderer.on('clearCache-reply', function(arg, msg) {
            message.success(msg, 1.5);
        });
    }
    openDevTools() {
        AppDispatcher.dispatch({
            type: 'gameWebviewCtrl',
            msg: 'openDevTools'
        });
    }
    openSelfDevTools() {
        remote.getCurrentWindow().openDevTools({
            detach: true
        });
    }
    clearCache() {
        ipcRenderer.send('clearCache-msg', 'clearCache');
    }
    render() {
        return (
            <div id="DevPanel">
                <div>
                    <p><Button type="primary" size="small" onClick={this.openSelfDevTools}>打开AppDevTools</Button></p>
                    <p><Button type="primary" size="small" onClick={this.openDevTools}>打开WebviewDevTools</Button></p>
                    <p><Button type="primary" size="small" onClick={this.clearCache}>清除全部缓存</Button></p>
                </div>
            </div>
        );
    }
}

export default DevPanel;
