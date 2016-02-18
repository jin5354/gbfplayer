import React from 'react';
import GameDataStore from '../stores/GameDataStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import {Button, Switch, InputNumber} from 'antd';

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
    bingoOnChange(checked) {
        if(checked) {
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'startGambling-bingo'
            });
        }else {
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'stopGambling-bingo'
            });
        }
    }
    hpDisplayOnChange(checked) {
        if(checked) {
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'startHpDisplay'
            });
        }else {
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'stopHpDisplay'
            });
        }
    }
    execJS() {
        AppDispatcher.dispatch({
            type: 'gameWebviewCtrl',
            msg: 'execJS'
        });
    }
    render() {
        return (
            <div id="ToolPanel">
                <div>
                    <p>poker自动挂机 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked="true" onChange={this.pokerOnChange} /></p>
                    <p>slot自动挂机 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked="true" onChange={this.slotOnChange} /></p>
                    <p>bingo自动挂机 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked="true" onChange={this.bingoOnChange} /></p>
                    <hr />
                    <p>开启通知 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked="true" /></p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;AP/BP回满通知 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked="true" /></p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;巴哈通知 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked="true" /></p>
                    <hr />
                    <p>血量显示 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked="true" onChange={this.hpDisplayOnChange} /></p>
                    <hr />
                    <p>游戏速率改变 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked="true" /></p>
                    <div className="fps">&nbsp;&nbsp;&nbsp;&nbsp;改变游戏FPS至 &nbsp;&nbsp;&nbsp; <div><InputNumber disabled="true" min={12} max={300} defaultValue={60} size="small" /> FPS</div></div>
                    <hr />
                    <Button type="primary" size="small" onClick={this.execJS}>测试脚本</Button>
                </div>
            </div>
        );
    }
}

export default ToolPanel;
