import React, {useState, useEffect, Fragment} from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import API from "../API";
import axios from 'axios';
import Form from "react-bootstrap/Form";
import DataTabs from "./DataTabs";
import ResultDataInfo from "../results/ResultDataInfo";
import qs from 'query-string';
import { mkPermalink, params2Form, Permalink} from "../Permalink";
import {dataParamsFromQueryParams, InitialData, paramsFromStateData, updateStateData} from "../Utils";
import Col from "react-bootstrap/Col";
import Pace from "react-pace-progress";
import Row from "react-bootstrap/Row";

function ShapeMapInfo(props) {

    const [shapeMap, setShapeMap] = useState(InitialShapeMap);
    const [result,setResult] = useState(null);
    const [error,setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [permalink, setPermalink] = useState(null);

    function handleDataTabChange(value) { setData({...data, dataActiveTab: value}); }
    function handleDataFormatChange(value) {  setData({...data, dataFormat: value}); }
    function handleDataByTextChange(value) { setData({...data, dataTextArea: value}); }
    function handleDataUrlChange(value) { setData( {...data, dataUrl: value}); }
    function handleDataFileUpload(value) { setData({...data, dataFile: value }); }

    useEffect(() => {
            if (props.location.search) {
                const queryParams = qs.parse(props.location.search);
                let dataParams = dataParamsFromQueryParams(queryParams);
                // const infoUrl = API.dataInfo + "?" + qs.stringify(dataParams);
                postDataInfo(API.dataInfo, params2Form(dataParams), () => setData(updateStateData(dataParams,data)));
            }},
        [props.location.search]
    );

    function handleSubmit(event) {
        event.preventDefault();
        let params = paramsFromStateData(data);
        let formData = params2Form(params);
        let permalink = mkPermalink(API.dataInfoRoute, params);
        console.log("Permalink created: " + JSON.stringify(permalink));
        setLoading(true);
        setPermalink(permalink);
        postDataInfo(API.dataInfo, formData);
    }

    function postDataInfo(url,formData,cb) {
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
                <h1>RDF Data info</h1>
            </Row>
            <Row>
                { loading || result || permalink ?
                    <Fragment>
                        <Col>
                            {loading ? <Pace color="#27ae60"/> :
                                error? <Alert variant='danger'>{error}</Alert> :
                                    result ? <ResultDataInfo result={result}
                                                             fromParams={data.fromParamsData}
                                                             resetFromParams={() => setData({ ...data, fromParamsData: false})}
                                    /> : null
                            }
                            { permalink? <Permalink url={permalink} />: null }
                        </Col>
                    </Fragment>
                    : null
                }

                <Col>
                    <Form onSubmit={handleSubmit}>
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
                                  resetFromParams={() => setData({...data, fromParamsData: false}) }
                        />
                        <Button variant="primary" type="submit">Info about data</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default DataInfo;
