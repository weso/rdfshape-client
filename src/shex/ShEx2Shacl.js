import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ShExTabs from "./ShExTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Pace from "react-pace-progress";
import ResultShEx2Shacl from "../results/ResultShEx2Shacl";
import { mkPermalink, params2Form, Permalink } from "../Permalink";
import API from "../API";
import SelectFormat from "../components/SelectFormat";
import qs from "query-string";
import axios from "axios";
import {convertTabSchema, InitialShEx, shExParamsFromQueryParams, updateStateShEx} from "./ShEx";

export default function ShEx2Shacl(props) {
    const url = API.schemaConvert;

    const [result, setResult] = useState('');
    const [permalink, setPermalink] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [shex, setShEx] = useState(InitialShEx);
    const [targetFormat, setTargetFormat] = useState(API.defaultSHACLFormat);
    const [yashe, setYashe] = useState(null);

    function handleShExTabChange(value) {
        setShEx({...shex, activeTab: value});
    }

    function handleShExFormatChange(value) {
        setShEx({...shex, format: value});
    }

    function handleShExByTextChange(value) {
        setShEx({...shex, textArea: value});
    }

    function handleShExUrlChange(value) {
        setShEx({...shex, url: value});
    }

    function handleShExFileUpload(value) {
        setShEx({...shex, file: value});
    }

    useEffect(() => {
        if (props.location.search) {
            const queryParams = qs.parse(props.location.search);
            let paramsShEx = shExParamsFromQueryParams(queryParams);
            let params = {};
            if (queryParams.targetFormat) params['targetSchemaFormat'] = queryParams.targetFormat ;
            const formData = params2Form(params);
            postRequest(url, formData, () => updateState(params))
        }
    }, [
        props.location.search
    ]
    );

    function updateState(params) {
        setShEx(updateStateShEx(params,shex));
        if (params['targetSchemaFormat']) setTargetFormat(params['targetSchemaFormat']);
    }

    function mkServerParams() {
        let params = {};
        params['activeSchemaTab'] = convertTabSchema(shex.activeTab);
        params['schemaEmbedded'] = false;
        params['schemaFormat'] = shex.format;
        switch (shex.activeTab) {
            case API.byTextTab:
                params['schema'] = shex.textArea;
                params['schemaFormatTextArea'] = shex.format;
                break;
            case API.byUrlTab:
                params['schemaURL'] = shex.url;
                params['schemaFormatUrl'] = shex.format;
                break;
            case API.byFileTab:
                params['schemaFile'] = shex.file;
                params['schemaFormatFile'] = shex.format;
                break;
            default:
        }
        params['targetSchemaFormat'] = targetFormat;
        return params;
    }

    function queryParamsFromServerParams(params) {
        console.log(`queryParamsFromServerParams: ${JSON.stringify(params)}`)
        let queryParams = {};
        if (params['schema']) { queryParams['shEx'] = params['schema']; }
        if (params['schemaURL']) { queryParams['shExUrl'] = params['schemaURL']; }
        if (params['schemaFormat']) { queryParams['shExFormat'] = params['schemaFormat']; }
        if (params['targetSchemaFormat']) { queryParams['targetFormat'] = params['targetSchemaFormat']; }
        return queryParams;
    }

    async function handleSubmit(event) {
        let serverParams = mkServerParams();
        serverParams['schemaEngine'] = 'ShEx';
        serverParams['targetSchemaEngine'] = 'SHACL';
        console.log(`Making permalink...with ${JSON.stringify(serverParams)}`)
        let clientParams = queryParamsFromServerParams(serverParams)
        console.log(`Permalink created: ${permalink}`)
        setLoading(true);
        setPermalink(await mkPermalink(API.shEx2ShaclRoute, clientParams));
        let formData = params2Form(serverParams);
        postRequest(url, formData);
        event.preventDefault();
    }

    function postRequest(url, formData, cb) {
        axios.post(url, formData).then(response => response.data)
            .then((data) => {
                setLoading(false);
                setResult(data);
                if (cb) cb()
            })
            .catch(function (error) {
                setLoading(false);
                setError(`Error doing POST request to ${url}: ${error}`);
                console.log('Error doing server request');
                console.log(error);
            });
    }

    function targetFormatMode(targetFormat) {
        switch (targetFormat.toUpperCase()) {
            case 'TURTLE': return 'turtle';
            case 'RDF/XML': return 'xml';
            case 'TRIG': return 'xml';
            case 'JSON-LD': return 'javascript'
            default: return 'turtle'
        }
    }

    return (
        <Container fluid={true}>
            <h1>Convert ShEx &#8594; SHACL</h1>
            <Row>
                {loading || result || error ?
                    <Col>{
                        loading ? <Pace color="#27ae60" /> :
                        result ? <ResultShEx2Shacl result={result}
                            mode={targetFormatMode(targetFormat)} /> :
                            error ? <p>Error: {error}</p> : null
                    }
                        {permalink && <Permalink url={permalink} />}
                    </Col> : null
                }
                <Col>
                    <Form onSubmit={handleSubmit}>
                        <ShExTabs
                            name={"Shex input"}
                            activeTab={shex.activeTab}
                            handleTabChange={handleShExTabChange}

                            textAreaValue={shex.textArea}
                            handleByTextChange={handleShExByTextChange}

                            shExUrl={shex.url}
                            handleShExUrlChange={handleShExUrlChange}

                            handleFileUpload={handleShExFileUpload}

                            selectedFormat={shex.format}
                            handleShExFormatChange={handleShExFormatChange}
                            setCodeMirror={(cm) => {
                            setYashe(cm);
                            }}
                            fromParams={shex.fromParams}
                            resetFromParams={() => setShEx({...shex, fromParams: false})}
                        />

                        <SelectFormat name="SHACL format"
                            defaultFormat="TURTLE"
                            handleFormatChange={(value) => setTargetFormat(value)}
                            urlFormats={API.shaclFormats} />
                        <Button variant="primary" type="submit">Convert to SHACL</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};
