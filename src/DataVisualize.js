import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ServerHost from "./ServerHost";
import DataTabs from "./DataTabs"
import Form from "react-bootstrap/Form";
import axios from "axios";
import SelectGraphFormat from "./SelectGraphFormat";
import ResultDataVisualization from "./ResultDataVisualization";

class DataVisualize extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textAreaValue: "",
            result: '',
            dataUrl: '',
            dataFile: '',
            activeTab: "byText",
            dataFormat: 'TURTLE',
            targetGraphFormat: 'SVG'
        };
        this.handleByTextChange = this.handleByTextChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDataFormatChange = this.handleDataFormatChange.bind(this);
        this.handleTargetGraphFormatChange = this.handleTargetGraphFormatChange.bind(this);
    }

    handleTabChange(value) {
        this.setState({activeTab: value});
    }

    handleByTextChange(value) {
        this.setState({textAreaValue: value});
    }

    handleTargetGraphFormatChange(value) {
        this.setState({targetGraphFormat: value});
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
        const targetDataFormat = this.state.targetGraphFormat;
        console.log("textAreaValue " + textAreaValue);
        console.log("activeTab " + activeTab);
        let formData = new FormData();
        formData.append('data', textAreaValue);
        formData.append('dataFormat', dataFormat);
        formData.append('targetDataFormat', targetDataFormat);
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
         <h1>Visualize RDF data</h1>
         <ResultDataVisualization result={this.state.result} />
         <Form onSubmit={this.handleSubmit}>
             <DataTabs textAreaValue={this.state.textAreaValue}
                       dataFormat={this.state.dataFormat}
                       activeTab={this.state.activeTab}
                       handleTabChange={this.handleTabChange}
                       handleByTextChange={this.handleByTextChange}
                       handleDataFormatChange={this.handleDataFormatChange}
             />
             <SelectGraphFormat name="Graph format"
                               default={this.state.graphFormat}
                               handleChange={this.handleTargetGraphFormatChange}
             />
         <Button variant="primary" type="submit">Visualize</Button>
         </Form>
       </Container>
     );
 }
}

export default DataVisualize;
