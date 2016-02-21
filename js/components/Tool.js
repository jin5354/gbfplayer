import React from 'react';
import DevPanel from './DevPanel';
import UserInfo from './UserInfo';
import Status from './Status';
import ToolPanel from './ToolPanel';
import Log from './Log';
import '../../scss/antd.less';
import {Collapse} from 'antd';
const Panel = Collapse.Panel;

class Tool extends React.Component {
    componentDidMount() {
    
    }
    render() {
        return (
            <div id="tool">
                <Collapse defaultActiveKey={['1']}>
                    <Panel header="Info" key="1">
                        <UserInfo />
                        <br />
                        <Status />
                    </Panel>
                    <Panel header="Tool" key="2">
                        <ToolPanel />
                    </Panel>
                    <Panel header="Dev" key="3">
                        <DevPanel />
                    </Panel>
                    <Panel header="Log" key="4">
                        <Log />
                    </Panel>
                </Collapse>
            </div>
        );
    }
}

export default Tool;
