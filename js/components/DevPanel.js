import React from 'react';
import {app} from 'remote';
import AppDispatcher from '../dispatcher/AppDispatcher';
import {Button, message, Select} from 'antd';
import remote from 'remote';
import path from 'path';
import jsonfile from 'jsonfile';
import {ipcRenderer} from 'electron';
import config from 'config';

let dirname = app.getAppPath();

class DevPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            proxy: config.proxy,
            agent: config.agent
        };
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
            proxy: {
                port: event.target.value
            }
        });
    }
    setProxyPort() {
        config.proxy.port = this.state.proxy.port;
        jsonfile.writeFile(path.join(dirname, 'config.json'), config, {
            spaces: 4
        }, () => {
            message.success('修改成功，重启程序后生效', 1.5);
            AppDispatcher.dispatch({
                log: `成功设定APP代理端口为${config.proxy.port}。`
            });
        });
    }
    agentTypeOnChange(value) {
        this.setState({
            agent: {
                type: value
            }
        });
        this.forceUpdate.bind(this);
    }
    agentHostOnChange(event) {
        this.setState({
            agent: {
                host: event.target.value
            }
        });
    }
    agentPortOnChange(event) {
        this.setState({
            agent: {
                port: event.target.value
            }
        });
    }
    setAgent() {
        config.agent = this.state.agent;
        if(!config.agent.host) {config.agent.host = '127.0.0.1';}
        if(!config.agent.port) {config.agent.port = 1080;}
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
        console.log(this.state.agent);
        if(this.state.agent.type != '0') {
            return (<p className="agent-setting">Host: <input value={this.state.agent.host || '127.0.0.1'} onChange={this.agentHostOnChange.bind(this)} /> Port: <input value={this.state.agent.port || '1080'} onChange={this.agentPortOnChange.bind(this)} /></p>);
        }
    }
    render() {
        return (
            <div id="DevPanel">
                <div>
                    <p className="port">APP代理端口  <span><input value={this.state.proxy.port} onChange={this.proxyPortOnChange.bind(this)} /><Button type="primary" size="small" onClick={this.setProxyPort.bind(this)}>确定</Button></span></p>
                    <p className="agent">网页代理 
                        <span>
                            <Select defaultValue={this.state.agent.type} style={{ width: 100 }} onChange={this.agentTypeOnChange.bind(this)}>
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
                </div>
            </div>
        );
    }
}

export default DevPanel;
