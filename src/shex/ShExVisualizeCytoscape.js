import axios from "axios";
import qs from "query-string";
import React from 'react';
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import Pace from "react-pace-progress";
import API from "../API";
import CytoSchema from "../cytoscape/CytoSchema";
import { mkPermalink, params2Form, Permalink } from "../Permalink";
import { paramsFromStateShEx, shExParamsFromQueryParams } from "./ShEx";
import ShExTabs from "./ShExTabs";


const url = API.schemaVisualizeCytoscape ;

class ShExVisualizeCytoscape extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            result: '',
            elements: null,
            permalink: null,
            loading: false,
            shExTextArea: "",
            shExFormat: API.defaultShExFormat,
            shExUrl: "",
            shExFile: null,
            shExActiveTab: API.defaultTab,
        } ;

        this.handleShExTabChange = this.handleShExTabChange.bind(this);
        this.handleShExFormatChange = this.handleShExFormatChange.bind(this);
        this.handleShExByTextChange = this.handleShExByTextChange.bind(this);
        this.handleShExUrlChange = this.handleShExUrlChange.bind(this);
        this.handleShExFileUpload = this.handleShExFileUpload.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.postVisualize = this.postVisualize.bind(this);
        this.processResult = this.processResult.bind(this);
        this.updateStateVisualize = this.updateStateVisualize.bind(this);
        this.updateStateShEx = this.updateStateShEx.bind(this);
    }

    handleShExTabChange(value) { this.setState({shExActiveTab: value}); }
    handleShExFormatChange(value) {  this.setState({shExFormat: value}); }
    handleShExByTextChange(value) { this.setState({shExTextArea: value}); }
    handleShExUrlChange(value) { this.setState({shExUrl: value}); }
    handleShExFileUpload(value) { this.setState({shExFile: value}); }

    componentDidMount() {
        if (this.props.location.search) {
            const queryParams = qs.parse(this.props.location.search);
            let params = shExParamsFromQueryParams(queryParams);
            const formData = params2Form(params);
            this.postVisualize(url, formData, () => this.updateStateVisualize(params))
        }
    }

    updateStateVisualize(params) {
        this.updateStateShEx(params)
    }

    updateStateShEx(params) {
        if (params['shEx']) {
            this.setState({shExActiveTab: API.byTextTab})
            this.setState({shExTextArea: params['shEx']})
        }
        if (params['shExFormat']) this.setState({shExFormat: params['shExFormat']})
        if (params['shExUrl']) {
            this.setState({shExActiveTab: API.byUrlTab})
            this.setState({shExUrl: params['shExUrl']})
        }
        if (params['shExFile']) {
            this.setState({shExActiveTab: API.byFileTab})
            this.setState({shExFile: params['shExFile']})
        }
    }

    async handleSubmit(event) {
        let params = paramsFromStateShEx(this.state);
        params['schemaEngine'] = 'ShEx';
        let formData = params2Form(params);
        let permalink = await mkPermalink(API.shExVisualizeRoute, params);
        this.setState({loading: true});
        this.setState({permalink: permalink});
        this.postVisualize(url, formData);
        event.preventDefault();
    }

    processResult(data) {
        this.setState({
            result: data,
            elements: this.result2Elements(data)
        });
    }

    result2Elements(result) {
        return result;
    }
    postVisualize(url, formData, cb) {
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                this.setState({loading:false});
                this.processResult(data);
                if (cb) cb()
            })
            .catch(function (error) {
//                this.setState({loading:false});
//                this.setState({error:error});
                console.log('Error doing server request');
                console.log(error);
            });
    }


    render() {
        return (
            <Container fluid={true}>
                <h1>ShEx: Visualize ShEx schemas (Cytoscape)</h1>
                <Form onSubmit={this.handleSubmit}>
                    {this.state.isLoading ? <Pace color="#27ae60"/> :
                        this.state.result ?
                            <CytoSchema elements={this.state.elements} /> : null
                    }
                    { this.state.permalink &&  <Permalink url={this.state.permalink} /> }
                    <ShExTabs activeTab={this.state.shExActiveTab}
                              handleTabChange={this.handleShExTabChange}

                              textAreaValue={this.state.shExTextArea}
                              handleByTextChange={this.handleShExByTextChange}

                              shExUrl={this.state.shExUrl}
                              handleShExUrlChange={this.handleShExUrlChange}

                              handleFileUpload={this.handleShExFileUpload}

                              shExFormat={this.state.shExFormat}
                              handleShExFormatChange={this.handleShExFormatChange}
                    />
                    <Button variant="primary" type="submit">Visualize</Button>
                </Form>
            </Container>
        );
    }
}

export default ShExVisualizeCytoscape;
