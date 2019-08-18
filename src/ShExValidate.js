import React from 'react';
import Container from 'react-bootstrap/Container';
import DataTabs from "./DataTabs"
import ShExTabs from "./ShExTabs"
import ShapeMapTabs from "./ShapeMapTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "./API";
import FormData from "form-data";
import axios from "axios";
import ResultValidate from "./ResultValidate";

class ShExValidate extends React.Component {
  constructor(props) {
        super(props);
        this.state = {
            result: '',

            dataTextArea: "",
            dataFormat: "TURTLE",
            dataUrl: '',
            dataFile: '',
            dataActiveTab: "byText",

            shExTextArea: "",
            shExFormat: "ShExC",
            shExUrl: "",
            shExFile: "",
            shExActiveTab: 'byText',

            shapeMapTextArea: '',
            shapeMapFormat: "Compact",
            shapeMapUrl: "",
            shapeMapFile: "",
            shapeMapActiveTab: "byText"
        } ;

      this.changeDataTextArea = this.changeDataTextArea.bind(this);
      this.changeDataTab = this.changeDataTab.bind(this);
      this.changeDataFormat = this.changeDataFormat.bind(this);

      this.changeShExTextArea = this.changeShExTextArea.bind(this);
      this.changeShExTab = this.changeShExTab.bind(this);
      this.changeShExFormat = this.changeShExFormat.bind(this);

      this.changeShapeMapTextArea = this.changeShapeMapTextArea.bind(this);
      this.changeShapeMapTab = this.changeShapeMapTab.bind(this);
      this.changeShapeMapFormat = this.changeShapeMapFormat.bind(this);

      this.handleSubmit = this.handleSubmit.bind(this);
    }

    changeDataTextArea(value) { this.setState({dataTextArea: value}); }
    changeDataTab(value)      { this.setState({dataActiveTab: value}); }
    changeDataFormat(value)   { this.setState({dataFormat: value}); }

    changeShExTextArea(value) { this.setState({shExTextArea: value}); }
    changeShExTab(value)      { this.setState({shExActiveTab: value}); }
    changeShExFormat(value)   { this.setState({shExFormat: value}); }

    changeShapeMapTextArea(value) { this.setState({shapeMapTextArea: value}); }
    changeShapeMapTab(value)      { this.setState({shapeMapActiveTab: value}); }
    changeShapeMapFormat(value)   { this.setState({shapeMapFormat: value}); }

    handleSubmit(event) {
        const infoUrl = API.schemaValidate ;
        console.log("Try to prepare request to " + infoUrl);
        let formData = new FormData();
        formData.append('dataTextArea', this.state.dataTextArea);
        formData.append('dataFormat', this.state.dataFormat);
        formData.append('dataUrl', this.state.dataUrl);
        formData.append('dataActiveTab', this.state.dataActiveTab);

        formData.append('schemaEngine', "ShEx");
        formData.append("triggerMode", "shapeMap");
        formData.append('schema', this.state.shExTextArea);
        formData.append('schemaFormat', this.state.shExFormat);
        formData.append('schemaUrl', this.state.shExUrl);
        formData.append('schemaActiveTab', this.state.shExActiveTab);

        formData.append('shapeMap', this.state.shapeMapTextArea);
        formData.append('shapeMapFormat', this.state.shapeMapFormat);
        formData.append('shapeMapUrl', this.state.shapeMapUrl);
        formData.append('shapeMapActiveTab', this.state.shapeMapActiveTab);

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

    render() {
        return (
            <Container fluid={true}>
                <h1>ShEx: Validate RDF data</h1>
                <Form onSubmit={this.handleSubmit}>
                    <DataTabs textAreaValue={this.state.textAreaValue}
                              activeTab={this.state.activeTab}
                              dataFormat={this.state.dataFormat}
                              handleDataFormatChange={this.changeDataFormat}
                              handleTabChange={this.changeDataTab}
                              handleByTextChange={this.changeDataTextArea}
                    />
                    <ShExTabs textAreaValue={this.state.shExTextArea}
                              activeTab={this.state.shExActiveTab}
                              shExFormat={this.state.shExFormat}
                              handleShExFormatChange={this.changeShExFormat}
                              handleTabChange={this.changeShExTab}
                              handleByTextChange={this.changeShExTextArea}
                    />
                    <ShapeMapTabs
                        textAreaValue={this.props.shapeMapTextArea}
                        activeTab={this.state.shExActiveTab}
                        shapeMapFormat={this.state.shapeMapFormat}
                        handleShapeMapFormatChange={this.changeShapeMapFormat}
                        handleTabChange={this.changeShapeMapTab}
                        handleByTextChange={this.changeShapeMapTextArea}
                    />
                    <Button variant="primary" type="submit">Validate</Button>
                    <ResultValidate result={this.state.result} />
                </Form>
            </Container>
        );
    }
}

export default ShExValidate;
