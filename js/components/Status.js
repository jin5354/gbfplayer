import React from 'react';
import GameDataStore from '../stores/GameDataStore';

class Status extends React.Component {
    componentDidMount() {
        GameDataStore.addEventListener('StatusUpdate', this.forceUpdate.bind(this));
    }
    renderStatus() {
        let status = GameDataStore.getStatus();
        if(!status.waiting) {
            return (
                <div>
                    <p><span className='ap'>AP: {status.ap || 0}/{status.maxAp || ''}</span> &nbsp;&nbsp;&nbsp; remain: {status.apRemainTime || ''}</p>
                    <p><span className='bp'>BP: {status.bp || 0}/{status.maxBp || ''}</span> &nbsp;&nbsp;&nbsp; remain: {status.bpRemainTime || ''}</p>
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
            <div id="Status">
                <p>状态</p>
                {this.renderStatus()}
            </div>
        );
    }
}

export default Status;
