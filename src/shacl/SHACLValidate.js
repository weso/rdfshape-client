import React, {useReducer, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import DataTabs from "../data/DataTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "../API";
import {initialSHACLStatus, shaclReducer, paramsFromShacl} from "./SHACL";
import {initialDataStatus, dataReducer, paramsFromData} from "../data/Data";
import Tab from "react-bootstrap/Tab";
import ShExTabs from "../shex/ShExTabs";
import Tabs from "react-bootstrap/Tabs";

function SHACLValidate(props) {
    const [shacl, dispatchShacl] = useReducer(shaclReducer, initialSHACLStatus);
    const [data, dispatchData] = useReducer(dataReducer, initialDataStatus);

    function handleSubmit(event) {
        event.preventDefault();
        const paramsShacl = paramsFromShacl(shacl)
        const paramsData = paramsFromData(data)
    }

    function handleShaclTabChange(value) {
        dispatchShacl({type: 'changeTab', value: value});
    }

    function handleShaclFormatChange(value) {
        dispatchShacl({type: 'setFormat', value: value});
    }

    function handleShaclByTextChange(value) {
        dispatchShacl({type: 'setText', value: value})
    }

    function handleShaclUrlChange(value) {
        dispatchShacl({type: 'setUrl', value: value})
    }

    function handleShaclFileUpload(value) {
        dispatchShacl({type: 'setFile', value: value})
    }

    function handleDataTabChange(value) {
        dispatchData({type: 'changeTab', value: value});
    }

    function handleDataFormatChange(value) {
        dispatchData({type: 'setFormat', value: value});
    }

    function handleDataByTextChange(value) {
        dispatchData({type: 'setText', value: value})
    }

    function handleDataUrlChange(value) {
        dispatchData({type: 'setUrl', value: value})
    }

    function handleDataFileUpload(value) {
        dispatchData({type: 'setFile', value: value})
    }

    return (
        <Container>
            <h1>Validate RDF data with SHACL</h1>
            <Form onSubmit={handleSubmit}>
                <DataTabs
                    name="RDF data"
                    activeTab={data.activeTab}
                    handleTabChange={handleDataTabChange}

                    textAreaValue={shacl.textArea}
                    handleByTextChange={handleDataByTextChange}

                    dataUrl={shacl.url}
                    handleUrlChange={handleDataUrlChange}

                    handleFileUpload={handleDataFileUpload}

                    dataFormat={shacl.format}
                    handleDataFormatChange={handleDataFormatChange}/>
                <DataTabs
                    name="Shapes graph (SHACL)"
                    activeTab={shacl.shaclActiveTab}
                    handleTabChange={handleShaclTabChange}

                    textAreaValue={shacl.shaclTextArea}
                    handleByTextChange={handleShaclByTextChange}

                    dataUrl={shacl.shaclUrl}
                    handleUrlChange={handleShaclUrlChange}

                    handleFileUpload={handleShaclFileUpload}

                    dataFormat={shacl.shaclFormat}
                    handleDataFormatChange={handleShaclFormatChange}/>
                <Button variant="primary">Validate</Button>
            </Form>
        </Container>
    );
}

export default SHACLValidate;
