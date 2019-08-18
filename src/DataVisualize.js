import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import API from "./API";
import DataTabs from "./DataTabs"
import Form from "react-bootstrap/Form";
import axios from "axios";
import SelectGraphFormat from "./SelectGraphFormat";
import ResultDataVisualization from "./ResultDataVisualization";
import Cyto from "./Cyto";
import {dataParamsFromQueryParams, formDataFromState, maybeAdd} from "./Utils";
import {mkPermalink} from "./Permalink";
import qs from "query-string";

class DataVisualize extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataTextArea: 'RDF',
            result: '',
            dataFormat: "TURTLE",
            dataUrl: '',
            dataFile: null,
            activeTab: "byText",
            permalink: '',
            targetGraphFormat: 'SVG'
        };
        this.handleByTextChange = this.handleByTextChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleDataFormatChange = this.handleDataFormatChange.bind(this);
        this.handleDataUrlChange = this.handleDataUrlChange.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTargetGraphFormatChange = this.handleTargetGraphFormatChange.bind(this);
    }

    handleTabChange(value) { this.setState({activeTab: value}); }
    handleByTextChange(value) { this.setState({dataTextArea: value});    }
    handleTargetGraphFormatChange(value) {  this.setState({targetGraphFormat: value});   }
    handleDataUrlChange(value) { this.setState({dataUrl: value}); }
    handleFileUpload(value) { this.setState({dataFile: value}); }
    handleDataFormatChange(value) { this.setState({dataFormat: value}); }

    componentDidMount() {
        console.log("Component Did mount - dataConvert");
        if (this.props.location.search) {
            const queryParams = qs.parse(this.props.location.search);
            console.log("Parameters: " + JSON.stringify(queryParams));
            let newParams = dataParamsFromQueryParams(queryParams);
            maybeAdd(queryParams.targetDataFormat,"targetDataFormat", newParams);
            const url = API.dataVisualize + "?" + qs.stringify(newParams);
            console.log("Preparing request to " + url);
            axios.get(url).then (response => response.data)
                .then((data) => {
                    this.setState({ result: data });
                    this.setState({ permalink: url });
                    if (newParams.data) { this.setState({dataTextArea: newParams.data}) }
                    if (newParams.dataFormat) { this.setState({dataFormat: newParams.dataFormat}) }
                    if (newParams.dataUrl) { this.setState({dataUrl: newParams.dataUrl}) }
                    if (newParams.targetDataFormat) { this.setState({targetDataFormat: newParams.targetDataFormat}) }
                })
                .catch(function (error) {
                    console.log("Error calling server at " + url + ": " + error);
                });
        }
    }

    handleSubmit(event) {
        const url = API.dataConvert;
        console.log("Try to prepare request to " + url);
        let [formData,params] = formDataFromState(this.state);
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
         <h1>Visualize RDF data</h1>
         <ResultDataVisualization result={this.state.result}
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
