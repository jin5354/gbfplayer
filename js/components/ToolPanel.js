import React from 'react';
import AppDispatcher from '../dispatcher/AppDispatcher';
import {Switch} from 'antd';
import notification from '../services/notification';

class ToolPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            poker: true,
            slot: true,
            bingo: true,
            noti: {
                ap_bp: true,
                baha: true
            },
            hpDisplay: true,
            speed: false
        };
        this.pokerOnChange = this.pokerOnChange.bind(this);
    }
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
        this.setState({
            poker: checked
        });
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
        this.setState({
            slot: checked
        });
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
        this.setState({
            bingo: checked
        });
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
    speedOnChange(checked) {
        if(checked) {
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'startSpeedUp'
            });
        }else {
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'stopSpeedUp'
            });
        }
    }
    apbpNotiOnChange(checked) {
        if(checked) {
            notification.addApBpMaxEvent();
        }else {
            notification.removeApBpMaxEvent();
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
                    <p>poker自动挂机 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.poker} onChange={this.pokerOnChange} /></p>
                    <p>slot自动挂机 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.slot} onChange={this.slotOnChange} /></p>
                    <p>bingo自动挂机 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.bingo} onChange={this.bingoOnChange} /></p>
                    <hr />
                    <p>AP/BP回满通知 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.noti.ap_bp} onChange={this.apbpNotiOnChange} /></p>
                    <p>巴哈通知 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.noti.baha} onChange={this.bahaNotiOnChange} /></p>
                    <hr />
                    <p>血量显示 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.hpDisplay} onChange={this.hpDisplayOnChange} /></p>
                    <hr />
                    <p>游戏加速 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.speed} onChange={this.speedOnChange}/></p>
                    <hr />
                </div>
            </div>
        );
    }
}

export default ToolPanel;
