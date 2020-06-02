import React, {useState, useEffect, Fragment} from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import API from "../API";
import axios from 'axios';
import Form from "react-bootstrap/Form";
// import DataTabs from "./DataTabs";
import ResultDataInfo from "../results/ResultDataInfo";
import qs from 'query-string';
import { mkPermalink, params2Form, Permalink} from "../Permalink";
import {dataParamsFromQueryParams} from "../utils/Utils";
import Col from "react-bootstrap/Col";
import Pace from "react-pace-progress";
import Row from "react-bootstrap/Row";
import {InitialData, paramsFromStateData, updateStateData, mkDataTabs} from "./Data";

function DataInfo(props) {

    const [data, setData] = useState(InitialData);
    const [result,setResult] = useState(null);
    const [error,setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [permalink, setPermalink] = useState(null);

    useEffect(() => {
        if (props.location.search) {
            const queryParams = qs.parse(props.location.search);
            let dataParams = dataParamsFromQueryParams(queryParams);
            // const infoUrl = API.dataInfo + "?" + qs.stringify(dataParams);
            postDataInfo(API.dataInfo, params2Form(dataParams), () => {
                const newData = updateStateData(dataParams,data) || data ;
                setData(newData);
            });
        }},
        [props.location.search]
    );

    async function handleSubmit(event) {
        event.preventDefault();
        let params = paramsFromStateData(data);
        let formData = params2Form(params);
        console.log("Permalink created: " + JSON.stringify(permalink));
        setLoading(true);
        setPermalink(await mkPermalink(API.dataInfoRoute, params));
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
                                             fromParams={data.fromParams}
                                             resetFromParams={() => setData({ ...data, fromParams: false})}
                    /> : null
                   }
                   { permalink? <Permalink url={permalink} />: null }
                   </Col>
                   </Fragment>
             : null
           }

         <Col>
         <Form onSubmit={handleSubmit}>
             { mkDataTabs(data,setData) }
         <Button id="submit" variant="primary" type="submit">Info about data</Button>
         </Form>
       </Col>
       </Row>
       </Container>
     );
}

export default DataInfo;
