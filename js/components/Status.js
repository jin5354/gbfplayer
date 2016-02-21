import React from 'react';
import GameDataStore from '../stores/GameDataStore';

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
                <p><span className='ap'>AP: {this.renderStatus().ap || 0}/{this.renderStatus().maxAp || ''}</span> &nbsp;&nbsp;&nbsp; remain: {this.renderStatus().apRemainTime || ''}</p>
                <p><span className='bp'>BP: {this.renderStatus().bp || 0}/{this.renderStatus().maxBp || ''}</span> &nbsp;&nbsp;&nbsp; remain: {this.renderStatus().bpRemainTime || ''}</p>
            </div>
        );
    }
}

export default Status;
