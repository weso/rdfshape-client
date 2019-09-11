import React, {useState, useEffect} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import API from "./API";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import ResultDataExtract from "./results/ResultDataExtract";
import DataTabs from "./DataTabs";
import NodeSelector from "./NodeSelector";
import {mkPermalink, params2Form, Permalink} from "./Permalink";
import {convertTabData, dataParamsFromQueryParams} from "./Utils"
import qs from "query-string";


export default function DataExtract(props) {
    const [dataTextArea,setDataTextArea] = useState('');
    const [error,setError] = useState(null);
    const [result, setResult] = useState('');
    const [dataFormat,setDataFormat] = useState('');
    const [dataUrl, setDataUrl] = useState('');
    const [dataFile, setDataFile] = useState('');
    const [dataActiveTab, setDataActiveTab] = useState('byText');
    const [nodeSelector, setNodeSelector] = useState('');
    const [permalink, setPermalink] = useState(null);
    const url = API.dataExtract;

    useEffect(() => {
        if (props.location.search) {
            const queryParams = qs.parse(props.location.search);
            console.log("Parameters: " + JSON.stringify(queryParams));
            let params = dataParamsFromQueryParams(queryParams);
            params['nodeSelector'] = queryParams.nodeSelector;
            const formData = params2Form(params);
            postConvert(url, formData, () => updateState(params))
        }
     });

    function updateState(params) {
        if (params['data']) {
            setDataActiveTab(API.byTextTab);
            setDataTextArea(params['data'])
        }
        if (params['dataFormat']) setDataFormat(params['dataFormat']);
        if (params['dataUrl']) {
            setDataActiveTab(API.byUrlTab);
            setDataUrl(params['dataUrl'])
        }
        if (params['dataFile']) {
            setDataActiveTab(API.byFileTab);
            setDataFile(params['dataFile'])
        }
        if (params['nodeSelector']) setNodeSelector(params['targetDataFormat'])
    }

    function postConvert(url, formData, cb) {
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                setResult(data)
                if (cb) cb()
            })
            .catch(function (error) {
                console.log(`Error doing server request: ${error}`)
                setError(error);
            });
    }

    function handleSubmit(event) {
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
            params['nodeSelector'] = nodeSelector ;
            let formData = params2Form(params);
            setPermalink(mkPermalink(API.dataExtractRoute, params));
            postConvert(url,formData);
        event.preventDefault();
    }

    return (
            <Container fluid={true}>
                <h1>Extract schema from data</h1>
                { error? <Alert variant="danger">${error}</Alert>: null }
                <ResultDataExtract result={result} />
                { permalink? <Permalink url={permalink} />: null }
                <Form onSubmit={handleSubmit}>
                    <DataTabs activeTab={dataActiveTab}
                              handleTabChange={(value) => setDataActiveTab(value)}

                              textAreaValue={dataTextArea}
                              handleByTextChange={(value) => setDataTextArea(value)}

                              dataUrl={dataUrl}
                              handleDataUrlChange={(value) => setDataUrl(value)}

                              handleFileUpload={(value) => setDataFile(value)}

                              dataFormat={dataFormat}
                              handleDataFormatChange={(value) => setDataFormat(value)}
                    />
                    <NodeSelector
                        value={nodeSelector}
                        handleChange={(value) => setNodeSelector(value)} />
                    <Button variant="primary" type="submit">Extract schema</Button>
                </Form>
            </Container>
    );
}

