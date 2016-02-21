import React from 'react';
import GameDataStore from '../stores/GameDataStore';
import {Progress} from 'antd';

const ProgressLine = Progress.Line;

class UserInfo extends React.Component {
    componentDidMount() {
        GameDataStore.addEventListener('UserInfoUpdate', this.forceUpdate.bind(this));
    }
    renderUserInfo() {
        return GameDataStore.getUserInfo();
    }
    render() {
        return (
            <div id="UserInfo">
                <p>个人信息</p>
                <div className="rank">{this.renderUserInfo().userName || ''} &nbsp;&nbsp;&nbsp; Lv.{this.renderUserInfo().rank || '' } &nbsp;&nbsp; <ProgressLine percent={this.renderUserInfo().rankGauge} strokeWidth={5} showInfo={false} status="active" /> &nbsp;&nbsp;&nbsp;{this.renderUserInfo().rankGauge}%</div>
                <p>lupi: {this.renderUserInfo().lupi || ''} &nbsp;&nbsp;&nbsp; stone: {this.renderUserInfo().stone || ''} &nbsp;&nbsp;&nbsp; rowStone: {this.renderUserInfo().rowStone || ''}</p>
                <p>jp: {this.renderUserInfo().jp || ''} &nbsp;&nbsp;&nbsp; jobLv: {this.renderUserInfo().jobLv || ''}</p>
                <p>power: {this.renderUserInfo().power || ''} &nbsp;&nbsp;&nbsp; powerLv: {this.renderUserInfo().powerLv || ''}</p>
            </div>
        );
    }
}

export default UserInfo;
