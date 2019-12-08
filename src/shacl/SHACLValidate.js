import React, {useReducer, useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import DataTabs from "../data/DataTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { InitialData, paramsFromStateData} from "../data/Data";

function SHACLValidate(props) {
    const [shacl, setShacl] = useState(InitialData);
    const [data, setData] = useState(InitialData);

    function handleSubmit(event) {
        event.preventDefault();
        const paramsShacl = paramsFromStateData(shacl)
        const paramsData = paramsFromStateData(data)
    }

    function handleShaclTabChange(value) { setShacl({...shacl, dataActiveTab: value}); }
    function handleShaclFormatChange(value) {  setShacl({...shacl, dataFormat: value}); }
    function handleShaclByTextChange(value) { setShacl({...shacl, dataTextArea: value}); }
    function handleShaclUrlChange(value) { setShacl( {...shacl, dataUrl: value}); }
    function handleShaclFileUpload(value) { setShacl({...shacl, dataFile: value }); }

    function handleDataTabChange(value) { setData({...data, dataActiveTab: value}); }
    function handleDataFormatChange(value) {  setData({...data, dataFormat: value}); }
    function handleDataByTextChange(value) { setData({...data, dataTextArea: value}); }
    function handleDataUrlChange(value) { setData( {...data, dataUrl: value}); }
    function handleDataFileUpload(value) { setData({...data, dataFile: value }); }

    return (
        <Container>
            <h1>Validate RDF data with SHACL</h1>
            <Form onSubmit={handleSubmit}>
                <DataTabs name="RDF data"
                          activeTab={data.dataActiveTab}
                          handleTabChange={handleDataTabChange}

                          textAreaValue={data.dataTextArea}
                          handleByTextChange={handleDataByTextChange}

                          dataUrl={data.dataUrl}
                          handleDataUrlChange={handleDataUrlChange}

                          handleFileUpload={handleDataFileUpload}

                          dataFormat={data.dataFormat}
                          handleDataFormatChange={handleDataFormatChange}
                          fromParams={data.fromParamsData}
                          resetFromParams={() => setData({...data, fromParamsData: false}) }
                />
                <DataTabs
                    name="Shapes graph (SHACL)"
                    activeTab={shacl.dataActiveTab}
                    handleTabChange={handleShaclTabChange}

                    textAreaValue={shacl.dataTextArea}
                    handleByTextChange={handleShaclByTextChange}

                    dataUrl={shacl.dataUrl}
                    handleUrlChange={handleShaclUrlChange}

                    handleFileUpload={handleShaclFileUpload}

                    dataFormat={shacl.dataFormat}
                    handleDataFormatChange={handleShaclFormatChange}
                    fromParams={shacl.fromParamsData}
                    resetFromParams={() => setData({...shacl, fromParamsData: false}) }
                />
                <Button variant="primary">Validate</Button>
            </Form>
        </Container>
    );
}

export default SHACLValidate;
