import React from 'react';
import Container from 'react-bootstrap/Container';
import DataTabs from "./DataTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "./API";
import axios from "axios";
import SelectFormat from "./SelectFormat";
import ResultDataConvert from "./ResultDataConvert";
import {maybeAdd, dataParamsFromQueryParams, paramsFromStateData} from "./Utils";
import qs from "query-string";
import {mkPermalink, params2Form} from "./Permalink";
import InputTabsWithFormat from "./InputTabsWithFormat";

class DataConvert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataTextArea: 'RDF',
            result: '',
            dataFormat: "TURTLE",
            dataUrl: '',
            dataFile: null,
            dataActiveTab: "byText",
            permalink: '',
            targetDataFormat: 'TURTLE'
        };
        this.handleByTextChange = this.handleByTextChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleDataFormatChange = this.handleDataFormatChange.bind(this);
        this.handleDataUrlChange = this.handleDataUrlChange.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTargetDataFormatChange = this.handleTargetDataFormatChange.bind(this);
    }

    handleTabChange(value) { this.setState({dataActiveTab: value}); }
    handleByTextChange(value) { this.setState({dataTextArea: value}); }
    handleDataFormatChange(value) {  this.setState({dataFormat: value}); }
    handleDataUrlChange(value) { this.setState({dataUrl: value}); }
    handleFileUpload(value) { this.setState({dataFile: value}); }
    handleTargetDataFormatChange(value) { this.setState({targetDataFormat: value}); }

    componentDidMount() {
        console.log("Component Did mount - dataConvert");
        if (this.props.location.search) {
            const queryParams = qs.parse(this.props.location.search);
            console.log("Parameters: " + JSON.stringify(queryParams));
            let newParams = dataParamsFromQueryParams(queryParams);
            maybeAdd(queryParams.targetDataFormat,"targetDataFormat", newParams);
            const infoUrl = API.dataConvert + "?" + qs.stringify(newParams);
            console.log("Preparing request to " + infoUrl);
            axios.get(infoUrl).then (response => response.data)
                .then((data) => {
                    this.setState({ result: data });
                    this.setState({ permalink: infoUrl });
                    if (newParams.data) { this.setState({dataTextArea: newParams.data}) }
                    if (newParams.dataFormat) { this.setState({dataFormat: newParams.dataFormat}) }
                    if (newParams.dataUrl) { this.setState({dataUrl: newParams.dataUrl}) }
                    if (newParams.targetDataFormat) { this.setState({targetDataFormat: newParams.targetDataFormat}) }
                })
                .catch(function (error) {
                    console.log("Error calling server at " + infoUrl + ": " + error);
                });
        }
    }

    handleSubmit(event) {
        const url = API.dataConvert;
        console.log("Try to prepare request to " + url);
        let params = paramsFromStateData(this.state);
        let formData = params2Form(params);
        formData.append('targetDataFormat', this.state.targetDataFormat);
        params['targetDataFormat'] = this.state.targetDataFormat ;
        let permalink = mkPermalink(API.dataConvertRoute, params);
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                this.setState({ result: data })
                this.setState({ permalink: permalink });
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
           <Form onSubmit={this.handleSubmit}>
               <DataTabs activeTab={this.state.dataActiveTab}
                         handleTabChange={this.handleTabChange}

                         textAreaValue={this.state.dataTextArea}
                         handleByTextChange={this.handleByTextChange}

                         dataUrl={this.state.dataUrl}
                         handleDataUrlChange={this.handleDataUrlChange}

                         handleFileUpload={this.handleFileUpload}

                         dataFormat={this.state.dataFormat}
                         handleDataFormatChange={this.handleDataFormatChange}
               />
               <SelectFormat name="Target data format"
                             defaultFormat={this.state.targetDataFormat}
                             handleFormatChange={this.handleTargetDataFormatChange}
                             urlFormats={API.dataFormats}
               />
               <Button variant="primary" type="submit">Convert data</Button>
           </Form>
           <ResultDataConvert
               result={this.state.result}
               permalink={this.state.permalink}
           />
       </Container>
     );
 }
}

export default DataConvert;
