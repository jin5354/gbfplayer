import React from 'react';
import GameDataStore from '../stores/GameDataStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import {Button} from 'antd';

class ToolPanel extends React.Component {
    componentDidMount() {
        //GameDataStore.addEventListener('change', this.forceUpdate.bind(this));
    }
    startGamblingPoker() {
        AppDispatcher.dispatch({
            type: 'gameWebviewCtrl',
            msg: 'startGambling-poker'
        });
    }
    startGamblingSlot() {
        AppDispatcher.dispatch({
            type: 'gameWebviewCtrl',
            msg: 'startGambling-slot'
        });
    }
    render() {
        return (
            <div id="ToolPanel">
                <div>
                    <Button type="primary" size="small" onClick={this.startGamblingPoker}>开始poker挂机</Button>
                    <Button type="primary" size="small" onClick={this.startGamblingSlot}>开始slot挂机</Button>
                </div>
            </div>
        );
    }
}

export default ToolPanel;
