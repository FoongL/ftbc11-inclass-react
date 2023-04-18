import React from "react";
import Button from "react-bootstrap/Button";

class CustomButton extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Button
        variant={this.props.colorChoice}
        onClick={this.props.customFunction}
        style={{ padding: "3%" }}
      >
        {this.props.children}
      </Button>
    );
  }
}

class CustomButton2 extends CustomButton{
    constructor(props){
        super(props)
    }
}





export {CustomButton, CustomButton2}
