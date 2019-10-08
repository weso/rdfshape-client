import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import DataTabs from "./DataTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "./API";
import axios from "axios";
import SelectFormat from "./SelectFormat";
import ResultDataConvert from "./results/ResultDataConvert";
import {dataParamsFromQueryParams, convertTabData} from "./Utils";
import Pace from "react-pace-progress";
import qs from "query-string";
import {mkPermalink, params2Form} from "./Permalink";

function DataConvert(props) {

    const url = API.dataConvert;
    const [result, setResult] = useState('');
    const [permalink, setPermalink] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState(null);
    const [dataTextArea, setDataTextArea] = useState("");
    const [dataFormat, setDataFormat] = useState(API.defaultDataFormat);
    const [dataUrl, setDataUrl] = useState("");
    const [dataFile, setDataFile] = useState(null);
    const [dataActiveTab, setDataActiveTab] = useState(API.defaultTab);
    const [targetDataFormat, setTargetDataFormat] = useState(API.defaultDataFormat);

    function handleTabChange(value) { setDataActiveTab(value); }
    function handleByTextChange(value) { setDataTextArea(value); }
    function handleDataFormatChange(value) {  setDataFormat(value); }
    function handleDataUrlChange(value) { setDataUrl(value); }
    function handleFileUpload(value) { setDataFile(value); }
    function handleTargetDataFormatChange(value) { setTargetDataFormat(value); }

    useEffect(() => {
        if (props.location.search) {
            const queryParams = qs.parse(props.location.search);
            let params = dataParamsFromQueryParams(queryParams);
            params['targetDataFormat']=queryParams.targetDataFormat
            const formData = params2Form(params);
            postConvert(url, formData, () => updateState(params))
        }
    },
     [props.location.search, url]
   );

    function updateState(params) {
        if (params['data']) {
            setDataActiveTab(API.byTextTab);
            setDataTextArea(params['data'])
        }
        if (params['dataFormat']) 
          setDataFormat(params['dataFormat']);
        if (params['dataUrl']) {
            setDataActiveTab(API.byUrlTab);
            setDataUrl(params['dataUrl']);
        }
        if (params['dataFile']) {
          setDataActiveTab(API.byFileTab);
          setDataFile(params['dataFile']);
        }
        if (params['targetDataFormat']) 
          setTargetDataFormat(params['targetDataFormat']);
    }

    function postConvert(url, formData, cb) {
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                setResult(data)
                if (cb) cb()
            })
            .catch(function (error) {
                setError(error);
                console.log('Error doing server request')
                console.log(error);
            });
    }

    function paramsFromStateData() {
        let params = {};
        params['activeSchemaTab'] = convertTabData(dataActiveTab);
        params['dataFormat'] = dataFormat;
        switch (dataActiveTab) {
            case API.byTextTab:
                params['data'] = dataTextArea;
                params['dataFormatTextArea'] = dataFormat;
                break;
            case API.byUrlTab:
                params['dataURL'] = dataUrl;
                params['dataFormatUrl'] = dataFormat;
                break;
            case API.byFileTab:
                params['dataFile'] = dataFile;
                params['dataFormatFile'] = dataFormat;
                break;
            default:
        }
        return params;
    }

    function handleSubmit(event) {
        let params = paramsFromStateData();
        params['targetDataFormat'] = targetDataFormat ;
        let formData = params2Form(params);
        let permalink = mkPermalink(API.dataConvertRoute, params);
        setPermalink(permalink);
        postConvert(url,formData)
        event.preventDefault();
    }

 return (
       <Container fluid={true}>
         <h1>Convert RDF data</h1>
         <Row>
             { result || loading || error ?
             <Col>
                 { loading ? <Pace color="#27ae60"/> :
                   result ?  <ResultDataConvert result={result}
                                                  permalink={permalink} /> :
                    null
                 }
             </Col>
                 : null
             }
          <Col>
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
               <SelectFormat name="Target data format"
                             selectedFormat={targetDataFormat}
                             handleFormatChange={handleTargetDataFormatChange}
                             urlFormats={API.dataFormats}
               />
               <Button variant="primary" type="submit">Convert data</Button>
           </Form>
          </Col>
         </Row>
       </Container>
 );
}

export default DataConvert;
