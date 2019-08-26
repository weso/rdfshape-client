import React from 'react';
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";

class ByText extends React.Component {
  constructor(props) {
    super(props);
    this.state = { textAreaValue: this.props.textAreaValue };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({textAreaValue: e.target.value});
    this.props.handleByTextChange(e.target.value);
  }


 render() {
     let inputText;
     if (this.props.inputForm) {
         inputText = this.props.inputForm
     } else {
         inputText = <Form.Control as="textarea"
                                   rows="3"
                                   value={this.props.textAreaValue}
                                   onChange={this.handleChange}
                                   placeholder={this.props.placeholder} />
     }
     return (
        <Form.Group>
         <Form.Label>{this.props.name}</Form.Label>
         {inputText}
        </Form.Group>
     );
 }
}

ByText.propTypes = {
    name: PropTypes.string,
    textAreaValue: PropTypes.string,
    handleByTextChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
};

ByText.defaultProps = {
    placeholder: '',
};

export default ByText;
