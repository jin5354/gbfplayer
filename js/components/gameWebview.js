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

        webview.addEventListener('console-message', function(e) {
            console.log('Guest page logged a message:', e.message);
        });

        let resolvePokerNavigateEvent,
            resolvePokerFinishEvent,
            resolveSlotNavigateEvent,
            resolveSlotFinishEvent;

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
                resolvePokerNavigateEvent = (e) => {
                    if(e.url.search(/casino\/game\/poker/ig) !== -1) {
                        setTimeout(function(){
                            webview.executeJavaScript(pokerJS);
                        },5000);
                    }
                };
                resolvePokerFinishEvent = () => {
                    if(webview.getURL().search(/casino\/game\/poker/ig) !== -1) {
                        setTimeout(function(){
                            webview.executeJavaScript(pokerJS);
                        },3000);
                    }
                };
                webview.addEventListener('did-navigate-in-page', resolvePokerNavigateEvent);
                webview.addEventListener('did-finish-load', resolvePokerFinishEvent);
                if(webview.getURL && webview.getURL().search(/casino\/game\/poker/ig) !== -1) {
                    webview.executeJavaScript(pokerJS);
                }
                break;
            case 'stopGambling-poker':
                webview.removeEventListener('did-navigate-in-page', resolvePokerNavigateEvent);
                webview.removeEventListener('did-finish-load', resolvePokerFinishEvent);
                break;
            case 'startGambling-slot':
                let slotJS = fs.readFileSync(path.join(dirname, 'casino_slot.js'), 'utf-8');
                resolveSlotNavigateEvent = (e) => {
                    if(e.url.search(/casino\/game\/slot/ig) !== -1) {
                        setTimeout(function(){
                            webview.executeJavaScript(slotJS);
                        },5000);
                    }
                };
                resolveSlotFinishEvent = () => {
                    if(webview.getURL().search(/casino\/game\/slot/ig) !== -1) {
                        setTimeout(function(){
                            webview.executeJavaScript(pokerJS);
                        },3000);
                    }
                };
                webview.addEventListener('did-navigate-in-page', resolveSlotNavigateEvent);
                webview.addEventListener('did-finish-load', resolveSlotFinishEvent);
                if(webview.getURL && webview.getURL().search(/casino\/game\/slot/ig) !== -1) {
                    webview.executeJavaScript(slotJS);
                }
                break;
            case 'stopGambling-slot':
                webview.removeEventListener('did-navigate-in-page', resolveSlotNavigateEvent);
                webview.removeEventListener('did-finish-load', resolveSlotFinishEvent);
                break;
            }
        });
                
    }
    render() {
        return (
            <webview ref="gameWebview" disablewebsecurity src="http://gbf.game.mbga.jp/#mypage"></webview>
            
        );
    }
}

export default GameWebview;