import React, {Fragment, useEffect, useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import API from "../API";
import DataTabs from "../data/DataTabs"
import Form from "react-bootstrap/Form";
import axios from "axios";
import {dataParamsFromQueryParams} from "../utils/Utils";
import {mkPermalink, params2Form, Permalink} from "../Permalink";
import Cyto from "../components/Cyto";
import Pace from 'react-pace-progress';
import qs from 'query-string';
import {InitialData, mkDataTabs, paramsFromStateData, updateStateData} from "../data/Data";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

function CytoVisualize(props) {

    const [data, setData] = useState(InitialData);
    const [error,setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [permalink, setPermalink] = useState(null);
    const [elements,setElements] = useState([]);

    useEffect(() => {
            if (props.location.search) {
                const queryParams = qs.parse(props.location.search);
                let dataParams = dataParamsFromQueryParams(queryParams);
                dataParams['targetDataFormat'] = "JSON"; // Converts to JSON elements which are visualized by Cytoscape
                postConvert(API.dataConvert, params2Form(dataParams), () => setData(updateStateData(dataParams,data)));
            }},
        [props.location.search]
    );

    function processData(data) {
        const elements = JSON.parse(data.result);
        setElements(elements);
    }

    function postConvert(url, formData, cb) {
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                setLoading(false);
                processData(data);
                if (cb) cb();
            })
            .catch(function (error) {
                setLoading(false);
                setError(error);
                console.log('Error doing server request')
                console.log(error);
            });
    }

    function handleSubmit(event) {
        const url = API.dataConvert;
        let params = paramsFromStateData(data);
        let formData = params2Form(params);
        //console.log(`CytoVisualize state: ${JSON.stringify(this.state)}`)
        //console.log(`CytoVisualize submit params: ${JSON.stringify(params)}`)
        let permalink = mkPermalink(API.cytoVisualizeRoute, params);
        formData.append('targetDataFormat', "JSON"); // Converts to JSON elements which are visualized by Cytoscape
        setLoading(true);
        setPermalink(permalink);
        postConvert(url,formData);
        event.preventDefault();
    }

return (
       <Container fluid={true}>
           <Row>
           <h1>Visualize RDF data</h1>
           </Row>
           <Row>
               { loading || elements || permalink ?
                   <Fragment>
                       <Col>
                           {loading ? <Pace color="#27ae60"/> :
                               error ? <Alert variant='danger'>{error}</Alert> :
                                   elements ? <Cyto elements={elements}/> : null
                           }
                           { permalink? <Permalink url={permalink} />: null }
                       </Col>
                   </Fragment> : null
               }
               <Col>
         <Form onSubmit={handleSubmit}>
             { mkDataTabs(data,setData)}
         <Button variant="primary" type="submit">Visualize</Button>
         </Form>
               </Col>
           </Row>
       </Container>
     );
}

export default CytoVisualize;
