import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import API from "./API";
import DataTabs from "./DataTabs"
import Form from "react-bootstrap/Form";
import axios from "axios";
import {paramsFromStateData} from "./Utils";
import {mkPermalink, params2Form} from "./Permalink";
import Cyto from "./Cyto";
import Pace from 'react-pace-progress';

const cose = "cose"
const random = "random"


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

    handleTabChange(value) { console.log(`#### Tab Change dataActiveTab ${value}`); this.setState({dataActiveTab: value}); }
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
        let params = paramsFromStateData(this.state);
        let formData = params2Form(params);
        console.log(`CytoVisualize state: ${JSON.stringify(this.state)}`)
        console.log(`CytoVisualize submit params: ${JSON.stringify(params)}`)
        let permalink = mkPermalink(API.cytoVisualizeRoute, params);
        formData.append('targetDataFormat', "JSON"); // Converts to JSON elements which are visualized by Cytoscape
        this.setState({loading:true});
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                this.processData(data,permalink)
                this.setState({loading:false});
            })
            .catch(function (error) {
                this.setState({loading:false});
                this.setState({error:error});
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
         {this.state.isLoading ? <Pace color="#27ae60"/> :
            <Cyto elements={this.state.elements}
                  layoutName={this.state.layoutName}
            />
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
