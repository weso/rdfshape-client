import React, {Fragment, useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import API from "../API";
import Form from "react-bootstrap/Form";
import axios from "axios";
import ResultQuery from "../results/ResultQuery";
import {InitialQuery, paramsFromStateQuery, mkQueryTabs} from "../query/Query";
import {params2Form} from "../Permalink";
import Col from "react-bootstrap/Col";
import Pace from "react-pace-progress";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import {InitialData, mkDataTabs, paramsFromStateData} from "./Data";


function DataQuery(props)  {
    const [data, setData] = useState(InitialData);
    const [result,setResult] = useState(null);
    const [query, setQuery] = useState(InitialQuery);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [permalink, setPermalink] = useState('');



    function handleSubmit(event) {
        event.preventDefault();
        const infoUrl = API.dataQuery;
        let paramsData = paramsFromStateData(data);
        console.log(`DataQuery paramsData: ${JSON.stringify(paramsData)}`)
        let paramsQuery = paramsFromStateQuery(query);
        console.log(`DataQuery paramsQuery: ${JSON.stringify(paramsQuery)}`)
        let params = {...paramsData,...paramsQuery}
        console.log(`DataQuery submit params: ${JSON.stringify(params)}`)
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
                                        result && result.result ?
                                            <ResultQuery result={result.result} /> : null }
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
