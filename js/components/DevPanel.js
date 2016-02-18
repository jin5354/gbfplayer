import React from 'react';
import GameDataStore from '../stores/GameDataStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import {Button, notification} from 'antd';
import remote from 'remote';
import {ipcRenderer} from 'electron';

class DevPanel extends React.Component {
    componentDidMount() {
        //GameDataStore.addEventListener('change', this.forceUpdate.bind(this));
    }
    openDevTools(event) {
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
        ipcRenderer.on('clearCache-reply', function(arg) {
            notification.open({
                message: 'Done',
                description: arg
            });
        });
        ipcRenderer.send('clearCache-msg', 'clearCache');
    }
    render() {
        return (
            <div id="DevPanel">
                <div>
                    <Button type="primary" size="small" onClick={this.openSelfDevTools}>打开AppDevTools</Button>
                    <Button type="primary" size="small" onClick={this.openDevTools}>打开WebviewDevTools</Button>
                    <Button type="primary" size="small" onClick={this.clearCache}>清除缓存</Button>
                    <br /><br /><br /><br />
                    <p>Build by electron + react.js + ant.design.</p>
                </div>
            </div>
        );
    }
}

export default DevPanel;
