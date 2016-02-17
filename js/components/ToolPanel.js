import React from 'react';
import GameDataStore from '../stores/GameDataStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import notifier from 'node-notifier';
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
    testnoti() {
        console.log('noti!');
        notifier.notify({
            'title': 'My notification',
            'message': 'Hello, there!'
        }, (err) => {
            console.log(err);
            // Response is response from notification
        });
    }
    render() {
        return (
            <div id="ToolPanel">
                <div>
                    <p>开启poker挂机 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked="true" onChange={this.pokerOnChange} /></p>
                    <p>开启slot挂机 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked="true" onChange={this.slotOnChange} /></p>
                    <Button type="primary" size="small" onClick={this.testnoti}>测试通知</Button>
                </div>
            </div>
        );
    }
}

export default ToolPanel;
