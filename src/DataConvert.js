import React from 'react';
import Container from 'react-bootstrap/Container';
import DataTabs from "./DataTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ServerHost from "./ServerHost";
import axios from "axios";
import SelectDataFormat from "./SelectDataFormat";
import ResultDataConvert from "./ResultDataConvert";

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
        this.handleDataFormatChange = this.handleDataFormatChange.bind(this);
        this.handleTargetDataFormatChange = this.handleTargetDataFormatChange.bind(this);
    }

    handleTabChange(value) {
        this.setState({activeTab: value});
    }

    handleByTextChange(value) {
        this.setState({textAreaValue: value});
    }

    handleTargetDataFormatChange(value) {
        this.setState({targetDataFormat: value});
    }

    handleDataFormatChange(value) {
        this.setState({dataFormat: value});
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
        console.log("Form data created. dataFormat" + dataFormat);
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
     return (
       <Container fluid={true}>
         <h1>Convert RDF data</h1>
           <ResultDataConvert result={this.state.result} />
           <Form onSubmit={this.handleSubmit}>
               <DataTabs textAreaValue={this.state.textAreaValue}
                         dataFormat={this.state.dataFormat}
                         activeTab={this.state.activeTab}
                         handleTabChange={this.handleTabChange}
                         handleByTextChange={this.handleByTextChange}
                         handleDataFormatChange={this.handleDataFormatChange}
               />
               <SelectDataFormat name="Target data format"
                                 dataFormat={this.state.targetDataFormat}
                                 handleDataFormatChange={this.handleTargetDataFormatChange}
               />
               <Button variant="primary" type="submit">Convert data</Button>
           </Form>
       </Container>
     );
 }
}

export default DataConvert;
