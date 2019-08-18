import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import API from "./API";
import Form from "react-bootstrap/Form";
import FormData from "form-data";
import axios from "axios";
import ResultDataInfo from "./ResultDataInfo";
import DataTabs from "./DataTabs";
import NodeSelector from "./NodeSelector";

class DataExtract extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textAreaValue: "",
            textAreaValueQuery: "",
            result: '',
            dataFormat: "TURTLE",
            dataUrl: '',
            dataFile: '',
            activeTab: "byText",
            activeTabQuery: "byText"
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
        this.setState({dataTextArea: value});
    }

    handleSubmit(event) {
        const infoUrl = API.dataExtract;
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
        return (
            <Container fluid={true}>
                <h1>Extract schema from data</h1>
                <ResultDataInfo result={this.state.result} />
                <Form onSubmit={this.handleSubmit}>
                    <DataTabs textAreaValue={this.state.textAreaValue}
                              activeTab={this.state.activeTab}
                              handleTabChange={this.handleTabChange}
                              handleByTextChange={this.handleByTextChange}
                              defaultDataFormat={this.state.dataFormat}
                              handleDataFormatChange={this.handleDataFormatChange}
                    />
                    <NodeSelector />
                    <Button variant="primary" type="submit">Extract schema</Button>
                </Form>
            </Container>
        );
    }
}

export default DataExtract;
