import React from 'react';
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";

class ByFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null
        };
        this.handleFileUpload = this.handleFileUpload.bind(this);
    }

    handleFileUpload(e) {
        this.setState({
            selectedFile: e.target.files[0],
            loaded: 0
        });
        this.props.handleFileUpload(e.target.files[0]);
    }

 render() {
     return (
        <Form.Group>
         <Form.Label>{this.props.name}</Form.Label>
         <Form.Control as="input"
                       type="file"
                       onChange={this.handleFileUpload}
         />
        </Form.Group>
     );
 }
}

ByFile.propTypes = {
    name: PropTypes.string.isRequired,
    handleFileUpload: PropTypes.func.isRequired,
};

ByFile.defaultProps = {
    name: ''
};

export default ByFile;
