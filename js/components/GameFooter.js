import React from 'react';
import AppDispatcher from '../dispatcher/AppDispatcher';
import {ipcRenderer} from 'electron';

class GameFooter extends React.Component {
    goBack() {
        AppDispatcher.dispatch({
            type: 'gameWebviewCtrl',
            msg: 'goBack'
        });
    }
    reload() {
        AppDispatcher.dispatch({
            type: 'gameWebviewCtrl',
            msg: 'reload'
        });
    }
    gotoMypage() {
        AppDispatcher.dispatch({
            type: 'gameWebviewCtrl',
            msg: 'gotoMypage'
        });
    }
    switch() {
        ipcRenderer.send('switch-window-msg', 'switch');
    }
    render() {
        return (
            <div id="footer">
                <span id="footer-back" onClick={this.goBack}></span>
                <span id="footer-reload" onClick={this.reload}></span>
                <span id="footer-mypage" onClick={this.gotoMypage}></span>
                <span id="footer-switch" onClick={this.switch}></span>
            </div>
        );
    }
}

export default GameFooter;