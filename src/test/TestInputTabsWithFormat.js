import React, {Fragment, useEffect, useState} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Pace from "react-pace-progress";
import Alert from "react-bootstrap/Alert";
import {mkPermalink, params2Form, Permalink} from "../Permalink";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "../API";
import qs from "query-string";
import InputTabsWithFormat from "../components/InputTabsWithFormat";
import {convertTabData} from "../data/Data";

function TestInputTabsWithFormat(props) {

    const InitialData = {
        activeTab: API.defaultTab,
        textArea: '',
        url: '',
        file: null,
        format: API.defaultDataFormat,
        fromParams: false
    } ;

    const [data,setData]=useState(InitialData);
    const [result,setResult] = useState(null);
    const [error,setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [permalink, setPermalink] = useState(null);
    const [codeMirror,setCodeMirror] = useState(null);

    function handleTabChange(value) { setData({...data, activeTab: value}); }
    function handleFormatChange(value) {  setData({...data, format: value}); }
    function handleByTextChange(value) {
        console.log(`handleByTextChange: ${value}`);
        setData({...data, textArea: value});
    }

    function handleUrlChange(value) { setData( {...data, url: value}); }
    function handleFileUpload(value) { setData({...data, file: value }); }

    function paramsFromState(data) {
        let params = {};
        params['activeTab'] = convertTabData(data.dataActiveTab);
        params['dataFormat'] = data.format;
        switch (data.activeTab) {
            case API.byTextTab:
                params['data'] = data.textArea;
                params['dataFormatTextArea'] = data.format;
                break;
            case API.byUrlTab:
                params['dataURL'] = data.url;
                params['dataFormatUrl'] = data.format;
                break;
            case API.byFileTab:
                params['dataFile'] = data.file;
                params['dataFormatFile'] = data.format;
                break;
            default:
        }
        return params;
    }

    function updateState(params, data) {
        if (params['data']) {
            return { ...data,
                activeTab: API.byTextTab,
                textArea: params['data'],
                fromParams: true,
                format: params['dataFormat']? params['dataFormat'] : data.format
            } ;
        }
        if (params['dataUrl']) {
            return {
                ...data,
                activeTab: API.byUrlTab,
                url: params['dataUrl'],
                fromParams: false,
                format: params['dataFormat']? params['dataFormat'] : data.format
            }
        }
        if (params['dataFile']) {
            return {
                ...data,
                activeTab: API.byFileTab,
                file: params['dataFile'],
                fromParams: false,
                format: params['dataFormat'] ? params['dataFormat'] : data.format
            }
        }
        return data;
    }

    function paramsFromQueryParams(params) {
        let newParams = {};
        if (params.data) newParams["data"] = params.data ;
        if (params.dataFormat) newParams["dataFormat"] = params.dataFormat ;
        if (params.dataUrl) newParams["dataUrl"] = params.dataUrl ;
        return newParams;
    }

    useEffect(() => {
            if (props.location.search) {
                const queryParams = qs.parse(props.location.search);
                let params = paramsFromQueryParams(queryParams);
                postInfo(params2Form(params), () => setData(updateState(params,data)));
            }},
        [props.location.search]
    );

    function handleSubmit(event) {
        event.preventDefault();
        let params = paramsFromState(data);
        let formData = params2Form(params);
        let permalink = mkPermalink(API.testInputTabsWithFormatRoute, params);
        console.log("Permalink created: " + JSON.stringify(permalink));
        setLoading(true);
        setPermalink(permalink);
        postInfo(formData);
    }

    function postInfo(formData,cb) {
/*        axios.post(url,formData).then (response => response.data)
            .then((data) => { */
                const data={ result: "Post info done", params: JSON.stringify(formData) };
                setLoading(false);
                setError(null);
                setResult(data);
                if (cb) cb()
/*            })
            .catch(function (error) {
                setLoading(false);
                setError("Error calling server at " + url + ": " + error);
            }); */
    }


    return (
        <Container fluid={true}>
            <Row>
                <h1>Test Input tabs</h1>
            </Row>
            <Row>
                { loading || result || permalink ?
                    <Fragment>
                        <Col>
                            {loading ? <Pace color="#27ae60"/> :
                                error? <Alert variant='danger'>{error}</Alert> :
                                    result ? <details><pre>{JSON.stringify(result)}</pre></details> : null
                            }
                            { permalink? <Permalink url={permalink} />: null }
                        </Col>
                    </Fragment>
                    : null
                }

                <Col>
                    <Form onSubmit={handleSubmit}>
                        <InputTabsWithFormat
                            selectedFormat={API.defaultDataFormat}
                            nameFormat={"Data format"}
                            nameInputTab={"Data"}
                            setCodeMirror={(cm) => setCodeMirror(cm)}

                            activeTab={data.activeTab}
                            handleTabChange={handleTabChange}

                            textAreaValue={data.textArea}
                            handleByTextChange={handleByTextChange}

                            urlValue={data.url}
                            handleUrlChange={handleUrlChange}

                            handleFileUpload={handleFileUpload}

                            format={data.format}
                            handleFormatChange={handleFormatChange}
                            urlFormats={API.dataFormats}
                            fromParams={data.fromParams}
                            resetFromParams={() => setData({...data, fromParams: false}) }
                        />
                        <Button variant="primary" type="submit">Info about shape map</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );

}

export default TestInputTabsWithFormat;