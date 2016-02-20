import React from 'react';
import LogStore from '../stores/LogStore';

class Log extends React.Component {
    componentDidMount() {
        LogStore.addEventListener('log', this.forceUpdate.bind(this));
    }
    renderLog() {
        let log = LogStore.getLog();
        return log.map((e) => {
            return <p>{e}</p>;
        });
    }
    render() {
        return (
            <div id="Log">
                {this.renderLog()}
            </div>
        );
    }
}

export default Log;
