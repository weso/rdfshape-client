import React, {useEffect, useState} from 'react'
import Container from 'react-bootstrap/Container'
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import {InitialData, mkDataTabs, paramsFromStateData} from "../data/Data"
import qs from "query-string"
import {dataParamsFromQueryParams} from "../utils/Utils"
import {mkPermalink, mkPermalinkLong, params2Form} from "../Permalink"
import {InitialShacl, mkShaclTabs, paramsFromStateShacl, shaclParamsFromQueryParams} from "./SHACL"
import API from "../API"
import axios from "axios"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Alert from "react-bootstrap/Alert"
import ResultValidate from "../results/ResultValidate"
import EndpointInput from "../endpoint/EndpointInput"
import ProgressBar from "react-bootstrap/ProgressBar";

function SHACLValidate(props) {
    const [shacl, setShacl] = useState(InitialShacl)
    const [data, setData] = useState(InitialData)

    const [endpoint, setEndpoint] = useState('')
    const [withEndpoint, setWithEndpoint] = useState(false)

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
                let paramsData, paramsShacl, paramsEndpoint = {}
                if (queryParams.data){
                    paramsData = dataParamsFromQueryParams(queryParams)
                    // Update codemirror 1
                    const codeMirrorElement = document.querySelectorAll('.react-codemirror2')[0].firstChild
                    if (codeMirrorElement && codeMirrorElement.CodeMirror)
                        codeMirrorElement.CodeMirror.setValue(queryParams.data)

                }
                if (queryParams.schema){
                    paramsShacl = shaclParamsFromQueryParams(queryParams)
                    // Update codemirror 2
                    const codeMirrorElement = document.querySelectorAll('.react-codemirror2')[1].firstChild
                    if (codeMirrorElement && codeMirrorElement.CodeMirror)
                        codeMirrorElement.CodeMirror.setValue(queryParams.schema)

                }

                if (queryParams.endpoint) paramsEndpoint["endpoint"] = queryParams.endpoint


                let params = {...paramsData, ...paramsShacl, ...paramsEndpoint}
                if (queryParams.triggerMode) params["triggerMode"] = queryParams.triggerMode
                if (queryParams.schemaEngine) params["schemaEngine"] = queryParams.schemaEngine

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
            if (!params.data) setError("No RDF data provided")
            else if (!params.schema) setError("No SHACL schema provided")
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

    async function handleSubmit(event) {
        event.preventDefault()

        const paramsEndpoint = {}
        if (endpoint !== '') {
            paramsEndpoint['endpoint'] = endpoint
        }

        setParams({
            ...paramsFromStateShacl(shacl),
            ...paramsFromStateData(data),
            ...paramsEndpoint,
            schemaEngine: 'Shaclex',
            triggerMode: 'targetDecls'
        })
    }

    function postValidate(cb) {
        setLoading(true)
        setProgressPercent(15)
        const formData = params2Form(params)
        setProgressPercent(30)

        axios.post(url, formData).then(response => response.data)
            .then( async data => {
                setResult(data)
                setProgressPercent(70)
                setPermalink(await mkPermalink(API.shaclValidateRoute, params))
                setProgressPercent(80)
                if (cb) cb()
                setProgressPercent(100)
            })
            .catch(function (error) {
                setError(error.message)
            })
            .finally( () => setLoading(false))
    }

    function setUpHistory() {
        // Store the last search URL in the browser history to allow going back
        if (params && lastParams && JSON.stringify(params) !== JSON.stringify(lastParams)){
            // eslint-disable-next-line no-restricted-globals
            history.pushState(null, document.title, mkPermalinkLong(API.shaclValidateRoute, lastParams))
        }
        // Change current url for shareable links
        // eslint-disable-next-line no-restricted-globals
        history.replaceState(null, document.title ,mkPermalinkLong(API.shaclValidateRoute, params))

        setLastParams(params)
    }

    function resetState() {
        setResult(null)
        setPermalink(null)
        setError(null)
        setProgressPercent(0)
    }

    return (
        <Container>
            <Row>
                <h1>Validate RDF data with SHACL</h1>
            </Row>
            <Row>
                <Col className={"half-col border-right"}>
                    <Form onSubmit={handleSubmit}>

                        { mkDataTabs(data, setData, "RDF input")}
                        <Button
                            variant="secondary"
                            onClick={() => setWithEndpoint(!withEndpoint)}>{withEndpoint? "Remove":"Add" } endpoint
                        </Button>
                        { withEndpoint?
                            <EndpointInput value={endpoint}
                                           handleOnChange={handleEndpointChange}/>
                            : null
                        }
                        <hr/>
                        { mkShaclTabs(shacl,setShacl, "Shapes graph (SHACL)")}
                        <hr/>
                        <Button variant="primary" type="submit"
                                className={"btn-with-icon " + (loading ? "disabled" : "")} disabled={loading}>
                                Validate
                        </Button>
                    </Form>
                </Col>
                {loading || result || permalink || error ?
                <Col className={"half-col"}>
                    {
                        loading ? <ProgressBar className="width-100" striped animated variant="info" now={progressPercent}/> :
                        error ? <Alert variant="danger">{error}</Alert> :
                        result ?
                            <ResultValidate
                                result={result}
                                permalink={permalink}
                            />
                            : null}
                </Col> :
                <Col className={"half-col"}>
                    <Alert variant='info'>Validation results will appear here</Alert>
                </Col>
                }
            </Row>
        </Container>
    )
}

export default SHACLValidate
