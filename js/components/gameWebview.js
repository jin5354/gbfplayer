import React from 'react';
import {app} from 'remote';
import fs from 'fs';
import path from 'path';
import WebviewCtrlStore from '../stores/WebviewCtrlStore';
import AppDispatcher from '../dispatcher/AppDispatcher';

require("babel-polyfill");

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
        
        let dirname = app.getAppPath();
        let preinitJS = fs.readFileSync(path.join(dirname, 'js/plugins/preinit.js'), 'utf-8');
        let getInfoJS = fs.readFileSync(path.join(dirname, 'js/plugins/getInfo.js'), 'utf-8');
        webview.addEventListener('did-finish-load', () => {
            webview.insertCSS(css);
            webview.executeJavaScript(preinitJS);
            webview.executeJavaScript(getInfoJS);
        });

        webview.addEventListener('console-message', function(e) {
            console.log('Guest page logged a message:', e.message);
        });

        let resolvePokerNavigateEvent,
            resolvePokerFinishEvent,
            resolveSlotNavigateEvent,
            resolveSlotFinishEvent,
            resolveHpDisplayNavigateEvent,
            resolveHpDisplayFinishEvent,
            resolveBingoNavigateEvent,
            resolveBingoFinishEvent,
            resolveSpeedUpNavigateEvent,
            resolveSpeedUpFinishEvent,
            resolveSpeedUpEvent;

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
                let pokerJS = fs.readFileSync(path.join(dirname, 'js/plugins/casino_poker.js'), 'utf-8');
                resolvePokerNavigateEvent = (e) => {
                    if(e.url.search(/casino\/game\/poker/ig) !== -1) {
                        setTimeout(() => {
                            webview.executeJavaScript(pokerJS);
                        },5000);
                    }
                };
                resolvePokerFinishEvent = () => {
                    if(webview.getURL().search(/casino\/game\/poker/ig) !== -1) {
                        setTimeout(() => {
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
                let slotJS = fs.readFileSync(path.join(dirname, 'js/plugins/casino_slot.js'), 'utf-8');
                resolveSlotNavigateEvent = (e) => {
                    if(e.url.search(/casino\/game\/slot/ig) !== -1) {
                        setTimeout(() => {
                            webview.executeJavaScript(slotJS);
                        },5000);
                    }
                };
                resolveSlotFinishEvent = () => {
                    if(webview.getURL().search(/casino\/game\/slot/ig) !== -1) {
                        setTimeout(() => {
                            webview.executeJavaScript(slotJS);
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
            case 'startGambling-bingo':
                let bingoJS = fs.readFileSync(path.join(dirname, 'js/plugins/casino_bingo.js'), 'utf-8');
                resolveBingoNavigateEvent = (e) => {
                    if(e.url.search(/casino\/game\/bingo/ig) !== -1) {
                        setTimeout(() =>{
                            webview.executeJavaScript(bingoJS);
                        },5000);
                    }
                };
                resolveBingoFinishEvent = () => {
                    if(webview.getURL().search(/casino\/game\/bingo/ig) !== -1) {
                        setTimeout(() => {
                            webview.executeJavaScript(bingoJS);
                        },3000);
                    }
                };
                webview.addEventListener('did-navigate-in-page', resolveBingoNavigateEvent);
                webview.addEventListener('did-finish-load', resolveBingoFinishEvent);
                if(webview.getURL && webview.getURL().search(/casino\/game\/bingo/ig) !== -1) {
                    webview.executeJavaScript(bingoJS);
                }
                break;
            case 'stopGambling-bingo':
                webview.removeEventListener('did-navigate-in-page', resolveBingoNavigateEvent);
                webview.removeEventListener('did-finish-load', resolveBingoFinishEvent);
                break;
            case 'startHpDisplay':
                let hpDisplayJS = fs.readFileSync(path.join(dirname, 'js/plugins/hp.js'), 'utf-8');
                resolveHpDisplayNavigateEvent = (e) => {
                    if(e.url.search(/raid\//ig) !== -1 || e.url.search(/raid_multi\//ig) !== -1) {
                        setTimeout(() => {
                            webview.executeJavaScript(hpDisplayJS);
                        },5000);
                    }
                };
                resolveHpDisplayFinishEvent = () => {
                    if(webview.getURL().search(/raid\//ig) !== -1 || webview.getURL().search(/raid_multi\//ig) !== -1) {
                        setTimeout(() => {
                            webview.executeJavaScript(hpDisplayJS);
                        },3000);
                    }
                };
                webview.addEventListener('did-navigate-in-page', resolveHpDisplayNavigateEvent);
                webview.addEventListener('did-finish-load', resolveHpDisplayFinishEvent);
                if(webview.getURL && (webview.getURL().search(/raid\//ig) !== -1 || webview.getURL().search(/raid_multi\//ig) !== -1)) {
                    webview.executeJavaScript(hpDisplayJS);
                }
                break;
            case 'stopHpDisplay':
                webview.removeEventListener('did-navigate-in-page', resolveHpDisplayNavigateEvent);
                webview.removeEventListener('did-finish-load', resolveHpDisplayFinishEvent);
                break;
            case 'startSpeedUp':
                resolveSpeedUpNavigateEvent = () => {
                    setTimeout(() => {
                        webview.executeJavaScript(`if(window.createjs){createjs.Ticker.setFPS(60);}`);
                    }, 5000);
                };
                resolveSpeedUpFinishEvent = () => {
                    setTimeout(() => {
                        webview.executeJavaScript(`if(window.createjs){createjs.Ticker.setFPS(60);}`);
                    }, 3000);
                };
                resolveSpeedUpEvent = () => {
                    webview.executeJavaScript(`if(window.createjs){createjs.Ticker.setFPS(60);}`);
                };
                webview.addEventListener('did-navigate-in-page', resolveSpeedUpNavigateEvent);
                webview.addEventListener('did-finish-load', resolveSpeedUpFinishEvent);
                webview.addEventListener('did-get-response-details', resolveSpeedUpEvent);
                if(webview.executeJavaScript) {
                    webview.executeJavaScript(`if(window.createjs){createjs.Ticker.setFPS(60);}`);
                }
                break;
            case 'stopSpeedUp':
                webview.removeEventListener('did-navigate-in-page', resolveSpeedUpNavigateEvent);
                webview.removeEventListener('did-finish-load', resolveSpeedUpFinishEvent);
                webview.removeEventListener('did-get-response-details', resolveSpeedUpEvent);
                webview.executeJavaScript(`createjs.Ticker.setFPS(24);`);
                break;
            case 'autoplay':
                console.info('run!');
                let run = (generatorFunction) => {
                    let resume = (callbackValue) => {
                        generatorItr.next(callbackValue);
                    };
                    let generatorItr = generatorFunction(resume);
                    generatorItr.next();
                };

                let js = ``;

                //step1 打log
                let step1 = (resume) => {
                    console.info('开始AutoPlay!!');
                    setTimeout(resume, 500);
                };
                //step2 进入extra界面
                let step2 = (resume) => {
                    js = `
                        location.href = 'http://gbf.game.mbga.jp/#quest/extra'
                    `;
                    webview.executeJavaScript(js);
                    console.info('跳转至EXTRA界面!!');
                    setTimeout(resume, 500);
                };
                //step3 点击任务按钮，转至选择召唤界面
                let step3 = (resume) => {
                    js = `
                        if($('div[data-chapter-id="40011"]').length > 0) {
                            $('div[data-chapter-id="40011"]').trigger('tap');
                        }
                    `;
                    let questTapper = setInterval(() => {
                        webview.executeJavaScript(js);
                        if(webview.getURL().search(/supporter/ig) != -1) {
                            console.info('任务按钮已点击，转至选择召唤界面!!');
                            clearInterval(questTapper);
                            setTimeout(resume, 500);
                        }
                    }, 2000);
                };
                //step4 点击第一个召唤兽，打开队伍确定页面
                run(function* autoplay(resume) {
                    yield step1(resume);
                    yield step2(resume);
                    yield step3(resume);
                });
                break;
            }
        });


        let reg = () => {
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'startGambling-poker'
            });
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'startGambling-slot'
            });
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'startGambling-bingo'
            });
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'startHpDisplay'
            });
            AppDispatcher.dispatch({
                type: 'gameWebviewCtrl',
                msg: 'startSpeedUp'
            });
        };

        reg();
                
    }
    render() {
        return (
            <webview ref="gameWebview" nodeintegration disablewebsecurity src="http://gbf.game.mbga.jp/#mypage"></webview>
            
        );
    }
}

export default GameWebview;