import React from 'react';
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";
import InputTabs from "./InputTabs";

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
