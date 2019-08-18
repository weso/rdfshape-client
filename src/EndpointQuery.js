import React from 'react';
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import EndpointInput from "./EndpointInput";
import QueryTabs from "./QueryTabs";
import API from "./API";
import FormData from "form-data";
import axios from "axios";
import ResultQuery from "./ResultQuery";


class EndpointQuery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            endpointUrl: '',
            queryTextArea: '',
            queryUrl: '',
            queryFile: '',
            activeTab: "ByText"
        } ;

        this.handleEndpointChange = this.handleEndpointChange.bind(this);
        this.handleByTextChange = this.handleByTextChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTabChange(value) {
        console.log("Changed tab..." + value);
        this.setState({activeTab: value});
    }

    handleByTextChange(value) {
        this.setState({queryTextArea: value});
    }

    handleSubmit(event) {
        const infoUrl = API.endpointQuery;
        console.log("Try to prepare request to " + infoUrl);
        const queryTextArea = this.state.queryTextArea;
        const activeTab = this.state.activeTab;
        let formData = new FormData();
        formData.append('query', queryTextArea);
        formData.append('endpoint', this.state.endpointUrl);
        console.log("Form data created");
        axios.post(infoUrl,formData).then (response => response.data)
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

    handleEndpointChange(value) {
        this.setState({endpointUrl: value});
    }

    render() {
     return (
       <Container fluid={true}>
         <h1>Endpoint query</h1>
           <Form onSubmit={this.handleSubmit}>
               <EndpointInput onChange={this.handleEndpointChange}/>
               <QueryTabs activeTab={this.state.activeTab}
                          textAreaValue={this.state.queryTextArea}
                          handleByTextChange={this.handleByTextChange}
                          handleTabChange={this.handleTabChange}
               />
               <Button variant="primary" type="submit">Info about endpoint</Button>
               <ResultQuery result={this.state.result} />
           </Form>
       </Container>
     );
 }
}

export default EndpointQuery;
