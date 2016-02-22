import React from 'react';
import GameDataStore from '../stores/GameDataStore';
import {Progress} from 'antd';

const ProgressLine = Progress.Line;

class UserInfo extends React.Component {
    componentDidMount() {
        GameDataStore.addEventListener('UserInfoUpdate', this.forceUpdate.bind(this));
    }
    renderUserInfo() {
        let userInfo =  GameDataStore.getUserInfo();
        if(!userInfo.waiting) {
            return (
                <div>
                    <div className="rank">{userInfo.userName || ''} &nbsp;&nbsp;&nbsp; Lv.{userInfo.rank || '' } &nbsp;&nbsp; <ProgressLine percent={userInfo.rankGauge} strokeWidth={5} showInfo={false} status="active" /> &nbsp;&nbsp;&nbsp;{userInfo.rankGauge}%</div>
                    <p>lupi: {userInfo.lupi || ''} &nbsp;&nbsp;&nbsp; stone: {userInfo.stone || ''} &nbsp;&nbsp;&nbsp; rowStone: {userInfo.rowStone || ''}</p>
                    <p>jp: {userInfo.jp || ''} &nbsp;&nbsp;&nbsp; jobLv: {userInfo.jobLv || ''}</p>
                    <p>power: {userInfo.power || ''} &nbsp;&nbsp;&nbsp; powerLv: {userInfo.powerLv || ''}</p>
                </div>
            );
        }else {
            return (
                <div>
                    <p>等待游戏数据..</p>
                </div>
            );
        }
    }
    render() {
        return (
            <div id="UserInfo">
                <p>个人信息</p>
                {this.renderUserInfo()}
            </div>
        );
    }
}

export default UserInfo;
