import React, {useState, useEffect} from 'react'
import Container from 'react-bootstrap/Container'
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import API from "../API"
import axios from "axios"
import ResultShExVisualize from "../results/ResultShExVisualize"
import {mkPermalink, mkPermalinkLong, params2Form} from "../Permalink"
import qs from "query-string"
import {
    InitialShEx,
    mkShExTabs,
    paramsFromStateShEx,
    shExParamsFromQueryParams
} from "./ShEx"
import Alert from "react-bootstrap/Alert"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import ProgressBar from "react-bootstrap/ProgressBar"

function ShExVisualize(props) {

  const [shex,setShex] = useState(InitialShEx)

  const [result, setResult] = useState('')

  const [params, setParams] = useState(null)
  const [lastParams, setLastParams] = useState(null)

  const [permalink, setPermalink] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,setError] = useState(null)
  const [progressPercent,setProgressPercent] = useState(0)

  const url = API.schemaVisualize

  useEffect(() => {
      if (props.location.search) {
        const queryParams = qs.parse(props.location.search)
        let paramsShEx = {}

        if (queryParams.schema){
          paramsShEx = shExParamsFromQueryParams(queryParams)
          // Update codemirror
          const codeMirrorElement = document.querySelector('.yashe .CodeMirror')
          if (codeMirrorElement && codeMirrorElement.CodeMirror)
            codeMirrorElement.CodeMirror.setValue(queryParams.schema)
        }

        let params =  {...paramsShEx}
        setParams(params)
        setLastParams(params)

      }
    },[props.location.search]
  )

  useEffect( () => {
    if (params && !loading){
      if (params.schema) {
        resetState()
        setUpHistory()
        postVisualize()
      }
      else {
        setError("No ShEx schema provided")
      }
      window.scrollTo(0, 0)
    }
  }, [params])


  function handleSubmit(event) {
    event.preventDefault()
    setParams({
      ...paramsFromStateShEx(shex),
      schemaEngine: 'ShEx'
    })
  }


  function postVisualize(cb) {
    setLoading(true)
    setProgressPercent(20)
    const formData = params2Form(params);

    axios.post(url,formData).then (response => response.data)
        .then( async data => {
          setProgressPercent(70)
          setResult(data)
          setPermalink(await mkPermalink(API.shExVisualizeRoute, params))
          setProgressPercent(90)
          if (cb) cb()
          setProgressPercent(100)
        })
        .catch(function (error) {
          setError(`Error doing request to ${url}: ${error}`)
        })
      .finally( () => setLoading(false))
  }

  function setUpHistory() {
    // Store the last search URL in the browser history to allow going back
    if (params && lastParams && JSON.stringify(params) !== JSON.stringify(lastParams)){
      // eslint-disable-next-line no-restricted-globals
      history.pushState(null, document.title, mkPermalinkLong(API.shExVisualizeRoute, lastParams))
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(null, document.title ,mkPermalinkLong(API.shExVisualizeRoute, params))

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
              <h1>ShEx: Visualize ShEx schemas</h1>
            </Row>
            <Row>
              <Col className={"half-col border-right"}>
                <Form onSubmit={handleSubmit}>
                    { mkShExTabs(shex, setShex, "ShEx Input")}
                    <hr/>
                    <Button variant="primary" type="submit"
                            className={"btn-with-icon " + (loading ? "disabled" : "")} disabled={loading}>
                      Visualize
                    </Button>
                </Form>
              </Col>
              { loading || result || permalink || error ?
                <Col className="half-col visual-column">
                      {
                        loading ? <ProgressBar striped animated variant="info" now={progressPercent}/> :
                        error   ? <Alert variant="danger">{error}</Alert> :
                        result  ? <ResultShExVisualize
                          result={result}
                          permalink={permalink}
                        /> : null
                      }
                </Col> :
                <Col className={"half-col"}>
                  <Alert variant='info'>Visualizations will appear here</Alert>
                </Col>
              }
            </Row>
          </Container>
  )
}

export default ShExVisualize
