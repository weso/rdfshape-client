import React, {useEffect, useState} from 'react'
import Container from 'react-bootstrap/Container'
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import API from "../API"
import axios from "axios"
import ResultValidate from "../results/ResultValidate"
import {mkPermalink, mkPermalinkLong, params2Form} from "../Permalink"
import qs from "query-string"
import EndpointInput from "../endpoint/EndpointInput"
import {InitialShEx, mkShExTabs, paramsFromStateShEx, shExParamsFromQueryParams} from "./ShEx"
import {
    InitialShapeMap, mkShapeMapTabs,
    paramsFromStateShapeMap,
    shapeMapParamsFromQueryParams
} from "../shapeMap/ShapeMap"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Alert from "react-bootstrap/Alert"
import ProgressBar from "react-bootstrap/ProgressBar"

function ShExValidateEndpoint(props) {

    const [endpoint, setEndpoint] = useState('')

    const [shex, setShEx] = useState(InitialShEx)
    const [shapeMap, setShapeMap] = useState(InitialShapeMap)

    const [result, setResult] = useState('')

    const [params, setParams] = useState(null)
    const [lastParams, setLastParams] = useState(null)

    const [permalink, setPermalink] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [progressPercent,setProgressPercent] = useState(0)

    const url = API.schemaValidate

    useEffect(() => {
            if (props.location.search) {
                const queryParams = qs.parse(props.location.search)
                let paramsShEx, paramsShapeMap, paramsEndpoint = {}

                if (queryParams.schema){
                    paramsShEx = shExParamsFromQueryParams(queryParams)
                    // Update codemirror 1
                    const codeMirrorElement = document.querySelector('.yashe .CodeMirror')
                    if (codeMirrorElement && codeMirrorElement.CodeMirror)
                        codeMirrorElement.CodeMirror.setValue(queryParams.schema)

                }

                if (queryParams.shapeMap){
                    paramsShapeMap = shapeMapParamsFromQueryParams(queryParams)
                    // Update codemirror 2
                    const codeMirrorElement = document.querySelector('.react-codemirror2').firstChild
                    if (codeMirrorElement && codeMirrorElement.CodeMirror)
                        codeMirrorElement.CodeMirror.setValue(queryParams.shapeMap)
                }

                if (queryParams.endpoint) {
                    paramsEndpoint["endpoint"] = queryParams.endpoint
                    setEndpoint(queryParams.endpoint)
                }
                let params = {...paramsShEx, ...paramsShapeMap, ...paramsEndpoint}

                setParams(params)
                setLastParams(params)

            }
        },
        [
            props.location.search,
        ]
    )

    useEffect( () => {
        if (params && !loading){
            if (!params.schema) setError("No ShEx schema provided")
            else if (!params.shapeMap) setError("No ShapeMap provided")
            else if (!endpoint) setError("Specify a valid endpoint URL")
            else {
                resetState()
                setUpHistory()
                postValidate()
            }
            window.scrollTo(0, 0)
        }
    }, [params])

    function handleEndpointChange(value) {
        setEndpoint(value)
    }

    function handleSubmit(event) {
        event.preventDefault()

        setParams({
            ...paramsFromStateShEx(shex),
            ...paramsFromStateShapeMap(shapeMap),
            endpoint,
            schemaEngine: 'ShEx',
            triggerMode: 'shapeMap'
        })
    }

    function postValidate(cb) {
        setLoading(true)
        setProgressPercent(15)
        const formData = params2Form(params)
        setProgressPercent(30)

        axios.post(url, formData).then(response => response.data)
            .then(async data => {
                setResult(data)
                setProgressPercent(70)
                setPermalink(await mkPermalink(API.shExValidateEndpointRoute, params))
                setProgressPercent(80)
                if (cb) cb()
                setProgressPercent(100)
            })
            .catch(function (error) {
                setError(`Error calling server at ${url}: ${error.message}.\n Did you input a valid endpoint?`)
            })
            .finally( () => setLoading(false))
    }

    function setUpHistory() {
        // Store the last search URL in the browser history to allow going back
        if (params && lastParams && JSON.stringify(params) !== JSON.stringify(lastParams)){
            // eslint-disable-next-line no-restricted-globals
            history.pushState(null, document.title, mkPermalinkLong(API.shExValidateEndpointRoute, lastParams))
        }
        // Change current url for shareable links
        // eslint-disable-next-line no-restricted-globals
        history.replaceState(null, document.title ,mkPermalinkLong(API.shExValidateEndpointRoute, params))

        setLastParams(params)
    }

    function resetState() {
        setResult(null)
        setPermalink(null)
        setError(null)
        setProgressPercent(0)
    }

    return (
            <Container fluid={true}>
                <Row>
                    <h1>ShEx: Validate RDF data from Endpoint</h1>
                </Row>
                <Row>
                    <Col className={"half-col border-right"}>
                        <Form onSubmit={handleSubmit}>
                            <EndpointInput
                                value={endpoint}
                                handleOnChange={handleEndpointChange} />

                                { mkShExTabs(shex,setShEx, "ShEx Input") }
                                <hr/>
                                { mkShapeMapTabs(shapeMap,setShapeMap, "ShapeMap Input") }
                                <hr/>
                                <Button variant="primary" type="submit"
                                        className={"btn-with-icon " + (loading ? "disabled" : "")} disabled={loading}>
                                    Validate from Endpoint
                                </Button>
                        </Form>
                    </Col>
                    {loading || result || permalink || error ?
                        <Col className={"half-col"}>
                            {
                                loading ? <ProgressBar className="width-100" striped animated variant="info" now={progressPercent}/> :
                                error   ? <Alert variant="danger">{error}</Alert> :
                                result  ?
                                        <ResultValidate
                                            result={result}
                                            permalink={permalink}
                                        /> : null }
                        </Col>
                        :
                        <Col className={"half-col"}>
                            <Alert variant='info'>Validation results will appear here</Alert>
                        </Col>
                    }
                </Row>
            </Container>
        )
}

export default ShExValidateEndpoint
