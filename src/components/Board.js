/* eslint-disable */
import React from 'react'
import Cell from './Cell';
import { throwStatement } from '@babel/types';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.countNeighbours(),
      lost: false,
      won: false,
    }
  }

  createCell() {
    const cell = {
      value: '',
      isMine: '',
      neighbours: 0,
      flag: false,
      isClicked: false,
    }
    return cell;
  }
  
  createCells() {
    const { height, width } = this.props;
    let board = [];
    [...Array(height)].map((x, i) => {
      let rows = [];
      [...Array(width)].map((z, j) => rows.push(this.createCell()));
      board.push(rows);
    });
    return board;
  }

  placeMines() {
    let { mineCounter, width, height } = this.props;
    const board = this.createCells();
    while (mineCounter > 0) {
      const x = Math.floor(Math.random() * height);
      const y = Math.floor(Math.random() * width);
      if (!board[x][y].isMine) {
        board[x][y].isMine = true;
        board[x][y].value = '💣';
        mineCounter -= 1;
      }
    }
    return board;
  }

  countNeighbours() {
    let { width, height } = this.props;
    height = height - 1;
    width = width - 1;
    const board = this.placeMines();
    board.forEach((row, x) => {
      row.forEach((cell, y) => {
        // check left right up down
        let neighbours = 0;
        if (x > 0 && board[x-1][y].isMine) neighbours += 1; // left
        if (x < height && board[x+1][y].isMine) neighbours += 1; // right
        if (y < width && board[x][y+1].isMine) neighbours += 1; // up
        if (y > 0 && board[x][y-1].isMine) neighbours += 1; // down
        if (x > 0 && y > 0 && board[x-1][y-1].isMine) neighbours += 1; // TL
        if (x < height && y > 0 && board[x+1][y-1].isMine) neighbours += 1; // TR
        if (x > 0 && y < width && board[x-1][y+1].isMine) neighbours += 1; // BL
        if (x < height && y < width && board[x+1][y+1].isMine) neighbours += 1; // BR
        board[x][y].neighbours = neighbours;
        if (!board[x][y].isMine) board[x][y].value = (neighbours === 0) ? '' : neighbours;
      })
    })
    return board;
  }

  clearAllBlanks = (x, y) => {
    const { board } = this.state;
    let {width, height } = this.props;
    width -= 1;
    height -= 1;
    if (board[x][y].neighbours === 0 && !board[x][y].isClicked && !board[x][y].flag) {
      board[x][y].isClicked = true;
      if (x > 0) this.clearAllBlanks(x-1, y);
      if (x < height) this.clearAllBlanks(x+1, y);
      if (y > 0) this.clearAllBlanks(x, y-1);
      if (y < width) this.clearAllBlanks(x, y+1);
      this.setState({ board })
    } else if (!board[x][y].isMine && !board[x][y].flag) {
      board[x][y].isClicked = true;
      this.setState({ board })
    }
  }

  onClick = (e, x, y) => {
    const { board } = this.state;
    if (e.shiftKey) {
      if (!board[x][y].isClicked) this.setFlag(x,y);
    } else {
      if (board[x][y].flag) return;
      else if (board[x][y].isMine) this.clickMine();
      else if (board[x][y].neighbours === 0) this.clearAllBlanks(x, y);
      board[x][y].isClicked = true;
      this.setState({ board });
    }
  }

  setFlag = (x, y) => {
    const { board } = this.state;
    board[x][y].flag = !board[x][y].flag;
    this.setState({ board })
    this.checkIfWon();
  }
 
  clickMine = () => {
    this.setState({ lost: true })
  }

  checkIfWon = () => {
    const { board } = this.state;
    let flagCounter = 0;
    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell.isMine && cell.flag) flagCounter ++;
      })
    })
    if (flagCounter === this.props.mineCounter) this.setState({ won: true })
  }

  renderYouLose() {
    return(
      <div>YOU LOSE</div>
    )
  }

  renderYouWon() {
    return (
      <div>YOU WON</div>
    )
  }
  
  renderCellRows(row, x) {
    const { width } = this.props;
    return (
      [...Array(width)].map((j, i) => {
        return <Cell
          cellValue={row[i].value}
          neighbours={row[i].neighbours}
          key={`${row[i]}${i}`}
          flag={row[i].flag}
          isMine={row[i].isMine}
          onCellClick={this.onClick}
          isClicked={row[i].isClicked}
          x={x}
          y={i}
        />
      })
    )
  }
  
  renderBoard() {
    const { height } = this.props;
    const { board } = this.state;
    return (
      [...Array(height)].map((x, i) => {
        return (
          <div className="board-row" key={`${board[i]}${i}`}>
            {this.renderCellRows(board[i], i)}
          </div>
        )
      })
    )
  }

  render() {
    return (
      <div className="boardBackground">
        {this.renderBoard()}
        {this.state.lost && this.renderYouLose()}
        {this.state.won && this.renderYouWon()}
      </div>
    )
  }
}

export default Board;
