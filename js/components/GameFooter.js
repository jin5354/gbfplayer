import React from 'react';
import AppDispatcher from '../dispatcher/AppDispatcher';

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
    render() {
        return (
            <div id="footer">
                <span id="footer-back" onClick={this.goBack}></span>
                <span id="footer-reload" onClick={this.reload}></span>
                <span id="footer-mypage" onClick={this.gotoMypage}></span>
            </div>
        );
    }
}

export default GameFooter;