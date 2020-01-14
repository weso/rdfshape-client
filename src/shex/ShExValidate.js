import React, {useState, useEffect, Fragment} from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "../API";
import axios from "axios";
import ResultValidate from "../results/ResultValidate";
import {
    dataParamsFromQueryParams
} from "../utils/Utils";
import {mkPermalink, params2Form, Permalink} from "../Permalink";
import Pace from "react-pace-progress";
import qs from "query-string";
import EndpointInput from "../endpoint/EndpointInput";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import {InitialShEx, mkShExTabs, paramsFromStateShEx, shExParamsFromQueryParams, updateStateShEx} from "./ShEx";
import {InitialData, mkDataTabs, paramsFromStateData, updateStateData} from "../data/Data";
import {
    InitialShapeMap,
    mkShapeMapTabs,
    paramsFromStateShapeMap,
    shapeMapParamsFromQueryParams,
    updateStateShapeMap
} from "../shapeMap/ShapeMap";

const url = API.schemaValidate;

function ShExValidate(props) {

    const [result, setResult] = useState('');
    const [permalink, setPermalink] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [data, setData] = useState(InitialData);
    const [shex, setShEx] = useState(InitialShEx);
    const [shapeMap, setShapeMap] = useState(InitialShapeMap);
    const [withEndpoint, setWithEndpoint] = useState(false);

    const [endpoint, setEndpoint] = useState('');



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
                console.log(`Params: ${JSON.stringify(params)}`);
                const formData = params2Form(params);
                postValidate(url, formData, () => updateStateValidate(params))
            }
        },
        [
            props.location.search,
//            data.codeMirror,
//            shex.codeMirror,
//            shapeMap.codeMirror
        ]
    );

    function updateStateValidate(params) {
        const newData = updateStateData(params,data) || data ;
        setData(newData);

        const newShEx = updateStateShEx(params,shex) || shex;
        console.log(`updateStateValidate: newShEx: ${JSON.stringify(newShEx)}`);
        setShEx(newShEx);

        const newShapeMap = updateStateShapeMap(params,shapeMap) || shapeMap;
        console.log(`updateStateValidate: newShapeMap: ${JSON.stringify(newShapeMap)}`);
        setShapeMap(newShapeMap);
    }

    function handleSubmit(event) {
        let paramsData = paramsFromStateData(data);
        let paramsShEx = paramsFromStateShEx(shex);
        let paramsShapeMap = paramsFromStateShapeMap(shapeMap);

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
                : null
            }
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        { mkDataTabs(data, setData)}
                        <Button variant="primary" onClick={() => setWithEndpoint(!withEndpoint)}>{withEndpoint? "Remove":"Add" } endpoint</Button>
                        { withEndpoint?
                            <EndpointInput value={endpoint}
                                           handleOnChange={handleEndpointChange}/>
                        : null
                        }
                    </Col>
                    <Col>
                        { mkShExTabs(shex,setShEx)}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        { mkShapeMapTabs(shapeMap,setShapeMap) }
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
