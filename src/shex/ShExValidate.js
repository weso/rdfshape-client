import React, {useState, useEffect, Fragment} from 'react';
import Container from 'react-bootstrap/Container';
import DataTabs from "../data/DataTabs"
import ShExTabs from "./ShExTabs"
import ShapeMapTabs from "../shapeMap/ShapeMapTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "../API";
import axios from "axios";
import ResultValidate from "../results/ResultValidate";
import {
    dataParamsFromQueryParams,
    shExParamsFromQueryParams,
    shapeMapParamsFromQueryParams,
    paramsFromStateShapeMap,
    InitialShapeMap,
    updateStateShapeMap
} from "../Utils";
import {mkPermalink, params2Form, Permalink} from "../Permalink";
import Pace from "react-pace-progress";
import qs from "query-string";
import EndpointInput from "../endpoint/EndpointInput";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ShExForm from "../ShExForm";
import Code from "../components/Code";
import Alert from "react-bootstrap/Alert";
import {InitialShEx, paramsFromStateShEx, updateStateShEx} from "./ShEx";
import {InitialData, paramsFromStateData, updateStateData} from "../data/Data";

const url = API.schemaValidate;

function ShExValidate(props) {
    const [result, setResult] = useState('');
    const [permalink, setPermalink] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [data, setData] = useState(InitialData);
    const [shex, setShEx] = useState(InitialShEx);
    const [shapeMap, setShapeMap] = useState(InitialShapeMap);
    const [yashe, setYashe] = useState(null);

    const [endpoint, setEndpoint] = useState('');

    function handleDataTabChange(value) {
        setData({...data, dataActiveTab: value});
    }

    function handleDataFormatChange(value) {
        setData({...data, dataFormat: value});
    }

    function handleDataByTextChange(value) {
        setData({...data, dataTextArea: value});
    }

    function handleDataUrlChange(value) {
        setData({...data, dataUrl: value});
    }

    function handleDataFileUpload(value) {
        setData({...data, dataFile: value});
    }

    function handleShExTabChange(value) {
        setShEx({...shex, activeTab: value});
    }

    function handleShExFormatChange(value) {
        setShEx({...shex, format: value});
    }

    function handleShExByTextChange(value) {
        setShEx({...shex, textArea: value});
    }

    function handleShExUrlChange(value) {
        setShEx({...shex, url: value});
    }

    function handleShExFileUpload(value) {
        setShEx({...shex, file: value});
    }

    function handleShapeMapTabChange(value) {
        setShapeMap({...shapeMap, shapeMapActiveTab: value});
    }

    function handleShapeMapFormatChange(value) {
        setShapeMap({...shapeMap, shapeMapFormat: value});
    }

    function handleShapeMapByTextChange(value) {
        setShapeMap({...shapeMap, shapeMapTextArea: value});
    }

    function handleShapeMapUrlChange(value) {
        setShapeMap({...shapeMap, shapeMapUrl: value});
    }

    function handleShapeMapFileUpload(value) {
        setShapeMap({...shapeMap, shapeMapFile: value});
    }

    function handleEndpointChange(value) {
        setEndpoint(value);
    }

    useEffect(() => {
            if (props.location.search) {
                const queryParams = qs.parse(props.location.search);
                console.log("Parameters: " + JSON.stringify(queryParams));
                let paramsData = dataParamsFromQueryParams(queryParams);
                let paramsShEx = shExParamsFromQueryParams(queryParams);
                let paramsShapeMap = shapeMapParamsFromQueryParams(queryParams);
                let paramsEndpoint = {};
                if (queryParams.endpoint) paramsEndpoint["endpoint"] = queryParams.endpoint;
                let params = {...paramsData, ...paramsShEx, ...paramsShapeMap, ...paramsEndpoint};
                const formData = params2Form(params);
                postValidate(url, formData, () => updateStateValidate(params))
            }
        },
        [props.location.search]
    );

    function updateStateValidate(params) {
        console.log(`UpdateState after validate: Params:\n${JSON.stringify(params)}`)
        updateStateData(params);
        updateStateShEx(params);
        updateStateShapeMap(params)
    }

    function handleSubmit(event) {
        console.log(`Handling submit...`);
        let paramsData = paramsFromStateData(data);
        console.log(`ShExValidate paramsData...${JSON.stringify(paramsData)}`);
        let paramsShEx = paramsFromStateShEx(shex);
        console.log(`ShExValidate paramsShEx...${JSON.stringify(paramsShEx)}`);
        let paramsShapeMap = paramsFromStateShapeMap(shapeMap);
        console.log(`ShExValidate paramsShapeMap...${JSON.stringify(paramsShapeMap)}`);

        let paramsEndpoint = {};
        if (endpoint !== '') {
            paramsEndpoint['endpoint'] = endpoint;
        }
        let params = {...paramsData, ...paramsEndpoint, ...paramsShEx, ...paramsShapeMap};
        params['schemaEngine'] = 'ShEx';
        params['triggerMode'] = 'shapeMap';
        console.log(`ShExValidate. Post params = ${JSON.stringify(params)}`);
        let permalink = mkPermalink(API.shExValidateRoute, params);
        setLoading(true);
        setPermalink(permalink);
        let formData = params2Form(params);
        postValidate(url, formData);
        event.preventDefault();
    }

    function processResult(data) {
        setResult(data);
    }

    function postValidate(url, formData, cb) {
        axios.post(url, formData).then(response => response.data)
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
            {loading || result || permalink || error ?
                <Fragment>
                    <Row>
                        <Col>
                            {loading ? <Pace color="#27ae60"/> :
                                error ? <Alert variant="danger">{error}</Alert> :
                                    result ?
                                        <ResultValidate result={result}/> : null}
                            {permalink && <Permalink url={permalink}/>}
                        </Col>
                    </Row>
                </Fragment>
                : null}
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <DataTabs activeTab={data.dataActiveTab}
                                  handleTabChange={handleDataTabChange}

                                  textAreaValue={data.dataTextArea}
                                  handleByTextChange={handleDataByTextChange}

                                  dataUrl={data.dataUrl}
                                  handleDataUrlChange={handleDataUrlChange}

                                  handleFileUpload={handleDataFileUpload}

                                  dataFormat={data.dataFormat}
                                  handleDataFormatChange={handleDataFormatChange}
                                  fromParams={data.fromParamsData}
                                  resetFromParams={() => setData({...data, fromParamsData: false})}
                        />
                        <EndpointInput value={endpoint}
                                       handleOnChange={handleEndpointChange}/>
                    </Col>
                    <Col>
                        <ShExTabs activeTab={shex.activeTab}
                                  handleTabChange={handleShExTabChange}

                                  textAreaValue={shex.textArea}
                                  handleByTextChange={handleShExByTextChange}

                                  shExUrl={shex.url}
                                  handleShExUrlChange={handleShExUrlChange}

                                  handleFileUpload={handleShExFileUpload}

                                  selectedFormat={shex.format}
                                  handleShExFormatChange={handleShExFormatChange}
                                  setCodeMirror={(cm) => {
                                      setYashe(cm);
                                  }}
                                  fromParams={shex.fromParams}
                                  resetFromParams={() => setShEx({...shex, fromParams: false})}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ShapeMapTabs activeTab={shapeMap.shapeMapActiveTab}
                                      handleTabChange={handleShapeMapTabChange}

                                      textAreaValue={shapeMap.shapeMapTextArea}
                                      handleByTextChange={handleShapeMapByTextChange}

                                      urlValue={shapeMap.shapeMapUrl}
                                      handleUrlChange={handleShapeMapUrlChange}

                                      handleFileUpload={handleShapeMapFileUpload}

                                      selectedFormat={shapeMap.shapeMapFormat}
                                      handleFormatChange={handleShapeMapFormatChange}

                                      fromParams={shapeMap.fromParamsShapeMap}
                                      resetFromParams={() => setShapeMap({...shapeMap, fromParamsShapeMap: false})}
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
