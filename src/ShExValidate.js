import React, {useState, useEffect, Fragment} from 'react';
import Container from 'react-bootstrap/Container';
import DataTabs from "./DataTabs"
import ShExTabs from "./ShExTabs"
import ShapeMapTabs from "./ShapeMapTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "./API";
import axios from "axios";
import ResultValidate from "./results/ResultValidate";
import {
    dataParamsFromQueryParams,
    shExParamsFromQueryParams,
    shapeMapParamsFromQueryParams,
    paramsFromStateData,
    paramsFromStateShapeMap,
    paramsFromStateShEx, convertTabData, convertTabSchema, mkMode
} from "./Utils";
import {mkPermalink, params2Form, Permalink} from "./Permalink";
import Pace from "react-pace-progress";
import qs from "query-string";
import EndpointInput from "./EndpointInput";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ShExForm from "./ShExForm";
import Code from "./Code";

const url = API.schemaValidate ;

function ShExValidate(props) {
    const [result, setResult] = useState('');
    const [permalink, setPermalink] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState(null);

    const [shExTextArea, setShExTextArea] = useState("");
    const [shExFormat, setShExFormat] = useState(API.defaultShExFormat);
    const [shExUrl, setShExUrl] = useState("");
    const [shExFile, setShExFile] = useState(null);
    const [shExActiveTab, setShExActiveTab] = useState(API.defaultTab);
    const [dataTextArea, setDataTextArea] = useState('');
    const [dataFormat, setDataFormat] = useState('TURTLE');
    const [dataUrl, setDataUrl] = useState('');
    const [dataFile, setDataFile] = useState(null);
    const [dataActiveTab, setDataActiveTab] = useState('byText');
    const [yashe, setYashe] = useState(null);
    const [shapeMapTextArea, setShapeMapTextArea] = useState('');
    const [shapeMapFormat, setShapeMapFormat] = useState('Compact');
    const [shapeMapUrl, setShapeMapUrl] = useState('');
    const [shapeMapFile, setShapeMapFile] = useState(null);
    const [shapeMapActiveTab, setShapeMapActiveTab] = useState('byText');
    const [fromParamsShEx, setFromParamsShEx] = useState(false);
    const [fromParamsData, setFromParamsData] = useState(false);
    const [fromParamsShapeMap, setFromParamsShapeMap] = useState(false);

    const [endpoint, setEndpoint] = useState('');

    function handleDataTabChange(value) { setDataActiveTab(value); }
    function handleDataFormatChange(value) {  setDataFormat(value); }
    function handleDataByTextChange(value) { setDataTextArea(value); }
    function handleDataUrlChange(value) { setDataUrl(value); }
    function handleDataFileUpload(value) { setDataFile(value); }

    function handleShExTabChange(value) { setShExActiveTab(value); }
    function handleShExFormatChange(value) {  setShExFormat(value); }
    function handleShExByTextChange(value, y) {
        console.log(`handlingShExByTexthange`)
        setShExTextArea(value);
        if (yashe) { yashe.refresh(); }
    }
    function handleShExUrlChange(value) { setShExUrl(value); }
    function handleShExFileUpload(value) { setShExFile(value); }

    function handleShapeMapTabChange(value) { setShapeMapActiveTab(value); }
    function handleShapeMapFormatChange(value) {  setShapeMapFormat(value); }
    function handleShapeMapByTextChange(value) { setShapeMapTextArea(value); }
    function handleShapeMapUrlChange(value) { setShapeMapUrl(value); }
    function handleShapeMapFileUpload(value) { setShapeMapFile(value); }

    function handleEndpointChange(value) { setEndpoint(value); }

    useEffect( () => {
        if (props.location.search) {
            const queryParams = qs.parse(props.location.search);
            console.log("Parameters: " + JSON.stringify(queryParams));
            let paramsData = dataParamsFromQueryParams(queryParams);
            let paramsShEx = shExParamsFromQueryParams(queryParams);
            let paramsShapeMap = shapeMapParamsFromQueryParams(queryParams);
            let paramsEndpoint = {};
            if (queryParams.endpoint) paramsEndpoint["endpoint"] = queryParams.endpoint ;
            let params = {...paramsData,...paramsShEx,...paramsShapeMap,...paramsEndpoint};
            const formData = params2Form(params);
            postValidate(url, formData, () => updateStateValidate(params))
        }
    },
      [props.location.search]
    );

    function updateStateValidate(params) {
      updateStateData(params);
      updateStateShEx(params);
      updateStateShapeMap(params)
    }

    function updateStateData(params) {
        if (params['data']) {
            setDataActiveTab(API.byTextTab);
            setDataTextArea(params['data']);
            setFromParamsData(true);
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
    }

    function updateStateShEx(params) {
        console.log(`UpdateStateShEx: ${JSON.stringify(params)}`);
        if (params['schemaFormat']) setShExFormat(params['schemaFormat']);
        if (params['schema']) {
            setShExActiveTab(API.byTextTab);
            const schema = params['schema'];
            setShExTextArea(schema);
            setFromParamsShEx(true);
            if (params['schemaFormatTextArea']) setShExFormat(params['schemaFormatTextArea']);
        }
        if (params['schemaURL']) {
            setShExActiveTab(API.byUrlTab);
            setShExUrl(params['schemaURL'])
            if (params['schemaFormatUrl']) setShExFormat(params['schemaFormatUrl']);
        }
        if (params['shExFile']) {
            setShExActiveTab(API.byFileTab);
            setShExFile(params['shExFile'])
            if (params['schemaFormatFile']) setShExFormat(params['schemaFormatFile']);
        }
    }

    function updateStateShapeMap(params) {
        if (params['shapeMap']) {
            setShapeMapActiveTab(API.byTextTab);
            setShapeMapTextArea(params['shapeMap'])
            setFromParamsShapeMap(true);
        }
        if (params['shapeMapFormat']) setShapeMapFormat(params['shapeMapFormat']);
        if (params['shapeMapUrl']) {
            setShapeMapActiveTab(API.byUrlTab);
            setShapeMapUrl(params['shapeMapUrl'])
        }
        if (params['shapeMapFile']) {
            setShapeMapActiveTab(API.byFileTab);
            setShapeMapFile(params['shapeMapFile'])
        }
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

    function paramsFromStateShEx() {
        let params = {};
        params['activeSchemaTab'] = convertTabSchema(shExActiveTab);
        console.log(`paramsFromStateShEx: activeSchemaTab: ${shExActiveTab}: ${params['activeSchemaTab']}`);
        params['schemaEmbedded'] = false;
        params['schemaFormat'] = shExFormat;
        switch (shExActiveTab) {
            case API.byTextTab:
                params['schema'] = shExTextArea;
                params['schemaFormatTextArea'] = shExFormat;
                break;
            case API.byUrlTab:
                params['schemaURL'] = shExUrl;
                params['schemaFormatUrl'] = shExFormat;
                break;
            case API.byFileTab:
                params['schemaFile'] = shExFile;
                params['schemaFormatFile'] = shExFormat;
                break;
            default:
        }
        return params;
    }

    function paramsFromStateShapeMap() {
        let params = {};
        params['activeShapeMapTab'] = convertTabSchema(shapeMapActiveTab);
        console.log(`paramsFromStateShEx: activeSchemaTab: ${shapeMapActiveTab}: ${params['activeShapeMapTab']}`);
        params['shapeMapFormat'] = shapeMapFormat;
        switch (shapeMapActiveTab) {
            case API.byTextTab:
                params['shapeMap'] = shapeMapTextArea;
                params['shapeMapFormatTextArea'] = shapeMapFormat;
                break;
            case API.byUrlTab:
                params['shapeMapURL'] = shapeMapUrl;
                params['shapeMapFormatUrl'] = shapeMapFormat;
                break;
            case API.byFileTab:
                params['shapeMapFile'] = shapeMapFile;
                params['shapeMapFormatFile'] = shapeMapFormat;
                break;
            default:
        }
        return params;
    }

    function handleSubmit(event) {
        let paramsData = paramsFromStateData();
        let paramsShEx = paramsFromStateShEx();
        let paramsShapeMap = paramsFromStateShapeMap();
        let paramsEndpoint = {};
        if (endpoint !== '') {
            paramsEndpoint['endpoint'] = endpoint ;
        }
        let params = {...paramsData,...paramsEndpoint,...paramsShEx,...paramsShapeMap};
        params['schemaEngine']='ShEx';
        params['triggerMode']='shapeMap';
        let formData = params2Form(params);
        let permalink = mkPermalink(API.shExValidateRoute, params);
        setLoading(true);
        setPermalink(permalink);
        postValidate(url,formData);
        event.preventDefault();
    }

    function processResult(data) {
        setResult(data);
    }

    function postValidate(url, formData, cb) {
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                setLoading(false);
                processResult(data);
                if (cb) cb()
            })
            .catch(function (error) {
                setLoading(false);
                setError(error.message);
                console.log('Error doing server request');
                console.log(error);
            });
    }


    return (
            <Container fluid={true}>
                <h1>ShEx: Validate RDF data</h1>
            { loading || result || permalink ?
            <Fragment>
            <Row>
            <Col>
            {loading ? <Pace color="#27ae60"/> :
              result ?
                <ResultValidate result={result} /> : null }
                { permalink &&  <Permalink url={permalink} /> }
            </Col>
            </Row>
{/*
                <Row>
                { dataTextArea? <Col>
                    <Code value={dataTextArea}
                          mode={mkMode(dataFormat)}
                          theme="material"
                          readonly onChange={() => null}
                          placeholder=''/>
                </Col>  : null }
                    { shExTextArea? <Col>
                        <Code value={shExTextArea}
                              mode={'shexc'} // {mkMode(shExFormat)}
                              theme="material"
                              readonly onChange={() => null
                        } placeholder=''/>
                    </Col>  : null }
                </Row>
*/}
            </Fragment>
           : null }
                <Form onSubmit={handleSubmit}>
                  <Row>
                   <Col>
                    <DataTabs activeTab={dataActiveTab}
                              handleTabChange={handleDataTabChange}

                              textAreaValue={dataTextArea}
                              handleByTextChange={handleDataByTextChange}

                              dataUrl={dataUrl}
                              handleDataUrlChange={handleDataUrlChange}

                              handleFileUpload={handleDataFileUpload}

                              dataFormat={dataFormat}
                              handleDataFormatChange={handleDataFormatChange}
                              fromParams={fromParamsData}
                              resetFromParams={() => setFromParamsData(false) }

                    />
                    <EndpointInput value={endpoint}
                                   handleOnChange={handleEndpointChange}/>
                </Col>
                <Col>
                    <ShExTabs activeTab={shExActiveTab}
                              handleTabChange={handleShExTabChange}

                              textAreaValue={shExTextArea}
                              handleByTextChange={handleShExByTextChange}

                              shExUrl={shExUrl}
                              handleShExUrlChange={handleShExUrlChange}

                              handleFileUpload={handleShExFileUpload}

                              dataFormat={shExFormat}
                              handleShExFormatChange={handleShExFormatChange}
                              setCodeMirror = { (cm) => {setYashe(cm);} }
                              fromParams={fromParamsShEx}
                              resetFromParams={() => setFromParamsShEx(false) }
                    />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                    <ShapeMapTabs activeTab={shapeMapActiveTab}
                              handleTabChange={handleShapeMapTabChange}

                              textAreaValue={shapeMapTextArea}
                              handleByTextChange={handleShapeMapByTextChange}

                              dataUrl={shapeMapUrl}
                              handleShapeMapUrlChange={handleShapeMapUrlChange}

                              handleFileUpload={handleShapeMapFileUpload}

                              dataFormat={shapeMapFormat}
                              handleShapeMapFormatChange={handleShapeMapFormatChange}
                              fromParams={fromParamsShapeMap}
                              resetFromParams={() => setFromParamsShapeMap(false)}
                    />
                    </Col>
                </Row>
                <Row>
                <Col>
                    <Button variant="primary" type="submit">Validate</Button>
                     </Col>
                        </Row>
                </Form>
            </Container>
    );
}

export default ShExValidate;
