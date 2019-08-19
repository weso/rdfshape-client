import React from 'react';
import Form from "react-bootstrap/Form";

class ByText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textAreaValue: this.props.textAreaValue
    };
    console.log("By Text: textAreaValue from props: " + this.props.textAreaValue);
    console.log("By Text: textAreaValue from state: " + this.state.textAreaValue)
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({textAreaValue: e.target.value});
    this.props.handleByTextChange(e.target.value);
  }

  componentDidMount() {
      this.setState({dataTextArea: this.props.textAreaValue});
      console.log("By Text did mount: textAreaValue from props: " + this.props.textAreaValue);
      console.log("By Text did mount: textAreaValue from state: " + this.state.textAreaValue)
  }

 render() {
     return (
        <Form.Group>
         <Form.Label>{this.props.name}</Form.Label>
         <Form.Control as="textarea"
                       rows="3"
                       value={this.props.textAreaValue}
                       onChange={this.handleChange}
                       placeholder={this.props.placeholder}
         />
        </Form.Group>
     );
 }
}

export default ByText;
