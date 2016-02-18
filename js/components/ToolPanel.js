import React from 'react';
import AppDispatcher from '../dispatcher/AppDispatcher';
import {Button, Switch, InputNumber} from 'antd';

class ToolPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            poker: true,
            slot: true,
            bingo: true,
            noti: {
                all: true,
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
                    {/*
                    <p>开启通知 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.noti.all} /></p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;AP/BP回满通知 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.noti.ap_bp} /></p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;巴哈通知 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.noti.baha} /></p>
                    <hr />
                    */}
                    <p>血量显示 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.hpDisplay} onChange={this.hpDisplayOnChange} /></p>
                    <hr />
                    <p>游戏加速 &nbsp;&nbsp;&nbsp; <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.speed} onChange={this.speedOnChange}/></p>
                    {/*
                    <div className="fps">&nbsp;&nbsp;&nbsp;&nbsp;改变游戏FPS至 &nbsp;&nbsp;&nbsp; <div><InputNumber disabled="true" min={12} max={300} defaultValue={60} size="small" /> FPS</div></div>
                    */}
                    <hr />
                    {/*
                    <Button type="primary" size="small" onClick={this.execJS}>测试脚本</Button>
                    */}
                </div>
            </div>
        );
    }
}

export default ToolPanel;
