/* eslint-disable */
const React = require('react');
const Cell = require('./Cell');

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
    if (board[x][y].neighbours === 0 && !board[x][y].isClicked) {
      board[x][y].isClicked = true;
      if (x > 0) this.clearAllBlanks(x-1, y);
      if (x < width) this.clearAllBlanks(x+1, y);
      if (y > 0) this.clearAllBlanks(x, y-1);
      if (y < height) this.clearAllBlanks(x, y+1);
      this.setState({ board })
    }
  }

  setFlag = (x, y) => {
    const { board } = this.state;
    console.log("set")
    board[x][y].flag = true;
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
    console.log(flagCounter)
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
          isMine={row[i].isMine}
          clearAllBlanks={this.clearAllBlanks}
          clickMine={this.clickMine}
          isClicked={row[i].isClicked}
          setFlag={this.setFlag}
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
      <div>
        {this.renderBoard()}
        {this.state.lost && this.renderYouLose()}
        {this.state.won && this.renderYouWon()}
      </div>
    )
  }
}

module.exports = Board;
