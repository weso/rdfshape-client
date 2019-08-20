import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import API from "./API";
import DataTabs from "./DataTabs"
import Form from "react-bootstrap/Form";
import axios from "axios";
import SelectGraphFormat from "./SelectGraphFormat";
import {paramsFromStateData} from "./Utils";
import {mkPermalink, params2Form} from "./Permalink";
import qs from "query-string";
import ShowSVG from "./ShowSVG";
import Viz from 'viz.js/viz.js';
const {Module, render} = require('viz.js/full.render.js');

class DataVisualize extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataTextArea: '',
            result: '',
            dataFormat: "TURTLE",
            dataUrl: '',
            dataFile: null,
            dataActiveTab: "byText",
            permalink: '',
            targetGraphFormat: 'SVG',
            svg: null,
        };
        this.handleByTextChange = this.handleByTextChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleDataFormatChange = this.handleDataFormatChange.bind(this);
        this.handleDataUrlChange = this.handleDataUrlChange.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTargetGraphFormatChange = this.handleTargetGraphFormatChange.bind(this);
        this.processData = this.processData.bind(this);
    }

    handleTabChange(value) { this.setState({dataActiveTab: value}); }
    handleByTextChange(value) { this.setState({dataTextArea: value});    }
    handleDataUrlChange(value) { this.setState({dataUrl: value}); }
    handleFileUpload(value) { this.setState({dataFile: value}); }
    handleDataFormatChange(value) { this.setState({dataFormat: value}); }
    handleTargetGraphFormatChange(value) {  this.setState({targetGraphFormat: value});   }


/* To handle query params   componentDidMount() {
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
    } */

    processData(data, targetFormat) {
       this.convertDot(data.result,'dot','SVG')
    }

    handleSubmit(event) {
        const url = API.dataConvert;
        console.log("Try to prepare request to " + url);
        let params = paramsFromStateData(this.state);
        let formData = params2Form(params);
        const targetFormat = this.state.targetGraphFormat ;
        formData.append('targetDataFormat', 'dot'); // It converts to dot in the server
        params['targetDataFormat'] = targetFormat ; // But it keeps the original target format for permalink
        let permalink = mkPermalink(API.dataVisualizeRoute, params);
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                this.processData(data)
/*                if (originalTargetFormat === "JSON") {
                    this.setState({json: data})
                }
                console.log("DataVisualize Before state change");
                console.log(this.state.result);
                this.setState({ result: data, permalink: permalink });
                console.log("DataVisualize Before after result change");
                console.log(this.state.result); */
            })
            .catch(function (error) {
                console.log('Error doing server request')
                console.log(error);
            });

        event.preventDefault();
    }

    convertDot(dot, engine, format) {
        let viz = new Viz({Module, render});
        const opts = {engine: 'dot'};
        viz.renderSVGElement(dot, opts).then(svg => {
            this.setState({
                svg: svg.outerHTML
            });
        }).catch(error => {
            // Create a new Viz instance (@see Caveats page for more info)
            viz = new Viz({Module, render});
            this.setState({error: "<p>" + error + "</p>"})
            console.error(error);
        });
    }


 render() {
     const targetGraphFormat = this.state.targetGraphFormat
     return (
       <Container fluid={true}>
         <h1>Visualize RDF data</h1>
         <ShowSVG svg={this.state.svg}/>
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
