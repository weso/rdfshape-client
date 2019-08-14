import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ServerHost from "./ServerHost";
import InputTabs from "./InputTabs"
import Form from "react-bootstrap/Form";
import DataTabs from "./DataTabs";

class DataInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            textAreaValue: "",
            result: '',
            dataUrl: '',
            dataFile: '',
            activaDataTab: ''
        } ;
     this.handleByTextChange = this.handleByTextChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleByTextChange(value) {
        console.log("Changed..." + value);
        this.setState({textAreaValue: value});
        // this.props.handleByTextChange(e.target.value);
    }

    handleSubmit(event) {
        const infoUrl = ServerHost() + "/api/data/info"
        console.log("Try to prepare request to " + infoUrl);
        const textAreaValue = this.state.textAreaValue;
        console.log("textAreaValue " + textAreaValue);
        event.preventDefault();
    }

 render() {
     const textAreaValue = this.state.textAreaValue;
     return (
       <Container>
         <h1>RDF Data info</h1>
         <Form onSubmit={this.handleSubmit}>
             <DataTabs textAreaValue={textAreaValue}
                       handleByTextChange={this.handleByTextChange}/>
         <Button variant="primary" type="submit">Info about data</Button>
         </Form>
       </Container>
     );
 }
}

export default DataInfo;
