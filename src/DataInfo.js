import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import API from "./API";
import axios from 'axios';
import Form from "react-bootstrap/Form";
import DataTabs from "./DataTabs";
import ResultDataInfo from "./ResultDataInfo";
import qs from 'query-string';
import { mkPermalink, mkFormData } from "./Permalink";
import {formDataFromState, dataParamsFromQueryParams } from "./Utils";

class DataInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataTextArea: 'RDF',
            result: '',
            dataFormat: "TURTLE",
            dataUrl: '',
            dataFile: null,
            activeTab: "byText",
            permalink: ''
        } ;
     this.handleByTextChange = this.handleByTextChange.bind(this);
     this.handleTabChange = this.handleTabChange.bind(this);
     this.handleDataFormatChange = this.handleDataFormatChange.bind(this);
     this.handleDataUrlChange = this.handleDataUrlChange.bind(this);
     this.handleFileUpload = this.handleFileUpload.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleDataFormatChange(value) { this.setState({dataFormat: value}); }
    handleTabChange(value) { this.setState({activeTab: value});  }
    handleByTextChange(value) { this.setState({dataTextArea: value});  }
    handleDataUrlChange(value) { this.setState({dataUrl: value}); }
    handleFileUpload(value) { this.setState({dataFile: value}); }

    componentDidMount() {
        console.log("Component Did mount");
        if (this.props.location.search) {
            const queryParams = qs.parse(this.props.location.search);
            console.log("Parameters: " + JSON.stringify(queryParams));
            let dataParams = dataParamsFromQueryParams(this.props.location.search);
            const infoUrl = API.dataInfo + "?" + qs.stringify(dataParams);
            console.log("Try to prepare request to " + infoUrl);
            axios.get(infoUrl).then (response => response.data)
                .then((data) => {
                    this.setState({ result: data });
//                    if (params.data) this.setState({dataTextArea: params.data});
//                    if (params.dataFormat) this.setState({dataFormat: params.dataFormat});
//                    if (params.dataUrl) this.setState({dataUrl: params.dataUrl});
                })
                .catch(function (error) {
                    console.log("Error calling server at " + infoUrl + ": " + error);
                });
        }
    }

    handleSubmit(event) {
        const infoUrl = API.dataInfo;
        console.log("Try to prepare request to " + infoUrl);
        let [formData,params] = formDataFromState(this.state);
        let permalink = mkPermalink(API.dataInfoRoute, params);
        console.log("Permalink created: " + JSON.stringify(permalink));
        axios.post(infoUrl,formData).then (response => response.data)
            .then((data) => {
                this.setState({ result: data });
                this.setState({ permalink: permalink });
                console.log(this.state.result);
            })
            .catch(function (error) {
                // this.setState({result: { error: "Error calling server at " + infoUrl + ": " + error}});
                console.log("Error calling server at " + infoUrl + ": " + error);
        });
        event.preventDefault();
    }

 render() {
     return (
       <Container fluid={true}>
         <h1>RDF Data info</h1>
         <ResultDataInfo
             result={this.state.result}
             permalink={this.state.permalink}
         />
         <Form onSubmit={this.handleSubmit}>
             <DataTabs activeTab={this.state.activeTab}
                       handleTabChange={this.handleTabChange}

                       textAreaValue={this.state.dataTextArea}
                       handleByTextChange={this.handleByTextChange}

                       dataUrl={this.state.dataUrl}
                       handleDataUrlChange={this.handleDataUrlChange}

                       handleFileUpload={this.handleFileUpload}

                       dataFormat={this.state.dataFormat}
                       handleDataFormatChange={this.handleDataFormatChange}
             />
         <Button variant="primary" type="submit">Info about data</Button>
         </Form>
       </Container>
     );
 }
}

export default DataInfo;
