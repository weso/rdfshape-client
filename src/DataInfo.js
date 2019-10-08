import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import API from "./API";
import axios from 'axios';
import Form from "react-bootstrap/Form";
import DataTabs from "./DataTabs";
import ResultDataInfo from "./results/ResultDataInfo";
import qs from 'query-string';
import {mkPermalink, params2Form, Permalink} from "./Permalink";
import { dataParamsFromQueryParams, convertTabData} from "./Utils";

function DataInfo(props) {

    const [dataTextArea, setDataTextArea] = useState('');
    const [result,setResult] = useState(null);
    const [error,setError] = useState(null);
    const [dataFormat, setDataFormat] = useState('TURTLE');
    const [dataUrl, setDataUrl] = useState('');
    const [dataFile, setDataFile] = useState(null);
    const [dataActiveTab, setDataActiveTab] = useState('byText');
    const [permalink, setPermalink] = useState(null);

    function handleDataFormatChange(value) { setDataFormat(value); }
    function handleTabChange(value) { setDataActiveTab(value); }
    function handleByTextChange(value) { setDataTextArea(value);  }
    function handleDataUrlChange(value) { setDataUrl(value); }
    function handleFileUpload(value) { setDataFile(value); }

    useEffect(() => {
        if (props.location.search) {
            let dataParams = dataParamsFromQueryParams(props.location.search);
            const infoUrl = API.dataInfo + "?" + qs.stringify(dataParams);
            axios.get(infoUrl).then (response => response.data)
                .then((data) => {
                    setResult(data);
                    if (dataParams.data) setDataTextArea(dataParams.data);
                    if (dataParams.dataFormat) setDataFormat(dataParams.dataFormat);
                    if (dataParams.dataUrl) setDataUrl(dataParams.dataUrl);
                })
                .catch(function (error) {
                    setError("Error calling server at " + infoUrl + ": " + error);
                });
            }
        },
        [props.location.search]
    );

    function handleSubmit(event) {
        const infoUrl = API.dataInfo;
        console.log("Try to prepare request to " + infoUrl);
        let params = {};
        params['activeTab'] = convertTabData(dataActiveTab);
        params['dataFormat'] = dataFormat;
        switch (dataActiveTab) {
            case API.byTextTab:
                params['data'] = dataTextArea;
                params['dataFormatTextArea']=dataFormat;
                break;
            case API.byUrlTab:
                params['dataURL'] = dataUrl;
                params['dataFormatUrl']=dataFormat;
                break;
            case API.byFileTab:
                params['dataFile'] = dataFile;
                params['dataFormatFile']=dataFormat;
                break;
            default:
        }
        let formData = params2Form(params);
        let permalink = mkPermalink(API.dataInfoRoute, params);
        console.log("Permalink created: " + JSON.stringify(permalink));
        axios.post(infoUrl,formData).then (response => response.data)
            .then((data) => {
                setResult(data);
                setPermalink(permalink);
            })
            .catch(function (error) {
                setError({ error: "Error calling server at " + infoUrl + ": " + error});
        });
        event.preventDefault();
    }

    return (
       <Container fluid={true}>
         <h1>RDF Data info</h1>
           { result && <ResultDataInfo result={result} permalink={permalink} /> }
           { error && <Alert variant='danger'>{error}</Alert> }
           <Permalink url={props.permalink} />
         <Form onSubmit={handleSubmit}>
             <DataTabs activeTab={dataActiveTab}
                       handleTabChange={handleTabChange}

                       textAreaValue={dataTextArea}
                       handleByTextChange={handleByTextChange}

                       dataUrl={dataUrl}
                       handleDataUrlChange={handleDataUrlChange}

                       handleFileUpload={handleFileUpload}

                       dataFormat={dataFormat}
                       handleDataFormatChange={handleDataFormatChange}
             />
         <Button variant="primary" type="submit">Info about data</Button>
         </Form>
       </Container>
     );
}

export default DataInfo;
