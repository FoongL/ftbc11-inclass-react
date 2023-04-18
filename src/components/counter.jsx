import React from "react";
import Button from 'react-bootstrap/Button';
import {CustomButton} from './buttons'

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: 0,
      decrementClick:0
    };
    // this.increment = this.increment.bind(this)
    // this.decrement = this.decrement.bind(this)
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.clicked !==  this.state.clicked){
      console.log('I have clicked increment click')
    } else if(prevState.decrementClick !==  this.state.decrementClick){
      console.log('I have clicked decrement click')
    }
  }

  increment = () => {
    this.setState({
      clicked: this.state.clicked + 1,
    });
  };

  decrement = () => {
    this.setState({
      decrementClick: this.state.decrementClick + 1,
    });
  };



  render() {
    const { name, globalIncrement, globalDecrement } = this.props;
    // const name = this.props.name
    return (
      <div className="Counter">
        <h2>Hello {name}, here is your new counter</h2>
        {/* <h2>{globalClickState}</h2> */}
        {/* <Button variant='info' onClick={globalIncrement}>+</Button>
        <Button variant = 'danger' onClick={globalDecrement}>-</Button> */}
        <CustomButton customFunction={globalIncrement}>+</CustomButton>
        <CustomButton  customFunction={globalDecrement}>-</CustomButton>
      </div>
    );
  }
}
export default Counter;
