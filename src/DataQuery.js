import React, {useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import API from "./API";
import DataTabs from "./DataTabs"
import QueryTabs from "./QueryTabs"
import Form from "react-bootstrap/Form";
import axios from "axios";
import ResultQuery from "./results/ResultQuery";
import {InitialData, InitialQuery, paramsFromStateData, paramsFromStateQuery} from "./Utils";
import {params2Form} from "./Permalink";

function DataQuery(props)  {
    const [data, setData] = useState(InitialData);
    const [result,setResult] = useState(null);
    const [query, setQuery] = useState(InitialQuery);
    const [error, setError] = useState(null);
    const [permalink, setPermalink] = useState('');

    function handleDataTabChange(value) { setData({...data, dataActiveTab: value}); }
    function handleDataFormatChange(value) {  setData({...data, dataFormat: value}); }
    function handleDataByTextChange(value) { setData({...data, dataTextArea: value}); }
    function handleDataUrlChange(value) { setData( {...data, dataUrl: value}); }
    function handleDataFileUpload(value) { setData({...data, dataFile: value }); }

    function handleQueryTabChange(value) { setQuery({...query, queryActiveTab: value}); }
    function handleQueryByTextChange(value) { setQuery({...query, queryTextArea: value}); }
    function handleQueryUrlChange(value) { setQuery( {...query, queryUrl: value}); }
    function handleQueryFileUpload(value) { setQuery({...query, queryFile: value }); }

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
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                setResult({ result: data })
                if (cb) cb();
            })
            .catch(function (error) {
                setError(error.message);
                console.log('Error doing server request')
                console.log(error);
            });

    }

        return (
            <Container fluid={true}>
                <h1>Data Query</h1>
                <ResultQuery result={result} />
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
                    <QueryTabs activeTab={query.queryActiveTab}
                              handleTabChange={handleQueryTabChange}

                              textAreaValue={query.queryTextArea}
                              handleByTextChange={handleQueryByTextChange}

                              urlValue={query.queryUrl}
                              handleDataUrlChange={handleQueryUrlChange}

                              handleFileUpload={handleQueryFileUpload}
                    />
                    <Button variant="primary" type="submit">Query</Button>
                </Form>
            </Container>
        );
}

export default DataQuery;
