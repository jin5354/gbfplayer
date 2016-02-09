const React = require('react');

function connect(store, ...propNames) {
    return (Target) => {
        // Note: The argument "ViewComponent" must be uppercase. Why?
        class ConnectedViewComponent extends React.Component {
            componentDidMount() {
                store.addChangeListener(this.forceUpdate.bind(this));
            }

            render() {
                let storeProp = {};
                propNames.forEach((e) => {
                    storeProp[e] = store[e]();
                });

                return ( <Target {...storeProp} {...this.props} />);
            }
        }

        // Return the component
        return ConnectedViewComponent;
    };
}

module.exports = connect;
