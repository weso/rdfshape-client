import React, {useState, useEffect, Fragment} from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import API from "../API";
import axios from 'axios';
import Form from "react-bootstrap/Form";
// import ShapeMapTabs from "./ShapeMapTabs.delete";
import ResultShapeMapInfo from "../results/ResultShapeMapInfo";
import qs from 'query-string';
import { mkPermalink, params2Form, Permalink} from "../Permalink";
import Col from "react-bootstrap/Col";
import Pace from "react-pace-progress";
import Row from "react-bootstrap/Row";
import {
    InitialShapeMap,
    mkShapeMapTabs,
    paramsFromStateShapeMap,
    shapeMapParamsFromQueryParams,
    updateStateShapeMap
} from "./ShapeMap";

function ShapeMapInfo(props) {

    const [shapeMap, setShapeMap] = useState(InitialShapeMap);
    const [result,setResult] = useState(null);
    const [error,setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [permalink, setPermalink] = useState(null);

    useEffect(() => {
            if (props.location.search) {
                const queryParams = qs.parse(props.location.search);
                let shapeMapParams = shapeMapParamsFromQueryParams(queryParams);
                postShapeMapInfo(API.shapeMapInfo, params2Form(shapeMapParams), () => {
                    const newShapeMap = updateStateShapeMap(shapeMapParams,shapeMap) || shapeMap
                    setShapeMap(newShapeMap);
                });
            }},
        [props.location.search]
    );

    async function handleSubmit(event) {
        event.preventDefault();
        let params = paramsFromStateShapeMap(shapeMap);
        let formData = params2Form(params);
        console.log("Permalink created: " + JSON.stringify(permalink));
        setLoading(true);
        setPermalink(await mkPermalink(API.shapeMapInfoRoute, params));
        postShapeMapInfo(API.shapeMapInfo, formData);
    }

    function postShapeMapInfo(url,formData,cb) {
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                setLoading(false);
                setError(null);
                setResult(data);
                if (cb) cb()
            })
            .catch(function (error) {
                setLoading(false);
                setError("Error calling server at " + url + ": " + error);
            });
    }
    return (
        <Container fluid={true}>
            <Row>
                <h1>ShapeMap info</h1>
            </Row>
            <Row>
                { loading || result || permalink ?
                    <Fragment>
                        <Col>
                            {loading ? <Pace color="#27ae60"/> :
                                error? <Alert variant='danger'>{error}</Alert> :
                                    result ? <ResultShapeMapInfo result={result}
                                                             fromParams={shapeMap.fromParamsShapeMap}
                                                             resetFromParams={() => setShapeMap({ ...shapeMap, fromParamsShapeMap: false})}
                                    /> : null
                            }
                            { permalink? <Permalink url={permalink} />: null }
                        </Col>
                    </Fragment>
                    : null
                }

                <Col>
                    <Form onSubmit={handleSubmit}>
                        { mkShapeMapTabs(shapeMap, setShapeMap) }
                        <Button variant="primary" type="submit">Info about shape map</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default ShapeMapInfo;
