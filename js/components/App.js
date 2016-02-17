import React from 'react';
import GameWebview from './GameWebview';
import GameFooter from './GameFooter';
import Tool from './Tool';
import bridge from '../services/bridge';
import notification from '../services/notification';

bridge.init();
notification.init();

class App extends React.Component {
    render() {
        return (
            <div>
                <div id="container">
                    <div id="webview-wrapper">
                        <GameWebview />
                    </div>
                    <GameFooter />
                </div>
                <Tool />
            </div>
        );
    }
}

export default App;