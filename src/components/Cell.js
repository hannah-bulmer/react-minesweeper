import React from 'react'

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: this.props.isClicked,
      value: this.props.cellValue,
      saveValue: this.props.cellValue,
    };
  }

  onClick = (e) => {
    const { x, y, onCellClick } = this.props;
    onCellClick(e,x,y);
  }
  
  render() {
    let { value, clicked } = this.state;
    const { isClicked, flag } = this.props;
    if (flag) value = '🚩'
    else if (clicked || isClicked) {}
    else value = '';
    const classNames = isClicked || clicked ? "clicked square" : "square";
    return (
      <button className={classNames} onClick={this.onClick}>
        {value}
      </button>
    );
  }
}

export default Cell;
