import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import ResultShEx2XMI from "../results/ResultShEx2XMI"
import ResultXMI2ShEx from "../results/ResultXMI2ShEx"
import {mkPermalink, mkPermalinkLong, params2Form} from "../Permalink"
import API from "../API"
//import SelectFormat from "../components/SelectFormat"
import qs from "query-string"
import axios from "axios"
import {convertTabSchema, InitialShEx, mkShExTabs, shExParamsFromQueryParams} from "./ShEx"
import {InitialUML, mkUMLTabs, UMLParamsFromQueryParams} from "../uml/UML"
import Alert from "react-bootstrap/Alert"
import ProgressBar from "react-bootstrap/ProgressBar"
import shumlex from "shumlex"
import $ from "jquery"
const cyto = require('cytoscape');
let dagre = require('cytoscape-dagre');
const panzoom = require('cytoscape-panzoom');


export default function ShEx2XMI(props) {

    const [shex, setShEx] = useState(InitialShEx)
    const [xmi, setXmi] = useState(InitialUML)
    const [targetFormat, setTargetFormat] = useState("RDF/XML")

    const [result, setResult] = useState('')

    const [params, setParams] = useState(null)
    const [lastParams, setLastParams] = useState(null)


    const [permalink, setPermalink] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [progressPercent,setProgressPercent] = useState(0)

    const url = API.schemaConvert
	
	const [isShEx2UML, setIsShEx2UML] = useState(true)
	
	let style = [ //Hoja de estilo para el grafo
    {
        selector: 'node',
        style: {
            'background-color': 'purple',
            'background-opacity': '0.1',
            'label': 'data(name)',
            'text-valign': 'center',
            'font-family': 'CaslonAntique'
        }
    },

    {
        selector: 'edge',
        style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(name)',
            'font-family': 'CaslonAntique'
        }
    }
];

