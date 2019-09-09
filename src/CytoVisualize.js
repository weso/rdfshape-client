import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import API from "./API";
import DataTabs from "./DataTabs"
import Form from "react-bootstrap/Form";
import axios from "axios";
import {dataParamsFromQueryParams, paramsFromStateData} from "./Utils";
import {mkPermalink, params2Form, Permalink} from "./Permalink";
import Cyto from "./Cyto";
import Pace from 'react-pace-progress';
import qs from 'query-string';

class CytoVisualize extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            dataTextArea: '',
            result: '',
            dataFormat: "TURTLE",
            dataUrl: '',
            dataFile: null,
            dataActiveTab: "byText",
            permalink: '',
            elements: null,
        };
        this.handleByTextChange = this.handleByTextChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleDataFormatChange = this.handleDataFormatChange.bind(this);
        this.handleDataUrlChange = this.handleDataUrlChange.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.processData = this.processData.bind(this);
        this.postConvert = this.postConvert.bind(this);
    }

    handleTabChange(value) { console.log(`#### Tab Change dataActiveTab ${value}`); this.setState({dataActiveTab: value}); }
    handleByTextChange(value) { this.setState({dataTextArea: value});    }
    handleDataUrlChange(value) { this.setState({dataUrl: value}); }
    handleFileUpload(value) { this.setState({dataFile: value}); }
    handleDataFormatChange(value) { this.setState({dataFormat: value}); }

    componentDidMount() {
        console.log("Component Did mount - cytoVisualize");
        if (this.props.location.search) {
            const queryParams = qs.parse(this.props.location.search);
            console.log("Parameters: " + JSON.stringify(queryParams));
            let dataParams = dataParamsFromQueryParams(queryParams);
            let formData = params2Form(dataParams);
            formData.append('targetDataFormat', "JSON"); // Converts to JSON elements which are visualized by Cytoscape
            const url = API.dataConvert
            console.log("Preparing request to " + url);
            this.postConvert(url, formData);
            /* TODO: Should we populate dataTextArea after the call?
            if (newParams.data) { this.setState({dataTextArea: newParams.data}) }
            if (newParams.dataFormat) { this.setState({dataFormat: newParams.dataFormat}) }
            if (newParams.dataUrl) { this.setState({dataUrl: newParams.dataUrl}) }
            if (newParams.targetDataFormat) { this.setState({targetDataFormat: newParams.targetDataFormat}) }
             */
        }
    }

    processData(data) {
      console.log("Elements " + data.result);
      const elements = JSON.parse(data.result)
      this.setState({
            result: data,
            elements: elements
        });
    }

    postConvert(url, formData) {
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                this.setState({loading:false});
                this.processData(data)
            })
            .catch(function (error) {
                this.setState({loading:false});
                this.setState({error:error});
                console.log('Error doing server request')
                console.log(error);
            });
    }

    handleSubmit(event) {
        const url = API.dataConvert;
        let params = paramsFromStateData(this.state);
        let formData = params2Form(params);
        console.log(`CytoVisualize state: ${JSON.stringify(this.state)}`)
        console.log(`CytoVisualize submit params: ${JSON.stringify(params)}`)
        let permalink = mkPermalink(API.cytoVisualizeRoute, params);
        formData.append('targetDataFormat', "JSON"); // Converts to JSON elements which are visualized by Cytoscape
        this.setState({loading:true});
        this.setState({permalink: permalink});
        this.postConvert(url,formData);
        event.preventDefault();
    }

 render() {
     return (
       <Container fluid={true}>
         <h1>Visualize RDF data</h1>
         {this.state.isLoading ? <Pace color="#27ae60"/> :
            this.state.elements ?
                <Cyto elements={this.state.elements} /> : null
         }
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
         <Button variant="primary" type="submit">Visualize</Button>
         </Form>
         { this.state.permalink !== '' &&  <Permalink url={this.props.permalink} /> }
       </Container>
     );
 }
}

export default CytoVisualize;
