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
import {dataParamsFromQueryParams, formDataFromState, maybeAdd} from "./Utils";
import {mkPermalink} from "./Permalink";
import qs from "query-string";
import Cyto from "./Cyto";
import ShowSVG from "./Cyto";
import Viz from 'viz.js/viz.js';
const {Module, render} = require('viz.js/full.render.js');

const cose = "cose"
const random = "random"


class CytoVisualize extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataTextArea: '',
            result: '',
            dataFormat: "TURTLE",
            dataUrl: '',
            dataFile: null,
            activeTab: "byText",
            permalink: '',
            elements: [],
            layoutName: random
        };
        this.changeLayout = this.changeLayout.bind(this);
        this.handleByTextChange = this.handleByTextChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleDataFormatChange = this.handleDataFormatChange.bind(this);
        this.handleDataUrlChange = this.handleDataUrlChange.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.processData = this.processData.bind(this);
    }

    handleTabChange(value) { this.setState({activeTab: value}); }
    handleByTextChange(value) { this.setState({dataTextArea: value});    }
    handleDataUrlChange(value) { this.setState({dataUrl: value}); }
    handleFileUpload(value) { this.setState({dataFile: value}); }
    handleDataFormatChange(value) { this.setState({dataFormat: value}); }


/*    componentDidMount() {
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

    processData(data,permalink) {
      console.log("Elements " + data.result);
      const elements = JSON.parse(data.result)
      this.setState({
            result: data,
            permalink: permalink,
            elements: elements
        });
    }

    handleSubmit(event) {
        const url = API.dataConvert;
        let [formData,params] = formDataFromState(this.state);
        formData.append('targetDataFormat', "JSON");
        let permalink = mkPermalink(API.cytoVisualizeRoute, params);
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                this.processData(data,permalink)
            })
            .catch(function (error) {
                console.log('Error doing server request')
                console.log(error);
            });

        event.preventDefault();
    }

 changeLayout(e) {
        console.log("Change layout: " + e.target.value);
        this.setState({layoutName: e.target.value});
        e.preventDefault();
    }

 render() {
     const targetGraphFormat = this.state.targetGraphFormat
     return (
       <Container fluid={true}>
         <h1>Visualize RDF data</h1>
         <Cyto elements={this.state.elements}
               layoutName={this.state.layoutName}
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
         <Button variant="primary" type="submit">Visualize</Button>
             <Form.Group>
                 <Button variant="secondary" onClick={this.changeLayout} value="cose">COSE Layaout</Button>
                 <Button variant="secondary" onClick={this.changeLayout} value="random">Random</Button>
                 <Button variant="secondary" onClick={this.changeLayout} value="circle">Circle</Button>
             </Form.Group>
         </Form>
       </Container>
     );
 }
}

export default CytoVisualize;
