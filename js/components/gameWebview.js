import React from 'react';
import {app} from 'remote';
import fs from 'fs';
import path from 'path';
import WebviewCtrlStore from '../stores/WebviewCtrlStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import LogStore from '../stores/LogStore';
import GameDataStore from '../stores/GameDataStore';

require('babel-polyfill');

let dirname = app.getAppPath();
let randomTime = (time, percent = 20) => {
    return time + (Math.random() * (time * percent / 50) - time * percent / 100);
};
let status = GameDataStore.getStatus();
GameDataStore.addEventListener('StatusUpdate', () => {
    status = GameDataStore.getStatus();
});

let _questRunningFlag = false;

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

        let autoplayUtils = {
            //进入任务列表页界面
            jumpIntoQuestPage(config) {
                return new Promise((resolve, reject) => {
                    let js = `
                        location.href = '${config.questPage}'
                    `;
                    console.info(js);
                    webview.executeJavaScript(js);
                    LogStore.push(`跳转至任务列表界面:${config.questPage}`);
                    resolve();
                });
            },
            //点击任务按钮，转至选择召唤界面(AP)
            apConfirmQuest(config) {
                return new Promise((resolve, reject) => {
                    LogStore.push(`开始尝试确定任务，任务ID:${config.questID}`);
                    let js = `
                        if($('div[data-chapter-id="${config.questID}"]').length > 0) {
                            $('div[data-chapter-id="${config.questID}"]').trigger('tap');
                        }
                    `;
                    let questTapper = setInterval(() => {
                        webview.executeJavaScript(js);
                        if(webview.getURL().search(/supporter/ig) != -1) {
                            LogStore.push('任务按钮已点击，转至选择召唤界面..');
                            clearInterval(questTapper);
                            resolve();
                        }else if(webview.getURL().search(/#quest/ig) == -1) {
                            LogStore.push(`意外脱离预设URL，脚本终止。URL: ${webview.getURL()}`);
                            clearInterval(questTapper);
                            reject();
                        }
                    }, randomTime(2000));
                });
            },
            //点击任务按钮，转至选择召唤界面(BP)
            bpConfirmQuest() {
                return new Promise((resolve, reject) => {
                    LogStore.push(`开始尝试确定Multi任务..`);
                    let js = `
                        if(!window.questFinder) {
                            var questFinder = setInterval(function(){
                                if($('div.btn-multi-raid.lis-raid').length > 0) {
                                    console.info($('div.btn-multi-raid.lis-raid'));
                                    clearInterval(questFinder);
                                    $($('div.btn-multi-raid.lis-raid')[0]).trigger('tap');
                                }
                            },1000);
                        }
                    `;
                    LogStore.push(`确定任务并验证..`);
                    let getQuestTapper = setInterval(() => {
                        webview.executeJavaScript(js);
                        if(webview.getURL().search(/supporter_raid/ig) != -1) {
                            LogStore.push(`任务按钮已点击，转至选择召唤界面..`);
                            clearInterval(getQuestTapper);
                            resolve();
                        }
                    }, randomTime(2000)); 
                });
            },
            //ap确定第一个召唤兽
            apConfirmSupporter() {
                return new Promise((resolve, reject) => {
                    LogStore.push('开始尝试确定召唤兽..');
                    let js = `
                        if($('div.se-quest-start').length == 0) {
                            $('div.prt-supporter-attribute').each(function() {
                                if(!($(this).hasClass('disableView'))) {
                                    console.info('已找到，点击。');
                                    $(($(this).find('.btn-supporter'))[0]).trigger('tap');
                                }
                            });
                        }else {
                            console.info('已成功确定召唤石！进入战斗界面....');
                            $('div.se-quest-start').trigger('tap');
                        }
                    `;

                    let supporterTapper = setInterval(() => {
                        webview.executeJavaScript(js);
                        if(webview.getURL().search(/raid/ig) != -1) {
                            LogStore.push('确定已进入战斗..');
                            clearInterval(supporterTapper);
                            resolve();
                        }else if(webview.getURL().search(/#quest/ig) == -1) {
                            LogStore.push(`意外脱离预设URL，脚本终止。URL: ${webview.getURL()}`);
                            clearInterval(supporterTapper);
                            reject();
                        }
                    }, randomTime(2000)); 
                });
            },
            //bp确定第一个召唤兽
            bpConfirmSupporter() {
                return new Promise((resolve, reject) => {
                    //let questIDs = [40011, 40014];
                    LogStore.push(`开始尝试确定召唤兽。`);

                    let js = `
                        if($('div.se-quest-start').length == 0) {
                            $('div.prt-supporter-attribute').each(function() {
                                if(!($(this).hasClass('disableView'))) {
                                    console.info('已找到，点击。');
                                    $(($(this).find('.btn-supporter'))[0]).trigger('tap');
                                }
                            });
                        }else {
                            console.info('已成功确定召唤石！进入战斗界面....');
                            $('div.se-quest-start').trigger('tap');
                        }
                    `;
                    LogStore.push(`确定召唤兽并进入战斗..`);
                    let supporterTapper = setInterval(() => {
                        webview.executeJavaScript(js);
                        if(webview.getURL().search(/raid_multi/ig) != -1) {
                            LogStore.push(`确定已进入战斗..`);
                            clearInterval(supporterTapper);
                            resolve();
                        }else if(webview.getURL().search(/#quest/ig) == -1) {
                            LogStore.push(`意外脱离预设URL，脚本终止。URL: ${webview.getURL()}`);
                            clearInterval(supporterTapper);
                            reject();
                        }
                    }, randomTime(2000));

                });
            },
            //AP战斗——点击战斗按钮，设置自动攻击
            apAutoAttack() {
                return new Promise((resolve, reject) => {
                    LogStore.push('开始尝试进行攻击..');

                    let js = `
                        if(!window.autoTapper) {
                            var autoTapper = setInterval(function(){
                                console.info('试图触发自动攻击中..');
                                if(window.stage && (window.stage.gGameStatus.auto_attack != true)) {
                                    console.info('触发自动攻击.');
                                    window.stage.gGameStatus.auto_attack = true;
                                }else if(window.stage && (window.stage.gGameStatus.auto_attack == true)) {
                                    console.info('成功设置自动攻击。');
                                    $('div.btn-attack-start.display-on').trigger('tap');
                                    clearInterval(autoTapper);
                                }
                            },1000);
                        }
                    `;

                    let attackTapper = setInterval(() => {
                        webview.executeJavaScript(js);
                        if(webview.getURL().search(/#result/ig) != -1) {
                            LogStore.push('战斗结束。进入结算页面..');
                            clearInterval(attackTapper);
                            resolve();
                        }else if(webview.getURL().search(/#raid/ig) == -1) {
                            LogStore.push(`意外脱离预设URL，脚本终止。URL: ${webview.getURL()}`);
                            clearInterval(attackTapper);
                            reject();
                        }
                    }, randomTime(2000)); 
                });
            },
            //BP战斗——不停平A
            bpAutoAttack() {
                return new Promise((resolve, reject) => {
                    LogStore.push('开始尝试进行攻击..');
                    let js = `
                        if($('div.btn-attack-start.display-on').length > 0) {
                            $('div.btn-attack-start.display-on').trigger('tap');
                        }
                        if($('div.prt-popup-footer .btn-usual-text').length > 0) {
                            $('div.prt-popup-footer .btn-usual-text').trigger('tap');
                        }
                    `;

                    let reloader = setInterval(() => {
                        webview.reload();
                        setTimeout(() => {
                            if(webview.getURL().search(/#quest/ig) != -1){
                                LogStore.push(`战斗结束，进入结算。`);
                                clearInterval(reloader);
                                clearInterval(attackTapper);
                                resolve();
                            }else if(webview.getURL().search(/raid_multi/ig) == -1) {
                                LogStore.push(`意外脱离预设URL，脚本终止。URL: ${webview.getURL()}`);
                                clearInterval(reloader);
                                clearInterval(attackTapper);
                                reject();
                            }
                        } ,randomTime(5000));
                    } ,randomTime(50000));
                    let attackTapper = setInterval(() => {
                        webview.executeJavaScript(js);
                    } ,randomTime(15000)); 
                });
            },
            //AP流程结束，点击OK按钮
            finishApTask() {
                return new Promise((resolve, reject) => {
                    LogStore.push('进入结算程序..');
                    let js = `
                        if($('div.prt-popup-footer .btn-usual-ok').length > 0) {
                            $('div.prt-popup-footer .btn-usual-ok').trigger('tap');
                        }
                        if($('div.prt-button-area .btn-control').length > 0) {
                            $('div.prt-button-area .btn-control').trigger('tap');
                        }
                    `;
                    let resultTapper = setInterval(() => {
                        webview.executeJavaScript(js);
                        if(webview.getURL().search(/#quest/ig) != -1) {
                            LogStore.push('流程结束，返回任务列表页..');
                            clearInterval(resultTapper);
                            resolve();
                        }else if(webview.getURL().search(/#result/ig) == -1) {
                            LogStore.push(`意外脱离预设URL，脚本终止。URL: ${webview.getURL()}`);
                            clearInterval(resultTapper);
                            reject();
                        }
                    }, randomTime(2000)); 
                });
            },
            //BP流程结束，直接跳回主页。
            finishBpTask() {
                return new Promise((resolve, reject) => {
                    LogStore.push('进入BP结算程序..');
                    let js = `
                        location.href = 'http://gbf.game.mbga.jp/#mypage'
                    `;
                    webview.executeJavaScript(js);
                    LogStore.push(`结算结束，返回首页。`);
                    setTimeout(() => {
                        resolve();
                    }, randomTime(5000));
                });
            },
            //BP结束后，清理未确认战斗
            clearBattle() {
                return new Promise((resolve, reject) => {
                    LogStore.push('清理未确认战斗..');
                    let js = `
                        if($('div.btn-multi-raid.lis-raid').length > 0) {
                            $($('div.btn-multi-raid.lis-raid')[0]).trigger('tap');
                        }
                        if($('div.prt-popup-footer .btn-usual-ok').length > 0) {
                            $('div.prt-popup-footer .btn-usual-ok').trigger('tap');
                        }
                        if($('div.prt-button-area .btn-control').length > 0) {
                            $('div.prt-button-area .btn-control').trigger('tap');
                        }
                    `;
                    webview.executeJavaScript('location.href = "http://gbf.game.mbga.jp/#quest/assist/unclaimed"');
                    setTimeout(() => {
                        let clearer = setInterval(() => {
                            webview.executeJavaScript(js);
                            if(webview.getURL().search(/#quest\/index/ig) !== -1) {
                                clearInterval(clearer);
                                LogStore.push(`清理结束，返回首页。`);
                                webview.executeJavaScript('location.href = "http://gbf.game.mbga.jp/#mypage"');
                                resolve();
                            }
                        }, randomTime(3000));
                    } ,randomTime(3000));
                });
            }
        };

        let autoplay = (config) => {

            if(config.questType == 'ap') {
                let autoplayAsync = async function() {
                    await autoplayUtils.jumpIntoQuestPage(config);
                    await autoplayUtils.apConfirmQuest(config);
                    await autoplayUtils.apConfirmSupporter();
                    await autoplayUtils.apAutoAttack();
                    await autoplayUtils.finishApTask();
                    LogStore.push(`ap任务按预期完成~`);
                };
                return autoplayAsync;
            }else if (config.questType == 'bp') {
                let autoplayAsync = async function() {
                    await autoplayUtils.jumpIntoQuestPage(config);
                    await autoplayUtils.bpConfirmQuest();
                    await autoplayUtils.bpConfirmSupporter();
                    await autoplayUtils.bpAutoAttack();
                    await autoplayUtils.finishBpTask();
                    await autoplayUtils.clearBattle();
                    LogStore.push(`bp任务按预期完成~`);
                };
                return autoplayAsync;
            }
        };

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
            resolveSpeedUpEvent,
            apPlayer,
            bpPlayer;

        WebviewCtrlStore.addEventListener('change', (event) => {
            switch(event.msg) {
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
                status = GameDataStore.getStatus();
                LogStore.push(`自动值机开启..`);

                let jumpToPoker = () => {
                    if(_questRunningFlag) {
                        LogStore.push(`其他任务执行中,暂时无法执行..`);
                    }else {
                        webview.executeJavaScript(`location.href = 'http://gbf.game.mbga.jp/#casino/game/poker/200030'`);
                    }
                };

                apPlayer = () => {
                    if(_questRunningFlag) {
                        LogStore.push(`其他任务执行中,暂时无法执行..`);
                    }else {
                        _questRunningFlag = true;
                        LogStore.push(`ap已满，执行ap任务..`);
                        autoplay(event.config.ap)().then((success) => {
                            if(success) {
                                _questRunningFlag = false;
                                if(Number(status.bp) === Number(status.maxBp)) {
                                    bpPlayer();
                                }else {
                                    LogStore.push(`ap与bp均不满，先去打一会儿牌吧！`);
                                    jumpToPoker();
                                }
                            }
                        });
                    }
                };
                bpPlayer = () => {
                    if(_questRunningFlag) {
                        LogStore.push(`其他任务执行中,暂时无法执行..`);
                    }else {
                        _questRunningFlag = true;
                        LogStore.push(`bp已满，执行bp任务..`);
                        autoplay(event.config.bp)().then((success) => {
                            if(success) {
                                _questRunningFlag = false;
                                if(Number(status.ap) === Number(status.maxAp)) {
                                    apPlayer();
                                }else {
                                    LogStore.push(`ap与bp均不满，先去打一会儿牌吧！`);
                                    jumpToPoker();
                                }
                            }
                        });
                    }
                };

                if(event.config.mode == 1) {
                    if('ap' in event.config) {
                        LogStore.push(`挂载ap监听器~`);
                        GameDataStore.addEventListener('ApMax', apPlayer);
                        if(Number(status.ap) === Number(status.maxAp)) {
                            apPlayer();
                        }
                    }
                    if('bp' in event.config) {
                        LogStore.push(`挂载bp监听器~`);
                        GameDataStore.addEventListener('BpMax', bpPlayer);
                        if(Number(status.bp) === Number(status.maxBp)) {
                            bpPlayer();
                        }
                    }
                    if(Number(status.ap) !== Number(status.maxAp) && Number(status.bp) !== Number(status.maxBp)) {
                        LogStore.push(`ap与bp均不满，先去打一会儿牌吧！`);
                        jumpToPoker();
                    }
                }
                break;
            case 'cancelAutoplay':
                GameDataStore.removeEventListener('ApMax', apPlayer);
                GameDataStore.removeEventListener('BpMax', bpPlayer);
                LogStore.push(`自动值机已关闭..`);
                break;
            case 'test':
                console.info('测试脚本！');

                let delay = (time) => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            console.info(time);
                            resolve();
                        },time);
                    });
                };
                let myDelayedMessages = async function (){
                    console.info('async函数执行！');
                    await delay(1000);
                    await delay(1200);
                    await console.info('end.');
                };

                let start = myDelayedMessages();

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