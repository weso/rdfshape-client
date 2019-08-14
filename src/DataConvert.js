import React from 'react';
import Container from 'react-bootstrap/Container';
import DataTabs from "./DataTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ServerHost from "./ServerHost";
import axios from "axios";
import SelectDataFormat from "./SelectDataFormat";

class DataConvert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textAreaValue: "",
            result: '',
            dataUrl: '',
            dataFile: '',
            activeTab: "byText",
            dataFormat: 'TURTLE',
            targetDataFormat: 'TURTLE'
        };
        this.handleByTextChange = this.handleByTextChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTabChange(value) {
        this.setState({activeTab: value});
    }

    handleByTextChange(value) {
        this.setState({textAreaValue: value});
    }

    handleSubmit(event) {
        const infoUrl = ServerHost() + "/api/data/convert"
        console.log("Try to prepare request to " + infoUrl);
        const textAreaValue = this.state.textAreaValue;
        const activeTab = this.state.activeTab;
        const dataFormat = this.state.dataFormat;
        const targetDataFormat = this.state.targetDataFormat;
        console.log("textAreaValue " + textAreaValue);
        console.log("activeTab " + activeTab);
        let formData = new FormData();
        formData.append('data', textAreaValue);
        formData.append('dataFormat', dataFormat);
        formData.append('targetDataFormat', targetDataFormat);
        console.log("Form data created");
        axios.post(infoUrl,formData).then (response => response.data)
            .then((data) => {
                this.setState({ result: data })
                console.log(this.state.result);
            })
            .catch(function (error) {
                console.log('Error doing server request')
                console.log(error);
            });

        event.preventDefault();
    }

 render() {
     const textAreaValue = this.state.textAreaValue;
     const activeTab = this.state.activeTab;
     return (
       <Container>
         <h1>Convert RDF data</h1>
           <Form onSubmit={this.handleSubmit}>
               <DataTabs textAreaValue={textAreaValue}
                         activeTab={activeTab}
                         handleTabChange={this.handleTabChange}
                         handleByTextChange={this.handleByTextChange}/>
               <SelectDataFormat name="Target data format"/>
               <Button variant="primary">Convert data</Button>
           </Form>
       </Container>
     );
 }
}

export default DataConvert;
