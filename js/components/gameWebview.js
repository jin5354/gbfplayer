import React from 'react';
import {app} from 'remote';
import fs from 'fs';
import path from 'path';
import WebviewCtrlStore from '../stores/WebviewCtrlStore';

class GameWebview extends React.Component {

    componentDidMount() {

        let webview = this.refs.gameWebview;

        let css = `body {
            -webkit-font-smoothing: antialiased;
        }
       ::-webkit-scrollbar  {
            display: none;
        }
        `;
        
        webview.addEventListener('did-finish-load', () => {
            webview.insertCSS(css);
        });

        let dirname = app.getAppPath();
        WebviewCtrlStore.addEventListener('change', (event) => {
            switch(event) {
            case 'goBack':
                webview.goBack();
                break;
            case 'reload':
                webview.reload();
                break;
            case 'gotoMypage':
                webview.loadURL('http://gbf.game.mbga.jp/#mypage');
                break;
            case 'openDevTools':
                webview.openDevTools();
                break;
            case 'startGambling-poker':
                let pokerJS = fs.readFileSync(path.join(dirname, 'casino_poker.js'), 'utf-8');
                webview.executeJavaScript(pokerJS);
                break;
            case 'startGambling-slot':
                let slotJS = fs.readFileSync(path.join(dirname, 'casino_slot.js'), 'utf-8');
                webview.executeJavaScript(slotJS);
                break;
            }
        });
                
    }
    render() {
        return (
            <webview ref="gameWebview" disablewebsecurity src="http://gbf.game.mbga.jp/"></webview>
            
        );
    }
}
//<webview ref="gameWebview" disablewebsecurity src="http://gbf.game.mbga.jp/"></webview>
export default GameWebview;