import React from 'react';
import GameDataStore from '../stores/GameDataStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import {Button} from 'antd';

class Status extends React.Component {
    componentDidMount() {
        //GameDataStore.addEventListener('change', this.forceUpdate.bind(this));
    }
    openDevTools(event) {
        AppDispatcher.dispatch({
            type: 'gameWebviewCtrl',
            msg: 'openDevTools'
        });
    }
    render() {
        return (
            <div id="Status">

            </div>
        );
    }
}

export default Status;
