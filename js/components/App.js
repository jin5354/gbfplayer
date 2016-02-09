const React = require('react');
const GameWebview = require('./gameWebview.js');

class App extends React.Component {
    render() {
        return (
            <div id="container">
                <GameWebview />
                <div id="footer">
                    <div id="footer-ctrl">
                        <div id="footer-back"></div>
                        <div id="footer-navi">
                            <div id="footer-reload"></div>
                            <div id="footer-mypage"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;