let defaults = {
    zoomFactor: 0.05, // zoom factor per zoom tick
    zoomDelay: 45, // how many ms between zoom ticks
    minZoom: 0.1, // min zoom level
    maxZoom: 10, // max zoom level
    fitPadding: 50, // padding when fitting
    panSpeed: 10, // how many ms in between pan ticks
    panDistance: 10, // max pan distance per tick
    panDragAreaSize: 75, // the length of the pan drag box in which the vector for panning is calculated (bigger = finer control of pan speed and direction)
    panMinPercentSpeed: 0.25, // the slowest speed we can pan by (as a percent of panSpeed)
    panInactiveArea: 8, // radius of inactive area in pan drag box
    panIndicatorMinOpacity: 0.5, // min opacity of pan indicator (the draggable nib); scales from this to 1.0
    zoomOnly: false, // a minimal version of the ui only with zooming (useful on systems with bad mousewheel resolution)
    fitSelector: undefined, // selector of elements to fit
    animateOnFit: function(){ // whether to animate on fit
        return false;
    },
    fitAnimationDuration: 1000, // duration of animation on fit

    // icon class names
    sliderHandleIcon: 'fa fa-minus',
    zoomInIcon: 'fa fa-plus',
    zoomOutIcon: 'fa fa-minus',
    resetIcon: 'fa fa-expand'
};

    useEffect(() => {
          if (props.location.search) {
              const queryParams = qs.parse(props.location.search)
              let paramsShEx = {}
		
              if (queryParams.schema){
                  paramsShEx = isShEx2UML ? shExParamsFromQueryParams(queryParams) : UMLParamsFromQueryParams(queryParams)
                  // Update codemirror
                  const codeMirrorElement = document.querySelector('.yashe .CodeMirror')
                  if (codeMirrorElement && codeMirrorElement.CodeMirror)
                      codeMirrorElement.CodeMirror.setValue(queryParams.schema)
              }

              let params = {
                  ...paramsShEx,
                  ...mkServerParams(queryParams.targetFormat),
                  schema: queryParams.schema,
                  schemaEngine: isShEx2UML ? 'ShEx' : 'xml',
                  targetSchemaEngine: isShEx2UML ? 'xml' : 'ShEx' 
              }
			  
              setParams(params)
              setLastParams(params)

          }
      },[props.location.search]
    )

    useEffect( () => {
        console.log("SUBMIT: ", params)
        if (params && !loading){
            if (params.schema) {
                resetState()
                setUpHistory()
                doRequest()
            }
            else {
                setError("No ShEx schema provided")
            }
            window.scrollTo(0, 0)
        }
    }, [params])
	
	useEffect( () => {
		
        console.log($("#jsongrafo pre").html());
        //console.log(JSON.parse($("#jsongrafo pre").html()));
		cyto.use( dagre );
		//panzoom( cyto );
		let elements = null;
		if(elements != null) {
			let cy = cyto({

        container: document.getElementById('grafoshex'), // Contenedor

        elements: null,

        style: style,

        layout: {
            name: 'dagre',
            nodeSep: 60,
            edgeSep: 40,
            rankSep: 80
        }

    });
    cy.panzoom( defaults );
		}	
    }, [result])

    function targetFormatMode(targetFormat) {
        switch (targetFormat.toUpperCase()) {
            case 'TURTLE': return 'turtle'
            case 'RDF/XML': return 'xml'
            case 'TRIG': return 'xml'
            case 'JSON-LD': return 'javascript'
            default: return 'xml'
        }
    }

    function mkServerParams(format) {
        let params = {}
		let source = isShEx2UML ? shex : xmi
        params['activeSchemaTab'] = convertTabSchema(source.activeTab)
        params['schemaEmbedded'] = false
        params['schemaFormat'] = source.format
        switch (source.activeTab) {
            case API.byTextTab:
                params['schema'] = source.textArea
                params['schemaFormatTextArea'] = source.format
                break
            case API.byUrlTab:
                params['schemaURL'] = source.url
                params['schemaFormatUrl'] = source.format
                break
            case API.byFileTab:
                params['schemaFile'] = source.file
                params['schemaFormatFile'] = source.format
                break
            default:
        }

        if (format){
            setTargetFormat(format)
            params['targetSchemaFormat'] = format
        }
        else params['targetSchemaFormat'] = targetFormat
        return params
    }

    function queryParamsFromServerParams(params) {
        let queryParams = {}
        if (params['schema']) { queryParams['schema'] = params['schema'] }
        if (params['schemaURL']) { queryParams['shExUrl'] = params['schemaURL'] }
        if (params['schemaFormat']) { queryParams['shExFormat'] = params['schemaFormat'] }
        if (params['targetSchemaFormat']) { queryParams['targetFormat'] = params['targetSchemaFormat'] }
        return queryParams
    }

    function handleSubmit(event) {
        event.preventDefault()
		if(isShEx2UML) {
			setParams({
            ...mkServerParams(),
            schemaEngine: 'ShEx',
            targetSchemaEngine: 'xml'
        })
		}
		else {
			setParams({
            ...mkServerParams('ShEx'),
            schemaEngine: 'xml',
            targetSchemaEngine: 'ShEx'
        })
		}
        
    }

    function doRequest(cb) {
        setLoading(true)
        setProgressPercent(20)
		let res = ""
		let grf = ""
		if(isShEx2UML) {
			res = shumlex.shExToXMI(params.schema)
			grf = shumlex.crearDiagramaUML(res)
		}
		else {
			res = shumlex.XMIToShEx(params.schema)
			grf = shumlex.crearGrafo(res)
		}
		
		setProgressPercent(90)
		let result = { result: res, grafico: grf, msg: "Éxito en la conversión" }
		setResult(result)
		setProgressPercent(100)
		setLoading(false)
    }

    function setUpHistory() {
        // Store the last search URL in the browser history to allow going back
        if (params && lastParams && JSON.stringify(params) !== JSON.stringify(lastParams)){
            // eslint-disable-next-line no-restricted-globals
            history.pushState(null, document.title, mkPermalinkLong(API.shEx2XMIRoute,
              queryParamsFromServerParams(lastParams)))
        }
        // Change current url for shareable links
        // eslint-disable-next-line no-restricted-globals
        history.replaceState(null, document.title ,mkPermalinkLong(API.shEx2XMIRoute,
          queryParamsFromServerParams(params)))

        setLastParams(params)
    }

    function resetState() {
        setResult(null)
        setPermalink(null)
        setError(null)
        setProgressPercent(0)
    }
	
	$("#uml2shex").click(loadOppositeConversion)
	$("#shex2uml").click(loadOppositeConversion)
	
	function loadOppositeConversion() {
		resetState()
		setIsShEx2UML(!isShEx2UML)
	}

    return (
        <Container fluid={true}>
			{ isShEx2UML && <>
			<Row>
                <h1>Convert ShEx to UML</h1>
            </Row>
            <Row>
                <Col className={"half-col border-right"}>
                    <Form onSubmit={handleSubmit}>
                        { mkShExTabs(shex,setShEx, "ShEx Input")}
                        <hr/>
                        <Button variant="primary" type="submit"
                                className={"btn-with-icon " + (loading ? "disabled" : "")} disabled={loading}>
                            Convert to UML
                        </Button>
                    </Form>
                </Col>
                { loading || result || error || permalink ?
                  <Col className={"half-col"}>
                      {
                        loading ? <ProgressBar striped animated variant="info" now={progressPercent}/> :
                        error ? <Alert variant='danger'>{error}</Alert> :
                        result ? <ResultShEx2XMI
                            result={result}
                            mode={targetFormatMode('xml')}
                            permalink={permalink}
                          /> :
                          ""
                        }
                  </Col> :
                  <Col className={"half-col"}>
                      <Alert variant='info'>Conversion results will appear here</Alert>
                  </Col>
                }
            </Row>
			
			<Row>
				<Button id="uml2shex" variant="secondary"
                                className={"btn-with-icon " + (loading ? "disabled" : "")} disabled={loading}>
                            Load UML to ShEx converter
                </Button>
			</Row>
			</>
			}
			{ !isShEx2UML &&
			<>
			<Row>
                <h1>Convert UML to ShEx</h1>
            </Row>
			<Row>
                <Col className={"half-col border-right"}>
                    <Form onSubmit={handleSubmit}>
                        { mkUMLTabs(xmi,setXmi, "UML Input")}
                        <hr/>
                        <Button variant="primary" type="submit"
                                className={"btn-with-icon " + (loading ? "disabled" : "")} disabled={loading}>
                            Convert to ShEx
                        </Button>
                    </Form>
                </Col>
                { loading || result || error || permalink ?
                  <Col className={"half-col"}>
                      {
                        loading ? <ProgressBar striped animated variant="info" now={progressPercent}/> :
                        error ? <Alert variant='danger'>{error}</Alert> :
                        result ? <ResultXMI2ShEx
                            result={result}
                            mode={targetFormatMode('TURTLE')}
                            permalink={permalink}
							activeTab="XMI"
                          /> :
                          ""
                        }
                  </Col> :
                  <Col className={"half-col"}>
                      <Alert variant='info'>Conversion results will appear here</Alert>
                  </Col>
                }
            </Row>
			<Row>
				<Button id="shex2uml" variant="secondary"
                                className={"btn-with-icon " + (loading ? "disabled" : "")} disabled={loading}>
                            Load ShEx to UML converter
                        </Button>
			</Row>
			</>
			}
        </Container>
    )
}
