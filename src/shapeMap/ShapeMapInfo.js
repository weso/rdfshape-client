import React, {useState, useEffect, Fragment} from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import API from "../API";
import axios from 'axios';
import Form from "react-bootstrap/Form";
import ShapeMapTabs from "./ShapeMapTabs";
import ResultShapeMapInfo from "../results/ResultShapeMapInfo";
import qs from 'query-string';
import { mkPermalink, params2Form, Permalink} from "../Permalink";
import {shapeMapParamsFromQueryParams, InitialShapeMap, paramsFromStateData, updateStateData} from "../Utils";
import Col from "react-bootstrap/Col";
import Pace from "react-pace-progress";
import Row from "react-bootstrap/Row";

function ShapeMapInfo(props) {

    const [shapeMap, setShapeMap] = useState(InitialShapeMap);
    const [result,setResult] = useState(null);
    const [error,setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [permalink, setPermalink] = useState(null);

    function handleShapeMapTabChange(value) { setShapeMap({...shapeMap, shapeMapActiveTab: value}); }
    function handleShapeMapFormatChange(value) {  setShapeMap({...shapeMap, shapeMapFormat: value}); }
    function handleShapeMapByTextChange(value) { setShapeMap({...shapeMap, shapeMapTextArea: value}); }
    function handleShapeMapUrlChange(value) { setShapeMap( {...shapeMap, shapeMapUrl: value}); }
    function handleShapeMapFileUpload(value) { setShapeMap({...shapeMap, shapeMapFile: value }); }

    useEffect(() => {
            if (props.location.search) {
                const queryParams = qs.parse(props.location.search);
                let shapeMapParams = shapeMapParamsFromQueryParams(queryParams);
                postShapeMapInfo(API.shapeMapInfo, params2Form(shapeMapParams), () => setShapeMap(updateStateShapeMap(shapeMapParams,shapeMap)));
            }},
        [props.location.search]
    );

    function handleSubmit(event) {
        event.preventDefault();
        let params = paramsFromStateShapeMap(shapeMap);
        let formData = params2Form(params);
        let permalink = mkPermalink(API.shapeMapInfoRoute, params);
        console.log("Permalink created: " + JSON.stringify(permalink));
        setLoading(true);
        setPermalink(permalink);
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
                                                             resetFromParams={() => setData({ ...shapeMap, fromParamsShapeMap: false})}
                                    /> : null
                            }
                            { permalink? <Permalink url={permalink} />: null }
                        </Col>
                    </Fragment>
                    : null
                }

                <Col>
                    <Form onSubmit={handleSubmit}>
                        <ShapeMapTabs activeTab={shapeMap.shapeMapActiveTab}
                                  handleTabChange={handleShapeMapTabChange}

                                  textAreaValue={shapeMap.shapeMapTextArea}
                                  handleByTextChange={handleShapeMapByTextChange}

                                  dataUrl={shapeMap.shapeMapUrl}
                                  handleDataUrlChange={handleShapeMapUrlChange}

                                  handleFileUpload={handleShapeMapFileUpload}

                                  dataFormat={shapeMap.shapeMapFormat}
                                  handleDataFormatChange={handleShapeMapFormatChange}
                                  fromParams={shapeMap.fromParamsShapeMap}
                                  resetFromParams={() => setShapeMap({...shapeMap, fromParamsShapeMap: false}) }
                        />
                        <Button variant="primary" type="submit">Info about shape map</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default ShapeMapInfo;
