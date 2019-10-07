/* eslint-disable react/prefer-stateless-function */
const React = require('react');
const Board = require('./Board');
require('../styles/Game.scss');

class Game extends React.Component {
  render() {
    const { height, width, mineCounter } = this.props;
    return (
      <Board className="game" height={height} width={width} mineCounter={mineCounter} />
    );
  }
}

module.exports = Game;
