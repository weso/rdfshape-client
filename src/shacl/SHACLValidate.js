import React, {useEffect, useState, Fragment} from 'react';
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {InitialData, mkDataTabs, paramsFromStateData, updateStateData} from "../data/Data";
import qs from "query-string";
import {dataParamsFromQueryParams} from "../utils/Utils";
import {mkPermalink, params2Form, Permalink} from "../Permalink";
import {InitialShacl, mkShaclTabs, paramsFromStateShacl, shaclParamsFromQueryParams, updateStateShacl} from "./SHACL";
import API from "../API";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Pace from "react-pace-progress";
import Alert from "react-bootstrap/Alert";
import ResultValidate from "../results/ResultValidate";
import EndpointInput from "../endpoint/EndpointInput";

const url = API.schemaValidate;

function SHACLValidate(props) {
    const [result, setResult] = useState('');
    const [permalink, setPermalink] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [shacl, setShacl] = useState(InitialShacl);
    const [data, setData] = useState(InitialData);
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
                let paramsShacl = shaclParamsFromQueryParams(queryParams);
                let paramsEndpoint = {};
                if (queryParams.endpoint) paramsEndpoint["endpoint"] = queryParams.endpoint;
                let params = {...paramsData, ...paramsShacl, ...paramsEndpoint};
                if (queryParams.triggerMode) params["triggerMode"] = queryParams.triggerMode;
                if (queryParams.schemaEngine) params["schemaEngine"] = queryParams.schemaEngine;
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

        const newShacl = updateStateShacl(params,shacl) || shacl;
        console.log(`updateStateValidate: newShacl: ${JSON.stringify(newShacl)}`);
        setShacl(newShacl);

        if (params['endpoint']) { setEndpoint(params['endpoint']) }
    }


    async function handleSubmit(event) {
        event.preventDefault();
        const paramsShacl = paramsFromStateShacl(shacl);
        const paramsData = paramsFromStateData(data);
        let paramsEndpoint = {};
        if (endpoint !== '') {
            paramsEndpoint['endpoint'] = endpoint;
        }
        let params = {...paramsData, ...paramsEndpoint, ...paramsShacl};
        params['schemaEngine'] = 'Shaclex';
        params['triggerMode'] = 'targetDecls';
        console.log(`ShExValidate. Post params = ${JSON.stringify(params)}`);
        setLoading(true);
        setPermalink(await mkPermalink(API.shaclValidateRoute, params));
        let formData = params2Form(params);
        postValidate(url, formData);
        window.scrollTo(0, 0)
    }

    function processResult(data) {  setResult(data);  }

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
        <Container>
            <h1>Validate RDF data with SHACL</h1>
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
                        <Button variant="secondary" onClick={() => setWithEndpoint(!withEndpoint)}>{withEndpoint? "Remove":"Add" } endpoint</Button>
                        { withEndpoint?
                            <EndpointInput value={endpoint}
                                           handleOnChange={handleEndpointChange}/>
                            : null
                        }
                    </Col>
                    <Col>
                        { mkShaclTabs(shacl,setShacl, "Shapes graph (SHACL)")}
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

export default SHACLValidate;
