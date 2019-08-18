import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import API from "./API";
import DataTabs from "./DataTabs"
import QueryTabs from "./QueryTabs"
import Form from "react-bootstrap/Form";
import FormData from "form-data";
import axios from "axios";
import ResultDataInfo from "./ResultDataInfo";

class DataQuery extends React.Component {

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
        this.handleByTextChangeQuery = this.handleByTextChange.bind(this);
        this.handleTabChangeQuery = this.handleTabChange.bind(this);

    }

    handleDataFormatChange(value) {
        this.setState({dataFormat: value});
    }

    handleTabChange(value) {
        console.log("Changed tab..." + value);
        this.setState({activeTab: value});
    }

    handleTabChangeQuery(value) {
        console.log("Changed tab..." + value);
        this.setState({activeTabQuery: value});
    }

    handleByTextChange(value) {
        this.setState({dataTextArea: value});
    }

    handleByTextChangeQuery(value) {
        this.setState({textAreaValueQuery: value});
    }

    handleSubmit(event) {
        const infoUrl = API.dataQuery;
        console.log("Try to prepare request to " + infoUrl);
        const textAreaValue = this.state.textAreaValue;
        const textAreaValueQuery = this.state.textAreaValueQuery;
        const activeTab = this.state.activeTab;
        const dataFormat = this.state.dataFormat;
        console.log("textAreaValue " + textAreaValue);
        console.log("activeTab " + activeTab);
        let formData = new FormData();
        formData.append('data', textAreaValue);
        formData.append('dataFormat', dataFormat);
        formData.append('query', textAreaValueQuery);
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
                <h1>Data Query</h1>
                <ResultDataInfo result={this.state.result} />
                <Form onSubmit={this.handleSubmit}>
                    <DataTabs textAreaValue={this.state.textAreaValue}
                              activeTab={this.state.activeTab}
                              handleTabChange={this.handleTabChange}
                              handleByTextChange={this.handleByTextChange}
                              defaultDataFormat={this.state.dataFormat}
                              handleDataFormatChange={this.handleDataFormatChange}
                    />
                    <QueryTabs textAreaValue={this.state.textAreaValueQuery}
                              activeTab={this.state.activeTab}
                              handleTabChange={this.handleTabChangeQuery}
                              handleByTextChange={this.handleByTextChangeQuery}
                    />
                    <Button variant="primary" type="submit">Query</Button>
                </Form>
            </Container>
        );
    }
}

export default DataQuery;
