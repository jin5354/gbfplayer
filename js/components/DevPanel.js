import React from 'react';
import {app} from 'remote';
import AppDispatcher from '../dispatcher/AppDispatcher';
import {Button, message} from 'antd';
import remote from 'remote';
import path from 'path';
import jsonfile from 'jsonfile';
import {ipcRenderer} from 'electron';
import config from '../../config.json';

let dirname = app.getAppPath();

class DevPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            proxyPort: config.proxy.port
        };
        this.proxyPortOnChange = this.proxyPortOnChange.bind(this);
        this.setProxyPort = this.setProxyPort.bind(this);
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
        jsonfile.writeFile(path.join(dirname, 'config.json'), {
            proxy: {
                port: this.state.proxyPort
            }
        }, {
            spaces: 4
        }, () => {
            message.success('修改成功，重启程序后生效', 1.5);
        });
    }
    render() {
        return (
            <div id="DevPanel">
                <div>
                    <p className="port">代理端口  <span><input value={this.state.proxyPort} onChange={this.proxyPortOnChange} /><Button type="primary" size="small" onClick={this.setProxyPort}>确定</Button></span></p>
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
