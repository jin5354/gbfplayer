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
let status = GameDataStore.getStatus();

let updateStatus = () => {
    status = GameDataStore.getStatus();
};

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


        let run = (generatorFunction) => {
            let resume = (callbackValue) => {
                generatorItr.next(callbackValue);
            };
            let generatorItr = generatorFunction(resume);
            generatorItr.next();
        };

        let autoplayUtils = {
            //进入任务列表页界面
            jumpIntoQuestPage(resume, config) {
                let js = `
                    location.href = '${config.questPage}'
                `;
                console.info(js);
                webview.executeJavaScript(js);
                LogStore.push(`跳转至任务列表界面:${config.questPage}`);
                setTimeout(resume, 500);
            },
            //点击任务按钮，转至选择召唤界面(AP)
            apConfirmQuest(resume, config) {
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
                        setTimeout(resume, 500);
                    }else if(webview.getURL().search(/#quest/ig) == -1) {
                        LogStore.push(`意外脱离预设URL，脚本终止。URL: ${webview.getURL()}`);
                        clearInterval(questTapper);
                    }
                }, 2000);
            },
            //点击任务按钮，转至选择召唤界面(BP)
            bpConfirmQuest(resume) {
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
                        setTimeout(resume, 500);
                    }
                }, 2000);
            },
            //ap确定第一个召唤兽
            apConfirmSupporter(resume) {
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
                        setTimeout(resume, 500);
                    }else if(webview.getURL().search(/#quest/ig) == -1) {
                        LogStore.push(`意外脱离预设URL，脚本终止。URL: ${webview.getURL()}`);
                        clearInterval(supporterTapper);
                    }
                }, 2000);
            },
            //bp确定第一个召唤兽
            bpConfirmSupporter(resume) {
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
                        setTimeout(resume, 500);
                    }else if(webview.getURL().search(/#quest/ig) == -1) {
                        LogStore.push(`意外脱离预设URL，脚本终止。URL: ${webview.getURL()}`);
                        clearInterval(supporterTapper);
                    }
                }, 2000);

                webview.send('supporter');
            },
            //AP战斗——点击战斗按钮，设置自动攻击
            apAutoAttack(resume) {
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
                        setTimeout(resume, 500);
                    }else if(webview.getURL().search(/#raid/ig) == -1) {
                        LogStore.push(`意外脱离预设URL，脚本终止。URL: ${webview.getURL()}`);
                        clearInterval(attackTapper);
                    }
                }, 2000);
            },
            //BP战斗——不停平A
            bpAutoAttack(resume) {
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
                    if(webview.getURL().search(/#quest/ig) != -1){
                        LogStore.push(`战斗结束，进入结算。`);
                        clearInterval(reloader);
                        clearInterval(attackTapper);
                        setTimeout(resume, 500);
                    }else if(webview.getURL().search(/raid_multi/ig) == -1) {
                        LogStore.push(`意外脱离预设URL，脚本终止。URL: ${webview.getURL()}`);
                        clearInterval(reloader);
                        clearInterval(attackTapper);
                    }
                } ,50000);
                let attackTapper = setInterval(() => {
                    webview.executeJavaScript(js);
                } ,5000);
            },
            //AP流程结束，点击OK按钮
            finishApTask(resume) {
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
                        setTimeout(resume, 500);
                    }else if(webview.getURL().search(/#result/ig) == -1) {
                        LogStore.push(`意外脱离预设URL，脚本终止。URL: ${webview.getURL()}`);
                        clearInterval(resultTapper);
                    }
                }, 2000);
            },
            //step6 流程结束，直接跳回主页。
            finishBpTask(resume) {
                LogStore.push('进入BP结算程序..');
                let js = `
                    location.href = 'http://gbf.game.mbga.jp/#mypage'
                `;
                webview.executeJavaScript(js);
                LogStore.push(`流程结束，返回首页。`);
                setTimeout(resume, 500);
            }
        };

        let autoplay = (config) => {

            if(config.questType == 'ap') {
                run(function* autoplay(resume) {
                    yield autoplayUtils.jumpIntoQuestPage(resume, config);
                    yield autoplayUtils.apConfirmQuest(resume, config);
                    yield autoplayUtils.apConfirmSupporter(resume);
                    yield autoplayUtils.apAutoAttack(resume);
                    yield autoplayUtils.finishApTask(resume);
                    LogStore.push(`任务按预期完成~`);
                });
            }else if (config.questType == 'bp') {
                run(function* autoplay(resume) {
                    yield autoplayUtils.jumpIntoQuestPage(resume, config);
                    yield autoplayUtils.bpConfirmQuest(resume);
                    yield autoplayUtils.bpConfirmSupporter(resume);
                    yield autoplayUtils.bpAutoAttack(resume);
                    yield autoplayUtils.finishBpTask(resume);
                    LogStore.push(`任务按预期完成~`);
                });
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
            resolveSpeedUpEvent;

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
                console.log(event.config);
                autoplay(event.config);

                /*
                if(event.autoplay == 'ap') {
        

                    
                } else if(event.autoplay == 'bp') {

                    //step3 点击任务按钮，转至选择召唤界面
                    let step3 = (resume) => {
                        console.info('开始尝试确定任务。');
                        js = `
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
                        let getQuestTapper = setInterval(() => {
                            webview.executeJavaScript(js);
                            console.info('确定任务并验证..');
                            if(webview.getURL().search(/supporter_raid/ig) != -1) {
                                console.info('任务按钮已点击，转至选择召唤界面。');
                                clearInterval(getQuestTapper);
                                setTimeout(resume, 500);
                            }
                        }, 2000);
                    };
                    //step4 点击第一个召唤兽，打开队伍确定页面
                    let step4 = (resume) => {
                        //let questIDs = [40011, 40014];
                        console.info('开始尝试确定召唤兽。');

                        js = `
                            $('div.prt-supporter-attribute').each(function() {
                                if(!($(this).hasClass('disableView'))) {
                                    console.info('已找到，点击。');
                                    $(($(this).find('.btn-supporter'))[0]).trigger('tap');
                                }
                            });
                        `;
                        
                        let supporterTapper = setInterval(() => {
                            console.info('确定召唤兽并进入战斗..');
                            webview.executeJavaScript(js);
                            if(webview.getURL().search(/raid_multi/ig) != -1) {
                                console.info('确定已进入战斗。');
                                clearInterval(supporterTapper);
                                setTimeout(resume, 500);
                            }
                        }, 2000);

                        webview.send('supporter');
                    };
                    //step5 点击战斗按钮
                    let step5 = (resume) => {
                        js = `
                            if($('div.btn-attack-start.display-on').length > 0) {
                                $('div.btn-attack-start.display-on').trigger('tap');
                            }
                            if($('div.prt-popup-footer .btn-usual-text').length > 0) {
                                $('div.prt-popup-footer .btn-usual-text').trigger('tap');
                            }
                        `;
        
                        let reloader = setInterval(() => {
                            webview.reload();
                            if(webview.getURL().search(/#quest/ig) != -1){
                                console.info(`战斗结束，返回任务列表页。`);
                                clearInterval(reloader);
                                clearInterval(attackTapper);
                                setTimeout(resume, 500);
                            }else if(webview.getURL().search(/raid_multi/ig) == -1) {
                                console.info(`意外脱离预设URL，脚本终止。URL: ${webview.getURL()}`);
                                clearInterval(reloader);
                                clearInterval(attackTapper);
                            }
                        } ,30000);
                        let attackTapper = setInterval(() => {
                            webview.executeJavaScript(js);
                        } ,5000);
                        setTimeout(resume, 500);
                    };

                    //step6 流程结束，点击OK按钮
                    let step6 = (resume) => {
                        js = `
                            if($('div.prt-popup-footer .btn-usual-ok').length > 0) {
                                $('div.prt-popup-footer .btn-usual-ok').trigger('tap');
                            }
                        `;
                        let okTapper = setInterval(() => {
                            webview.executeJavaScript(js);
                        } ,5000);
                        webview.executeJavaScript(js);
                        console.info('流程结束，返回任务列表页。');
                        setTimeout(resume, 500);
                    };

                    run(function* autoplay(resume) {
                        yield step1(resume);
                        yield step2(resume);
                        yield step3(resume);
                        yield step4(resume);
                        yield step5(resume);
                    });
                }
                */
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