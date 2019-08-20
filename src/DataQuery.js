import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import API from "./API";
import DataTabs from "./DataTabs"
import QueryTabs from "./QueryTabs"
import Form from "react-bootstrap/Form";
import axios from "axios";
import ResultQuery from "./ResultQuery";
import {paramsFromStateData, paramsFromStateQuery} from "./Utils";
import {params2Form} from "./Permalink";

class DataQuery extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result: '',

            dataActiveTab: "byText",
            dataTextArea: "",
            dataUrl: '',
            dataFile: '',
            dataFormat: "TURTLE",

            queryActiveTab: "byText",
            queryTextArea: "",
            queryUrl: '',
            queryFile: '',
        } ;

        this.handleTabChangeData = this.handleTabChangeData.bind(this);
        this.handleByTextChangeData = this.handleByTextChangeData.bind(this);
        this.handleUrlChangeData = this.handleUrlChangeData.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);

        this.handleDataFormatChange = this.handleDataFormatChange.bind(this);

        this.handleByTextChangeQuery = this.handleByTextChangeQuery.bind(this);
        this.handleTabChangeQuery = this.handleTabChangeQuery.bind(this);
        this.handleUrlChangeQuery = this.handleUrlChangeQuery.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleTabChangeData(value) { this.setState({dataActiveTab: value}); }
    handleByTextChangeData(value) { this.setState({dataTextArea: value}); }
    handleUrlChangeData(value) { this.setState({dataUrl: value}); }
    handleFileUpload(value) { this.setState({dataFile: value}); }

    handleDataFormatChange(value) { this.setState({dataFormat: value});  }

    handleTabChangeQuery(value) { this.setState({queryActiveTab: value}); }
    handleByTextChangeQuery(value) { this.setState({queryTextArea: value});  }
    handleUrlChangeQuery(value) { this.setState({queryUrl: value}); }
    handleFileUploadQuery(value) { this.setState({queryFile: value}); }

    handleSubmit(event) {
        const infoUrl = API.dataQuery;
        let paramsData = paramsFromStateData(this.state);
        console.log(`DataQuery paramsData: ${JSON.stringify(paramsData)}`)
        let paramsQuery = paramsFromStateQuery(this.state);
        console.log(`DataQuery paramsQuery: ${JSON.stringify(paramsQuery)}`)
        let params = {...paramsData,...paramsQuery}
        console.log(`DataQuery submit params: ${JSON.stringify(params)}`)
        let form = params2Form(params);
        axios.post(infoUrl,form).then (response => response.data)
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
                <ResultQuery result={this.state.result} />
                <Form onSubmit={this.handleSubmit}>
                    <DataTabs activeTab={this.state.dataActiveTab}
                              handleTabChange={this.handleTabChangeData}

                              textAreaValue={this.state.dataTextArea}
                              handleByTextChange={this.handleByTextChangeData}

                              dataUrl={this.state.dataUrl}
                              handleDataUrlChange={this.handleUrlChangeData}

                              handleFileUpload={this.handleDataFileUploadData}

                              dataFormat={this.state.dataFormat}
                              handleDataFormatChange={this.handleFormatChangeData}
                    />
                    <QueryTabs activeTab={this.state.queryActiveTab}
                              handleTabChange={this.handleTabChangeQuery}

                              textAreaValue={this.state.queryTextArea}
                              handleByTextChange={this.handleByTextChangeQuery}

                              urlValue={this.state.queryUrl}
                              handleDataUrlChange={this.handleUrlChangeQuery}

                              handleFileUpload={this.handleFileUploadQuery}
                    />
                    <Button variant="primary" type="submit">Query</Button>
                </Form>
            </Container>
        );
    }
}

export default DataQuery;
