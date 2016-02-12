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
                <p>Status</p>
                <p className="wrap">
                    <span>ap_now: {this.renderStatus().ap || ''}</span>
                    <span>maxAp: {this.renderStatus().maxAp || ''}</span>
                    <span>bp_now: {this.renderStatus().bp || ''}</span>
                    <span>maxBp: {this.renderStatus().maxBp || ''}</span>
                    <span>apGauge: {this.renderStatus().apGauge || ''}</span>
                    <span>apRemainTime: {this.renderStatus().apRemainTime || ''}</span>
                    <span>bpRemainTime: {this.renderStatus().bpRemainTime || ''}</span>
                </p>
            </div>
        );
    }
}

export default Status;
