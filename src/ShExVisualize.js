import React from 'react';
import Container from 'react-bootstrap/Container';
import DataTabs from "./DataTabs"
import ShExTabs from "./ShExTabs"
import ShapeMapTabs from "./ShapeMapTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "./API";
import axios from "axios";
import ResultShExVisualize from "./ResultShExVisualize";
import {
    shExParamsFromQueryParams,
    paramsFromStateShEx} from "./Utils";
import {mkPermalink, params2Form, Permalink} from "./Permalink";
import Pace from "react-pace-progress";
import qs from "query-string";

const url = API.schemaVisualize ;

class ShExVisualize extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            result: '',
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
        console.log("Component Did mount - dataConvert");
        if (this.props.location.search) {
            const queryParams = qs.parse(this.props.location.search);
            console.log("Parameters: " + JSON.stringify(queryParams));
            let paramsShEx = shExParamsFromQueryParams(queryParams);
            let params = paramsShEx
            const formData = params2Form(params);
            this.postValidate(url, formData, () => this.updateStateVisualize(params))
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

    handleSubmit(event) {
        let paramsShEx = paramsFromStateShEx(this.state);
        let params = paramsShEx
        params['schemaEngine']='ShEx'
        let formData = params2Form(params);
        let permalink = mkPermalink(API.shExVisualizeRoute, params);
        this.setState({loading:true});
        this.setState({permalink: permalink});
        this.postValidate(url,formData)
        event.preventDefault();
    }

    processResult(data) {
        this.setState({
            result: data,
        });
    }

    postVisualize(url, formData, cb) {
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                this.setState({loading:false});
                this.processResult(data)
                if (cb) cb()
            })
            .catch(function (error) {
//                this.setState({loading:false});
//                this.setState({error:error});
                console.log('Error doing server request')
                console.log(error);
            });
    }


    render() {
        return (
            <Container fluid={true}>
                <h1>ShEx: Visualize ShEx schemas</h1>
                <Form onSubmit={this.handleSubmit}>
                    {this.state.isLoading ? <Pace color="#27ae60"/> :
                        this.state.result ?
                            <ResultShExVisualize result={this.state.result} /> : null
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

export default ShExVisualize;
