const React = require('react');
const GameWebview = require('./GameWebview.js');
const GameFooter = require('./GameFooter.js');

class App extends React.Component {
    render() {
        return (
            <div>
                <div id="container">
                    <GameWebview />
                    <GameFooter />
                </div>
                <div id="tool"></div>
            </div>
        );
    }
}

export default App;