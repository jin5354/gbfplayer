import React from 'react';
import GameDataStore from '../stores/GameDataStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import {Button} from 'antd';
import remote from 'remote';

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
    render() {
        return (
            <div id="DevPanel">
                <div>
                    <Button type="primary" size="small" onClick={this.openSelfDevTools}>打开DevTools</Button>
                    <Button type="primary" size="small" onClick={this.openDevTools}>打开WebviewDevTools</Button>
                </div>
            </div>
        );
    }
}

export default DevPanel;
