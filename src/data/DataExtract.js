import React, {useState, useEffect, Fragment} from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import API from "../API"
import Form from "react-bootstrap/Form"
import Alert from "react-bootstrap/Alert"
import axios from "axios"
import ResultDataExtract from "../results/ResultDataExtract"
import NodeSelector from "../shex/NodeSelector"
import {mkPermalink, mkPermalinkLong, params2Form, Permalink} from "../Permalink"
import {dataParamsFromQueryParams} from "../utils/Utils"
import qs from "query-string"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import {InitialData, mkDataTabs, paramsFromStateData, updateStateData} from "./Data"
import ProgressBar from "react-bootstrap/ProgressBar"


function DataExtract(props) {
    const [data, setData] = useState(InitialData)
    const [params, setParams] = useState(null)
    const [lastParams, setLastParams] = useState(null)
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(null)
    const [result, setResult] = useState('')
    const [permalink, setPermalink] = useState(null)
    const [nodeSelector, setNodeSelector] = useState('')
    const [progressPercent,setProgressPercent] = useState(0)

    const url = API.dataExtract

    useEffect(() => {
        if (props.location.search) {
            const queryParams = qs.parse(props.location.search)
            if (queryParams.data) {
                const dataParams = {...dataParamsFromQueryParams(queryParams),
                    nodeSelector: queryParams.nodeSelector | nodeSelector}

                setData(updateStateData(dataParams, data))
                if (dataParams['nodeSelector']) setNodeSelector(dataParams['targetDataFormat'])

                // Update Codemirror
                const codeMirrorElement = document.querySelector('.react-codemirror2').firstChild
                if (codeMirrorElement && codeMirrorElement.CodeMirror)
                    codeMirrorElement.CodeMirror.setValue(dataParams.data)

                setParams(queryParams)
                setLastParams(queryParams)
            }
            else setError("Could not parse URL data")
        }
     }, [props.location.search])

    useEffect( () => {
        console.info("PARAMS ==>", params)
        if (params){
            if (params.data){
                resetState()
                setUpHistory()
                postExtract()
            }
            else {
                setError("No RDF data provided")
            }
            window.scrollTo(0, 0)
        }
    }, [params])

    async function handleSubmit(event) {
        event.preventDefault()
        setParams({...paramsFromStateData(data), nodeSelector})
    }

    function postExtract(cb) {
        setLoading(true)
        const formData = params2Form(params)
        setProgressPercent(20)
        axios.post(url,formData)
            .then (response => response.data)
            .then( async data => {
                setProgressPercent(70)

                // TODO better error checking in server
                if (data.msg && data.msg.toLowerCase().startsWith("error")){
                    setError(data.msg)
                    setResult({error: data.msg})
                }
                else setResult(data)
                setPermalink(await mkPermalink(API.dataExtractRoute, params))
                setProgressPercent(80)
                if (cb) cb()
                setProgressPercent(100)
            })
            .catch(function (error) {
                setError(`Error in request: ${url}: ${error.message}`)
            })
            .finally( () => {
                setLoading(false)
                window.scrollTo(0, 0)
            })
    }

    function setUpHistory() {
        // Store the last search URL in the browser history to allow going back
        if (params && lastParams && JSON.stringify(params) !== JSON.stringify(lastParams)){
            // eslint-disable-next-line no-restricted-globals
            history.pushState(null, document.title, mkPermalinkLong(API.dataExtractRoute, lastParams))
        }
        // Change current url for shareable links
        // eslint-disable-next-line no-restricted-globals
        history.replaceState(null, document.title ,mkPermalinkLong(API.dataExtractRoute, params))

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
                    <h1>Extract schema from data</h1>
                </Row>
                <Row>
                    <Col className={"half-col border-right"}>
                        <Form onSubmit={handleSubmit}>
                            { mkDataTabs(data, setData, "RDF input") }
                            <NodeSelector
                                value={nodeSelector}
                                handleChange={(value) => setNodeSelector(value)} />
                            <hr/>
                            <Button variant="primary" type="submit"
                                    className={"btn-with-icon " + (loading ? "disabled" : "")} disabled={loading}>
                                Extract schema</Button>
                        </Form>
                    </Col>

                    { loading || result || error || permalink ?
                        <Col className={"half-col"}>
                            <Fragment>
                                { loading ? <ProgressBar striped animated variant="info" now={progressPercent}/> :
                                  error? <Alert variant="danger">{error}</Alert> :
                                  result ? <ResultDataExtract
                                    result={result}
                                    permalink={permalink}
                                  /> : null
                                }
                            </Fragment>
                        </Col>
                        :
                        <Col className={"half-col"}>
                            <Alert variant='info'>Extraction results will appear here</Alert>
                        </Col>
                    }
                </Row>
            </Container>
    )
}

export default DataExtract
