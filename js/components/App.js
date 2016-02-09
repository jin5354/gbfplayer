import React from 'react';
import GameWebview from './GameWebview';
import GameFooter from './GameFooter';
import Tool from './Tool';

class App extends React.Component {
    render() {
        return (
            <div>
                <div id="container">
                    <GameWebview />
                    <GameFooter />
                </div>
                <Tool />
            </div>
        );
    }
}

export default App;