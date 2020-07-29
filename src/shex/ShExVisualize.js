import React, {useState, useEffect, Fragment} from 'react';

import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "../API";
import axios from "axios";
import ResultShExVisualize from "../results/ResultShExVisualize";
import {mkPermalink, params2Form, Permalink} from "../Permalink";
import Pace from "react-pace-progress";
import qs from "query-string";
import {
    InitialShEx,
    mkShExTabs,
    paramsFromStateShEx,
    shExParamsFromQueryParams,
    updateStateShEx
} from "./ShEx";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const url = API.schemaVisualize ;

function ShExVisualize(props) {
    const [result, setResult] = useState('');
    const [permalink, setPermalink] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState(null);
    const [shex,setShex] = useState(InitialShEx);

    useEffect(() => {
        if (props.location.search) {
            const queryParams = qs.parse(props.location.search);
            let paramsShEx = shExParamsFromQueryParams(queryParams);
            let params = paramsShEx
            const formData = params2Form(params);
            postVisualize(url, formData, () => updateStateVisualize(params))
        }
    },
     [props.location.search]
   );


    function updateStateVisualize(params) {
        setShex(updateStateShEx(params,shex));
    }


    async function handleSubmit(event) {
        let params = paramsFromStateShEx(shex);
        params['schemaEngine'] = 'ShEx'
        let formData = params2Form(params);
        setError(null);
        setResult('');
        setLoading(true);
        setPermalink(await mkPermalink(API.shExVisualizeRoute, params));
        postVisualize(url, formData)
        event.preventDefault();
    }

    function processResult(data) {
        setResult(data);
    }

    function postVisualize(url, formData, cb) {
        console.log(`postVisualize: ${url}`)
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                setLoading(false);
                processResult(data);
                if (cb) cb()
            })
            .catch(function (error) {
                setLoading(false);
                setError(`Error doing POST request to ${url}: ${error}`);
                console.log('Error doing server request')
                console.log(error);
            });
    }

    return (
            <Container fluid={true}>
                <h1>ShEx: Visualize ShEx schemas</h1>

                { loading || result || permalink || error ?
                    <Fragment>
                        <Row>
                         <Col>
                        {loading ? <Pace color="#27ae60"/> :
                         error ? <Alert variant="danger">{error}</Alert> :
                         result ? <ResultShExVisualize result={result} /> :
                         null
                        }
                        { permalink &&  <Permalink url={permalink} /> }
                         </Col>
                        </Row>
                    </Fragment> :
                    null
                }
                <Form onSubmit={handleSubmit}>
                    { mkShExTabs(shex, setShex, "ShEx Input")}
                    <Button variant="primary" type="submit">Visualize</Button>
                </Form>
            </Container>
    );
}

export default ShExVisualize;
