import React from 'react';
import DevPanel from './DevPanel';
import UserInfo from './UserInfo';
import Status from './Status';
import GameDataStore from '../stores/GameDataStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import '../../scss/antd.less';
import {Tabs, Icon} from 'antd';
const TabPane = Tabs.TabPane;

const tabContent = [
    <span><Icon type="solution" />Info</span>,
    <span><Icon type="appstore" />Tool</span>,
    <span><Icon type="setting" />Dev</span>
];

class Tool extends React.Component {
    componentDidMount() {
        //GameDataStore.addEventListener('change', this.forceUpdate.bind(this));
    }
    render() {
        return (
            <div id="tool">
                <Tabs defaultActiveKey="1">
                    <TabPane tab={tabContent[0]} key="1">
                        <UserInfo />
                        <br />
                        <Status />
                    </TabPane>
                    <TabPane tab={tabContent[1]} key="2">空着</TabPane>
                    <TabPane tab={tabContent[2]} key="3">
                        <DevPanel />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default Tool;
