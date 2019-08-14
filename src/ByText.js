import React from 'react';
import Form from "react-bootstrap/Form";

class ByText extends React.Component {
  constructor(props) {
    super(props);
    this.state = { textAreaValue: "" };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({textAreaValue: e.target.value});
    this.props.handleByTextChange(e.target.value);
  }

 render() {
     return (
        <Form.Group>
         <Form.Control as="textarea"
                       rows="3"
                       value={this.state.textAreaValue}
                       onChange={this.handleChange}
                       placeholder={this.props.placeholder}
         />
        </Form.Group>
     );
 }
}


export default ByText;
