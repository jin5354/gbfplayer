import React from 'react';
import {app} from 'remote';
import AppDispatcher from '../dispatcher/AppDispatcher';
import {Button, message, Select} from 'antd';
import remote from 'remote';
import path from 'path';
import jsonfile from 'jsonfile';
import {ipcRenderer, Tray} from 'electron';
import config from 'config';

let dirname = app.getAppPath();

class DevPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = config;
        this.renderAgentSetting = this.renderAgentSetting.bind(this);
    }
    componentDidMount() {
        ipcRenderer.on('clearCache-reply', function(arg, msg) {
            message.success(msg, 1.5);
        });
    }
    openDevTools() {
        AppDispatcher.dispatch({
            type: 'gameWebviewCtrl',
            msg: 'openDevTools'
        });
    }
    openSelfDevTools() {
        remote.getCurrentWindow().openDevTools({
            detach: true
        });
    }
    clearCache() {
        ipcRenderer.send('clearCache-msg', 'clearCache');
    }
    proxyPortOnChange(event) {
        this.setState({
            proxyPort: event.target.value
        });
    }
    setProxyPort() {
        config.proxyPort = this.state.proxyPort;
        jsonfile.writeFile(path.join(dirname, 'config.json'), config, {
            spaces: 4
        }, () => {
            message.success('修改成功，重启程序后生效', 1.5);
            AppDispatcher.dispatch({
                log: `成功设定APP代理端口为${config.proxyPort}。`
            });
        });
    }
    agentTypeOnChange(value) {
        config.agentType = value;
        this.setState({
            agentType: value
        });
        this.forceUpdate.bind(this);
    }
    agentHostOnChange(event) {
        config.agentHost = event.target.value;
        this.setState({
            agentHost: event.target.value
        });
    }
    agentPortOnChange(event) {
        config.agentPort = event.target.value;
        this.setState({
            agentPort: event.target.value
        });
    }
    setAgent() {
        if(!config.agentHost) {config.agentHost = '127.0.0.1';}
        if(!config.agentPort) {config.agentPort = 1080;}
        jsonfile.writeFile(path.join(dirname, 'config.json'), config, {
            spaces: 4
        }, () => {
            message.success('修改成功，重启程序后生效', 1.5);
            AppDispatcher.dispatch({
                log: '成功设定代理。'
            });
        });
    }
    renderAgentSetting() {
        if(this.state.agentType != '0') {
            return (<p className="agent-setting">Host: <input value={this.state.agentHost} onChange={this.agentHostOnChange.bind(this)} /> Port: <input value={this.state.agentPort} onChange={this.agentPortOnChange.bind(this)} /></p>);
        }
    }
    autoplay_ap() {
        AppDispatcher.dispatch({
            type: 'gameWebviewCtrl',
            msg: 'autoplay',
            log: '启动AutoPlay_ap!',
            config: {
                questType: 'ap',
                questPage: 'http://gbf.game.mbga.jp/#quest/extra',
                questID: '40022'
            }
        });
    }
    autoplay_bp() {
        AppDispatcher.dispatch({
            type: 'gameWebviewCtrl',
            msg: 'autoplay',
            log: '启动AutoPlay_bp!',
            config: {
                questType: 'bp',
                questPage: 'http://gbf.game.mbga.jp/#quest/assist',
                questID: '40022'
            }
        });
    }
    render() {
        return (
            <div id="DevPanel">
                <div>
                    <p className="port">APP代理端口  <span><input value={this.state.proxyPort} onChange={this.proxyPortOnChange.bind(this)} /><Button type="primary" size="small" onClick={this.setProxyPort.bind(this)}>确定</Button></span></p>
                    <p className="agent">网页代理 
                        <span>
                            <Select defaultValue={this.state.agentType} style={{ width: 100 }} onChange={this.agentTypeOnChange.bind(this)}>
                                <Option value="0">不使用代理</Option>
                                <Option value="1">SOCKS5</Option>
                            </Select>
                            <Button type="primary" size="small" onClick={this.setAgent.bind(this)}>确定</Button>
                        </span>
                    </p>
                    {this.renderAgentSetting()}
                    <hr />
                    <p><Button type="primary" size="small" onClick={this.openSelfDevTools}>打开AppDevTools</Button></p>
                    <p><Button type="primary" size="small" onClick={this.openDevTools}>打开WebviewDevTools</Button></p>
                    <p><Button type="primary" size="small" onClick={this.clearCache}>清除全部缓存</Button></p>
                    <p><Button type="primary" size="small" onClick={this.autoplay_ap}>Autoplay-刷ap</Button></p>
                    <p><Button type="primary" size="small" onClick={this.autoplay_bp}>Autoplay-刷bp</Button></p>
                </div>
            </div>
        );
    }
}

export default DevPanel;
