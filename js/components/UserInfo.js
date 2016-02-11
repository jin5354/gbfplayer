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
                <p>UserInfo</p>
                <p>
                    <span>userName: {this.renderUserInfo().userName || ''}</span>
                    <span>guildName: {this.renderUserInfo().guildName || ''}</span>
                    <span>rank: {this.renderUserInfo().rank || ''}</span>
                    <span>jobLv: {this.renderUserInfo().jobLv || ''}</span>
                    <span>lupi: {this.renderUserInfo().lupi || ''}</span>
                    <span>stone: {this.renderUserInfo().stone || ''}</span>
                    <span>jp: {this.renderUserInfo().jp || ''}</span>
                    <span>rowStone: {this.renderUserInfo().rowStone || ''}</span>
                    <span>power: {this.renderUserInfo().power || ''}</span>
                    <span>powerLv: {this.renderUserInfo().powerLv || ''}</span>
                </p>
            </div>
        );
    }
}

export default UserInfo;
