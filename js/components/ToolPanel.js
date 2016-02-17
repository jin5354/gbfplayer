import React from 'react';
import GameDataStore from '../stores/GameDataStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import {Button, Switch} from 'antd';

class ToolPanel extends React.Component {
    componentDidMount() {
    }

    pokerOnChange(checked) {
        if(checked) {
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'startGambling-poker'
            });
        }else {
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'stopGambling-poker'
            });
        }
    }
    slotOnChange(checked) {
        if(checked) {
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'startGambling-slot'
            });
        }else {
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'stopGambling-slot'
            });
        }
    }
    render() {
        return (
            <div id="ToolPanel">
                <div>
                    <p>开启poker挂机 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked="true" onChange={this.pokerOnChange} /></p>
                    <p>开启slot挂机 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked="true" onChange={this.slotOnChange} /></p>
                </div>
            </div>
        );
    }
}

export default ToolPanel;
