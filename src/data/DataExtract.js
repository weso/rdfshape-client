import React, {useState, useEffect, Fragment} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import API from "../API";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import ResultDataExtract from "../results/ResultDataExtract";
import DataTabs from "./DataTabs";
import NodeSelector from "../shex/NodeSelector";
import {mkPermalink, params2Form, Permalink} from "../Permalink";
import {dataParamsFromQueryParams} from "../Utils"
import qs from "query-string";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Pace from "react-pace-progress";
import {InitialData, paramsFromStateData, updateStateData} from "./Data";


function DataExtract(props) {
    const [data, setData] = useState(InitialData);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);
    const [result, setResult] = useState('');
    const [permalink, setPermalink] = useState(null);
    const [nodeSelector, setNodeSelector] = useState('');

    function handleDataTabChange(value) { setData({...data, dataActiveTab: value}); }
    function handleDataFormatChange(value) {  setData({...data, dataFormat: value}); }
    function handleDataByTextChange(value) { setData({...data, dataTextArea: value}); }
    function handleDataUrlChange(value) { setData( {...data, dataUrl: value}); }
    function handleDataFileUpload(value) { setData({...data, dataFile: value }); }

    const url = API.dataExtract;

    useEffect(() => {
        if (props.location.search) {
            const queryParams = qs.parse(props.location.search);
            let params = dataParamsFromQueryParams(queryParams);
            params['nodeSelector'] = queryParams.nodeSelector;
            const formData = params2Form(params);
            postExtract(url, formData, () => {
                setData(updateStateData(params, data));
                if (params['nodeSelector']) setNodeSelector(params['targetDataFormat'])
            });
        }
     }, [props.location.search]);

    function postExtract(url, formData, cb) {
        setLoading(true);
        axios.post(url,formData)
            .then (response => response.data)
            .then((data) => {
                setLoading(false);
                setResult(data)
                if (cb) cb()
            })
            .catch(function (error) {
                setLoading(false);
                setError(`Error in request: ${url}: ${error.message}`);
            });
    }

    function handleSubmit(event) {
        event.preventDefault();
        let params = paramsFromStateData(data);
        params['nodeSelector'] = nodeSelector ;
        let formData = params2Form(params);
        setPermalink(mkPermalink(API.dataExtractRoute, params));
        postExtract(url,formData);
    }

    return (
            <Container fluid={true}>
                <h1>Extract schema from data</h1>
                <Row>
                { loading || result || permalink ?
                    <Fragment>
                        <Col>
                            { loading ? <Pace color="#27ae60"/> :
                              error? <Alert variant="danger">${error}</Alert> :
                              result ? <ResultDataExtract result={result} /> : null
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
                    <NodeSelector
                        value={nodeSelector}
                        handleChange={(value) => setNodeSelector(value)} />
                    <Button variant="primary" type="submit">Extract schema</Button>
                </Form>
                </Col>
                </Row>
            </Container>
    );
}

export default DataExtract;