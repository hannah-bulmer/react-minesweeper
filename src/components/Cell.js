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
    let { clicked, value, saveValue } = this.state;
    const { neighbours, x, y } = this.props;

    if (this.props.isMine && !e.shiftKey) return this.props.clickMine();

    if (value === '🚩' || !clicked) {
      if (value === '🚩') value = saveValue;
      if (e.shiftKey) {
        value = '🚩'
        this.props.setFlag(x, y);
      } else {
        clicked = true;
        if (neighbours === 0) this.props.clearAllBlanks(x, y);
      }
      this.setState({
        clicked,
        value,
      });
    }
  }
  
  render() {
    let { value, clicked } = this.state;
    const { isClicked } = this.props;
    value = isClicked || clicked || value ==='🚩' ? value : '';
    const classNames = isClicked || clicked ? "clicked square" : "square";
    return (
      <button className={classNames} onClick={this.onClick}>
        {value}
      </button>
    );
  }
}

export default Cell;
