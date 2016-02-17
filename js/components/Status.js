import React from 'react';
import GameDataStore from '../stores/GameDataStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import {Button} from 'antd';

class Status extends React.Component {
    componentDidMount() {
        GameDataStore.addEventListener('StatusUpdate', this.forceUpdate.bind(this));
    }
    renderStatus() {
        return GameDataStore.getStatus();
    }
    render() {
        return (
            <div id="Status">
                <p>状态</p>
                <p>ap: {this.renderStatus().ap || 0}/{this.renderStatus().maxAp || ''} &nbsp;&nbsp;&nbsp; remain: {this.renderStatus().apRemainTime || ''}</p>
                <p>bp: {this.renderStatus().bp || 0}/{this.renderStatus().maxBp || ''} &nbsp;&nbsp;&nbsp; remain: {this.renderStatus().bpRemainTime || ''}</p>
            </div>
        );
    }
}

export default Status;
