import React, {Fragment, useEffect, useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import API from "../API";
import Form from "react-bootstrap/Form";
import axios from "axios";
import {
    InitialQuery,
    paramsFromStateQuery,
    mkQueryTabs,
    updateStateQuery,
    queryParamsFromQueryParams
} from "../query/Query";
import {mkPermalink, params2Form, Permalink} from "../Permalink";
import Col from "react-bootstrap/Col";
import Pace from "react-pace-progress";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import {InitialData, mkDataTabs, paramsFromStateData, updateStateData} from "./Data";
import qs from "query-string";
import {dataParamsFromQueryParams} from "../utils/Utils";
import ResultEndpointQuery from "../results/ResultEndpointQuery";


function DataQuery(props)  {
    const [data, setData] = useState(InitialData);
    const [result,setResult] = useState(null);
    const [query, setQuery] = useState(InitialQuery);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [permalink, setPermalink] = useState('');

    useEffect(() => {
            if (props.location.search) {
                const queryParams = qs.parse(props.location.search);
                let paramsData = dataParamsFromQueryParams(queryParams);
                let paramsQuery = queryParamsFromQueryParams(queryParams);
                let params = {...paramsData,...paramsQuery};
                // console.log(`dataQueryParams: ${JSON.stringify(dataQueryParams)}`);
                // const infoUrl = API.dataInfo + "?" + qs.stringify(dataParams);
                postQuery(API.dataQuery, params2Form(params), () => {
                    const newData = updateStateData(params,data) || data ;
                    setData(newData);
                    const newQuery = updateStateQuery(params,query) || query ;
                    setQuery(newQuery);
                });
            }},
        [props.location.search]
    );

    function handleSubmit(event) {
        event.preventDefault();
        const infoUrl = API.dataQuery;
        let paramsData = paramsFromStateData(data);
        console.log(`DataQuery paramsData: ${JSON.stringify(paramsData)}`);
        let paramsQuery = paramsFromStateQuery(query);
        console.log(`DataQuery paramsQuery: ${JSON.stringify(paramsQuery)}`);
        let params = {...paramsData,...paramsQuery}
        console.log(`DataQuery submit params: ${JSON.stringify(params)}`);
        let permalink = mkPermalink(API.dataQueryRoute, params);
        setPermalink(permalink);
        console.log("Permalink created: " + JSON.stringify(permalink));
        let form = params2Form(params);
        postQuery(infoUrl, form);
    }

    function postQuery(url, formData,cb) {
        setLoading(true);
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                setLoading(false);
                setResult({ result: data })
                if (cb) cb();
            })
            .catch(function (error) {
                setLoading(false);
                setError(error.message);
            });
    }

        return (
            <Container fluid={true}>
                <h1>Data Query</h1>
                <Row>
                    { loading || result || permalink ?
                        <Fragment>
                            <Col>
                                {loading ? <Pace color="#27ae60"/> :
                                    error? <Alert variant='danger'>{error}</Alert> :
                                        result ? <ResultEndpointQuery result={result} error={error} permalink={permalink} />: null }
                            </Col>
                        </Fragment> : null
                    }
                    <Col>
                <Form onSubmit={handleSubmit}>
                    { mkDataTabs(data, setData) }
                    { mkQueryTabs(query, setQuery) }
                    <Button variant="primary" type="submit">Query</Button>
                </Form>
                    </Col>
                </Row>
            </Container>
        );
}

export default DataQuery;
