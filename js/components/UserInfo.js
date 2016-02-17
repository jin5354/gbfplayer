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
                <p>{this.renderUserInfo().userName || ''}  Lv.{this.renderUserInfo().rank || '' }</p>
                <p>lupi: {this.renderUserInfo().lupi || ''}  stone: {this.renderUserInfo().stone || ''}  rowStone: {this.renderUserInfo().rowStone || ''}</p>
                <p>jp: {this.renderUserInfo().jp || ''}  jobLv: {this.renderUserInfo().jobLv || ''}</p>
                <p>power: {this.renderUserInfo().power || ''}  powerLv: {this.renderUserInfo().powerLv || ''}</p>
            </div>
        );
    }
}

export default UserInfo;
