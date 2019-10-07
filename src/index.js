const React = require('react')
const ReactDOM = require('react-dom');
require('./styles/index.css');
const serviceWorker = require('./serviceWorker');
const Game = require('./components/Game');

ReactDOM.render(<Game height={10} width={10} mineCounter={10} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
