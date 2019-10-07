/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import logo from './logo.svg';
import '../styles/App.css';

class Game extends React.Component {
  render() {
    const { height, width, mineCounter } = this.props;
    return (
      <Board className="game" height={height} width={width} mineCounter={mineCounter} />
    );
  }
}

export default Game;
