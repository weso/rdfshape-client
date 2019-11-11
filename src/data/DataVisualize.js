import React, {Fragment, useEffect, useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import API from "../API";
import DataTabs from "./DataTabs"
import Form from "react-bootstrap/Form";
import axios from "axios";
import SelectGraphFormat from "../SelectGraphFormat";
import {dataParamsFromQueryParams, InitialData, paramsFromStateData, updateStateData} from "../Utils";
import {mkPermalink, params2Form, Permalink} from "../Permalink";
import qs from "query-string";
import ShowSVG from "../ShowSVG";
import Viz from 'viz.js/viz.js';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Pace from "react-pace-progress";
import Alert from "react-bootstrap/Alert";
const {Module, render} = require('viz.js/full.render.js');

function  DataVisualize(props) {

    const [data, setData] = useState(InitialData);
    const [error,setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [permalink, setPermalink] = useState(null);
    const [targetGraphFormat, setTargetGraphFormat] = useState('SVG');
    const [svg, setSVG] = useState(null);

    function handleDataTabChange(value) { setData({...data, dataActiveTab: value}); }
    function handleDataFormatChange(value) {  setData({...data, dataFormat: value}); }
    function handleDataByTextChange(value) { setData({...data, dataTextArea: value}); }
    function handleDataUrlChange(value) { setData( {...data, dataUrl: value}); }
    function handleDataFileUpload(value) { setData({...data, dataFile: value }); }
    function handleTargetGraphFormatChange(value) {  setTargetGraphFormat(value);  }

    useEffect(() => {
            if (props.location.search) {
                const queryParams = qs.parse(props.location.search);
                let params = dataParamsFromQueryParams(queryParams);
                params['targetDataFormat'] = 'dot'; // It converts to dot in the server
                setPermalink(mkPermalink(API.dataVisualizeRoute,queryParams));
                postVisualize(API.dataConvert, params2Form(params), () => updateStateVisualize(params))
        }},
        [props.location.search
        ]
    );

    function updateStateVisualize(params) {
        updateStateData(params, data);
    }

/*    function updateStateData(params) {
        if (params['data']) {
            setData({...data, dataActiveTab: API.byTextTab, dataTextArea: params['data'], fromParamsData: true} );
        }
        if (params['dataFormat']) setData({...data, dataFormat: params['dataFormat']});
        if (params['dataUrl']) {
            setData({...data, dataActiveTab: API.byUrlTab, dataUrl: params['dataUrl']} );
        }
        if (params['dataFile']) {
            setData({...data, dataActiveTab: API.byFileTab, dataFile: params['dataFile']} );
        }
    } */

    function processData(d, targetFormat) {
       console.log(`Process data: ${JSON.stringify(d)}`);
       convertDot(d.result,'dot','SVG')
    }



    function handleSubmit(event) {
        event.preventDefault();
        let params = paramsFromStateData(data);
        params['targetGraphFormat'] = targetGraphFormat;
        let formData = params2Form(params);
        const targetFormat = targetGraphFormat ;
        formData.append('targetDataFormat', 'dot'); // It converts to dot in the server
        params['targetDataFormat'] = targetFormat ; // But it keeps the original target format for permalink
        setLoading(true);
        setError(null);
        setPermalink(mkPermalink(API.dataVisualizeRoute, params));
        postVisualize(API.dataConvert,formData)
    }

    function postVisualize(url, formData, cb) {
        console.log(`POSTVisualize: ${url}`)
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                console.log(`POSTVisualize, data returned: ${JSON.stringify(data)}`)
                processData(data);
                if (cb) cb()
            })
            .catch(function (error) {
                setLoading(false);
                setError(`Error doing request to ${url}: ${error.message}`)
            });
    }
    function convertDot(dot, engine, format) {
        let viz = new Viz({Module, render});
        const opts = {engine: 'dot'};
        viz.renderSVGElement(dot, opts).then(svg => {
            setLoading(false);
            setSVG({
                svg: svg.outerHTML
            });
        }).catch(error => {
            // Create a new Viz instance (@see Caveats page for more info)
            viz = new Viz({Module, render});
            setLoading(false);
            setError(`Error converting to ${format}: ${error}\nDOT:\n${dot}`)
        });
    }


     return (
       <Container fluid={true}>
         <h1>Visualize RDF data</h1>
           <Row> { loading || error || svg ?
              <Fragment>
               { loading ? <Pace color="#27ae60"/> :
                 error ? <Alert variant='danger'>{error}</Alert> :
                 svg && svg.svg ?
                   <Col>
                    <ShowSVG svg={svg.svg}/>
                    { permalink? <Permalink url={permalink} /> : null }
                   </Col> : null
               }
              </Fragment> :
               null
           }
         <Col>
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
             <SelectGraphFormat name="Target graph format"
                               default={targetGraphFormat}
                               handleChange={handleTargetGraphFormatChange}
             />
         <Button variant="primary" type="submit">Visualize</Button>
         </Form>
           </Col>
           </Row>
       </Container>
   );
}

export default DataVisualize;
