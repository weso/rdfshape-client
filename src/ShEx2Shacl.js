import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ShExTabs from "./ShExTabs"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Pace from "react-pace-progress";
import ResultShEx2Shacl from "./results/ResultShEx2Shacl";
import { mkPermalink, params2Form, Permalink } from "./Permalink";
import API from "./API";
import SelectFormat from "./SelectFormat";
import qs from "query-string";
import { convertTabSchema, shExParamsFromQueryParams } from "./Utils";
import axios from "axios";

export default function ShEx2Shacl(props) {
    const url = API.schemaConvert;

    const [result, setResult] = useState('');
    const [permalink, setPermalink] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [shExTextArea, setShExTextArea] = useState('');
    const [shExFormat, setShExFormat] = useState(API.defaultShExFormat);
    const [shExUrl, setShExUrl] = useState('');
    const [shExFile, setShExFile] = useState(null);
    const [shExActiveTab, setShExActiveTab] = useState(API.defaultTab);
    const [targetFormat, setTargetFormat] = useState(API.defaultSHACLFormat);
    const [yashe, setYashe] = useState(null);
    const [fromParamsShEx, setFromParamsShEx] = useState(false);

    useEffect(() => {
        console.log("Use Effect - shEx2Shacl");
        if (props.location.search) {
            const clientParams = qs.parse(props.location.search);
            console.log("Client Params: " + JSON.stringify(clientParams));
            //                let clientParams =  shExParamsFromQueryParams(queryParams);
            let serverParams = serverParamsFromClientParams(clientParams)
            const formData = params2Form(serverParams);
            postRequest(url, formData, () => updateState(clientParams))
        }
    }, [
        shExUrl,
        shExFormat,
        shExFile,
        shExTextArea,
        shExActiveTab,
        permalink,
        props.location.search
    ]
    );

    const handleShExTabChange = (value) => { setShExActiveTab(value); };
    function handleShExFormatChange(value) { setShExFormat(value); }
    function handleShExByTextChange(value, y) {
        console.log(`handlingShExByTexthange`)
        setShExTextArea(value);
        if (yashe) { yashe.refresh(); }
    }
    function handleShExUrlChange(value) { setShExUrl(value); }
    function handleShExFileUpload(value) { setShExFile(value); }

    function serverParamsFromClientParams(params) {
        let postParams = {};
        if (params['shEx']) { postParams['schema'] = params['shEx']; }
        if (params['shExUrl']) { postParams['schemaURL'] = params['shExUrl']; }
        if (params['shExFormat']) { postParams['schemaFormat'] = params['shExFormat']; }
        if (params['targetFormat']) { postParams['targetSchemaFormat'] = params['targetFormat']; }
        return postParams;
    }

    function queryParamsFromServerParams(params) {
        console.log(`queryParamsFromServerParams: ${JSON.stringify(params)}`)
        let postParams = {};
        if (params['schema']) { postParams['shEx'] = params['schema']; }
        if (params['schemaURL']) { postParams['shExUrl'] = params['schemaURL']; }
        if (params['schemaFormat']) { postParams['shExFormat'] = params['schemaFormat']; }
        if (params['targetSchemaFormat']) { postParams['targetFormat'] = params['targetSchemaFormat']; }
        return postParams;
    }

    function updateState(params) {
        console.log(`UpdateStateShEx: ${JSON.stringify(params)}`);
        if (params['schemaFormat']) setShExFormat(params['schemaFormat']);
        if (params['schema']) {
            setShExActiveTab(API.byTextTab);
            const schema = params['schema'];
            setShExTextArea(schema);
            setFromParamsShEx(true);
            if (params['schemaFormatTextArea']) setShExFormat(params['schemaFormatTextArea']);
        }
        if (params['schemaURL']) {
            setShExActiveTab(API.byUrlTab);
            setShExUrl(params['schemaURL'])
            if (params['schemaFormatUrl']) setShExFormat(params['schemaFormatUrl']);
        }
        if (params['schemaFile']) {
            setShExActiveTab(API.byFileTab);
            setShExFile(params['schemaFile'])
            if (params['schemaFormatFile']) setShExFormat(params['schemaFormatFile']);
        }
    }

    function mkServerParams() {
        let params = {};
        params['activeSchemaTab'] = convertTabSchema(shExActiveTab);
        params['schemaEmbedded'] = false;
        params['schemaFormat'] = shExFormat;
        switch (shExActiveTab) {
            case API.byTextTab:
                params['schema'] = shExTextArea;
                params['schemaFormatTextArea'] = shExFormat;
                break;
            case API.byUrlTab:
                console.log(`byURLTab...${shExUrl}`)
                params['schemaURL'] = shExUrl;
                params['schemaFormatUrl'] = shExFormat;
                break;
            case API.byFileTab:
                params['schemaFile'] = shExFile;
                params['schemaFormatFile'] = shExFormat;
                break;
            default:
        }
        params['targetSchemaFormat'] = targetFormat;
        console.log(`#################### targetSchemaFormat: ${targetFormat}`)
        return params;
    }

    function handleSubmit(event) {
        let serverParams = mkServerParams();
        serverParams['schemaEngine'] = 'ShEx';
        serverParams['targetSchemaEngine'] = 'SHACL';
        console.log(`Making permalink...with ${JSON.stringify(serverParams)}`)
        let clientParams = queryParamsFromServerParams(serverParams)
        let permalink = mkPermalink(API.shEx2ShaclRoute, clientParams);
        console.log(`Permalink created: ${permalink}`)
        setLoading(true);
        setPermalink(permalink);
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
                        <ShExTabs activeTab={shExActiveTab}
                                  handleTabChange={handleShExTabChange}

                                  textAreaValue={shExTextArea}
                                  handleByTextChange={handleShExByTextChange}

                                  shExUrl={shExUrl}
                                  handleShExUrlChange={handleShExUrlChange}

                                  handleFileUpload={handleShExFileUpload}

                                  dataFormat={shExFormat}
                                  handleShExFormatChange={handleShExFormatChange}
                                  setCodeMirror = { (cm) => {setYashe(cm);} }
                                  fromParams={fromParamsShEx}
                                  resetFromParams={() => setFromParamsShEx(false) }
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
