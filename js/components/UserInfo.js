import React from 'react';
import GameDataStore from '../stores/GameDataStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import {Button} from 'antd';

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
                <p>{this.renderUserInfo().userName || ''} &nbsp;&nbsp;&nbsp; Lv.{this.renderUserInfo().rank || '' }</p>
                <p>lupi: {this.renderUserInfo().lupi || ''} &nbsp;&nbsp;&nbsp; stone: {this.renderUserInfo().stone || ''} &nbsp;&nbsp;&nbsp; rowStone: {this.renderUserInfo().rowStone || ''}</p>
                <p>jp: {this.renderUserInfo().jp || ''} &nbsp;&nbsp;&nbsp; jobLv: {this.renderUserInfo().jobLv || ''}</p>
                <p>power: {this.renderUserInfo().power || ''} &nbsp;&nbsp;&nbsp; powerLv: {this.renderUserInfo().powerLv || ''}</p>
            </div>
        );
    }
}

export default UserInfo;
