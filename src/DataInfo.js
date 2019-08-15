import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ServerHost from "./ServerHost";
import axios from 'axios';
import Form from "react-bootstrap/Form";
import DataTabs from "./DataTabs";
import ResultDataInfo from "./ResultDataInfo";
import FormData from 'form-data';

class DataInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            textAreaValue: "",
            result: '',
            dataFormat: "TURTLE",
            dataUrl: '',
            dataFile: '',
            activeTab: "byText"
        } ;
     this.handleByTextChange = this.handleByTextChange.bind(this);
     this.handleTabChange = this.handleTabChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
     this.handleDataFormatChange = this.handleDataFormatChange.bind(this);

    }

    handleDataFormatChange(value) {
        this.setState({dataFormat: value});
    }

    handleTabChange(value) {
        console.log("Changed tab..." + value);
        this.setState({activeTab: value});
    }

    handleByTextChange(value) {
        this.setState({textAreaValue: value});
    }

    handleSubmit(event) {
        const infoUrl = ServerHost() + "/api/data/info"
        console.log("Try to prepare request to " + infoUrl);
        const textAreaValue = this.state.textAreaValue;
        const activeTab = this.state.activeTab;
        const dataFormat = this.state.dataFormat;
        console.log("textAreaValue " + textAreaValue);
        console.log("activeTab " + activeTab);
        let formData = new FormData();
        formData.append('data', textAreaValue);
        formData.append('dataFormat', dataFormat);
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
       <Container fluid={true}>
         <h1>RDF Data info</h1>
         <ResultDataInfo result={this.state.result} />
         <Form onSubmit={this.handleSubmit}>
             <DataTabs textAreaValue={textAreaValue}
                       activeTab={activeTab}
                       handleTabChange={this.handleTabChange}
                       handleByTextChange={this.handleByTextChange}
                       defaultDataFormat={this.state.dataFormat}
                       handleDataFormatChange={this.handleDataFormatChange}
             />
         <Button variant="primary" type="submit">Info about data</Button>
         </Form>
       </Container>
     );
 }
}

export default DataInfo;
