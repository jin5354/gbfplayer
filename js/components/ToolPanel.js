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
                ap_bp: true
            },
            hpDisplay: true,
            speed: false,
            autoplay: false
        };
        this.pokerOnChange = this.pokerOnChange.bind(this);
        this.slotOnChange = this.slotOnChange.bind(this);
        this.bingoOnChange = this.bingoOnChange.bind(this);
        this.hpDisplayOnChange = this.hpDisplayOnChange.bind(this);
        this.speedOnChange = this.speedOnChange.bind(this);
        this.apbpNotiOnChange = this.apbpNotiOnChange.bind(this);
        this.autoplayOnChange = this.autoplayOnChange.bind(this);
    }
    componentDidMount() {

    }
    pokerOnChange(checked) {
        if(checked) {
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'startGambling-poker',
                log: 'poker自动挂机启用。'
            });
        }else {
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'stopGambling-poker',
                log: 'poker自动挂机关闭。'
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
                msg: 'startGambling-slot',
                log: 'slot自动挂机启用。'
            });
        }else {
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'stopGambling-slot',
                log: 'slot自动挂机关闭。'
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
                msg: 'startGambling-bingo',
                log: 'bingo自动挂机启用。'
            });
        }else {
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'stopGambling-bingo',
                log: 'bingo自动挂机关闭。'
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
                msg: 'startHpDisplay',
                log: '血量显示启用。'
            });
        }else {
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'stopHpDisplay',
                log: '血量显示关闭。'
            });
        }
        this.setState({
            hpDisplay: checked
        });
    }
    speedOnChange(checked) {
        if(checked) {
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'startSpeedUp',
                log: '游戏加速启用。'
            });
        }else {
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'stopSpeedUp',
                log: '游戏加速关闭。'
            });
        }
        this.setState({
            speed: checked
        });
    }
    apbpNotiOnChange(checked) {
        if(checked) {
            notification.addApBpMaxEvent();
        }else {
            notification.removeApBpMaxEvent();
        }
        this.setState({
            noti: {
                ap_bp: checked
            }
        });
    }
    autoplayOnChange(checked) {
        if(checked) {
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'startAutoplay'
            });
        }else {
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'stopAutoplay'
            });
        }
        this.setState({
            autoplay: checked
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
                    <p>血量显示 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.hpDisplay} onChange={this.hpDisplayOnChange} /></p>
                    <hr />
                    <p>游戏加速 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.speed} onChange={this.speedOnChange}/></p>
                    <p>AutoPlay &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.autoplay} onChange={this.autoplayOnChange}/></p>
                    <hr />
                </div>
            </div>
        );
    }
}

export default ToolPanel;
