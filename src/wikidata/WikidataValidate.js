import React, { useState, useReducer } from 'react';
import Container from 'react-bootstrap/Container';
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Pace from "react-pace-progress";
import {mkPermalink, params2Form, Permalink} from "../Permalink";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ShExTabs from "../shex/ShExTabs";
import API from "../API"
import axios from "axios";
import Tab from "react-bootstrap/Tab";
import InputShapeLabel from "../components/InputShapeLabel";
import Tabs from "react-bootstrap/Tabs";
import InputEntitiesByText from "../components/InputEntitiesByText";
import ResultValidate from "../results/ResultValidate";
import InputWikidataSchema from "../components/InputWikidataSchema";
import {convertTabSchema} from "../shex/ShEx";

function WikidataValidate(props) {

    const initialStatus = { loading: false, error: false, result: null, permalink: null }
    const initialShExStatus = { shExActiveTab: API.defaultTab, shExTextArea: '', shExUrl: '', shExFormat: API.defaultShExFormat} ;

    const [status, dispatch] = useReducer(statusReducer, initialStatus);
    const [entities,setEntities] = useState([]);

    const [schemaEntity,setSchemaEntity] = useState('');
    const [schemaActiveTab, setSchemaActiveTab] = useState('BySchema')
    const [shEx, dispatchShEx] = useReducer(shExReducer, initialShExStatus);
    const [shapeLabel, setShapeLabel] = useState('');
    const urlServer = API.schemaValidate
    const [permalink, setPermalink] = useState(null);

    function handleChange(es) {
        setEntities(es);
    }

    function handleChangeSchemaEntity(e) {
        dispatchShEx({type: 'setUrl', value: e})
        setSchemaEntity(e);
    }


    function paramsFromShEx(shExStatus) {
        let params = {};
        params['activeSchemaTab'] = convertTabSchema(shExStatus.shExActiveTab);
        params['schemaEmbedded'] = false;
        params['schemaFormat'] = shExStatus.shExFormat;
        switch (shExStatus.shExActiveTab) {
            case API.byTextTab:
                params['schema'] = shExStatus.shExTextArea;
                params['schemaFormatTextArea'] = shExStatus.shExFormat;
                break;
            case API.byUrlTab:
                params['schemaURL'] = shExStatus.shExUrl;
                params['schemaFormatUrl'] = shExStatus.shExFormat;
                break;
            case API.byFileTab:
                params['schemaFile'] = shExStatus.shExFile;
                params['schemaFormatFile'] = shExStatus.shExFormat;
                break;
            default:
        }
        return params;
    }

    function shExReducer(status,action) {
        switch (action.type) {
            case 'changeTab':
                return { ...status, shExActiveTab: action.value }
            case 'setText':
                return { ...status, shExActiveTab: API.byTextTab, shExTextArea: action.value }
            case 'setUrl':
                return { ...status, shExActiveTab: API.byUrlTab, shExUrl: action.value }
            case 'setFile':
                return { ...status, shExActiveTab: API.byFileTab, shExFile: action.value }
            case 'setFormat':
                return { ...status, shExFormat: action.value }
            default:
                return new Error(`shExReducer: unknown action type: ${action.type}`)
        }
    }

    function statusReducer(status,action) {
        switch (action.type) {
            case 'set-loading':
              return { ...status, loading: true, error: false, result: null};
            case 'set-result':
              console.log(`statusReducer: set-result: ${JSON.stringify(action.value)}`)
              return { loading: false, error: false, result: action.value};
            case 'set-error':
              return { loading: false, error: action.value, result: null};
            default: throw new Error(`Unknown action type for statusReducer: ${action.type}`)
        }
    }

    function shapeMapFromEntities(entities,shapeLabel) {
        const shapeMap = entities.map(e => `<${e.uri}>@${shapeLabel}`).join(',')
        return shapeMap;
    }

    function handleSubmit(event) {
        event.preventDefault();
        const paramsShEx = paramsFromShEx(shEx)
        const shapeMap = shapeMapFromEntities(entities, shapeLabel)
        const paramsEndpoint = { endpoint: API.wikidataUrl };
        let params = {...paramsEndpoint,...paramsShEx};
        params['schemaEngine']='ShEx';
        params['triggerMode']='shapeMap';
        params['shapeMap']=shapeMap;
        params['shapeMapFormat']='Compact';
        const formData = params2Form(params);
        setPermalink(mkPermalink(API.wikidataValidateRoute,params));
        postValidate(urlServer,formData);
    }

    function postValidate(url, formData, cb) {
        dispatch({type: 'set-loading'} );
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                dispatch({type: 'set-result', value: data})
                if (cb) cb()
            })
            .catch(function (error) {
                dispatch({type: 'set-error', value: `Error: ${error}` })
            });
    }

    function handleShExTabChange(value) { dispatchShEx({ type: 'changeTab', value: value } ); }
    function handleShExFormatChange(value) {  dispatchShEx({type: 'setFormat', value: value }); }
    function handleShExByTextChange(value) { dispatchShEx({type: 'setText', value: value}) }
    function handleShExUrlChange(value) { dispatchShEx({type: 'setUrl', value: value}) }
    function handleShExFileUpload(value) { dispatchShEx({type: 'setFile', value: value}) }

    function handleTabChange(e) {
        setSchemaActiveTab(e)
    }

    return (
       <Container>
         <h1>Validate Wikidata entities</h1>
                   { status.result || status.loading || status.error ?
                       <Row>
                           {status.loading ? <Pace color="#27ae60"/> :
                               status.error? <Alert variant="danger">{status.error}</Alert> :
                               status.result ?
                                   <ResultValidate result={status.result} /> : null
                           }
                           { permalink &&  <Col><Permalink url={permalink} /> </Col>}
                       </Row> : null
                   }
                   <Row>
                       <Form onSubmit={handleSubmit}>
                           <InputEntitiesByText onChange={handleChange} entities={entities} />
                           <Tabs activeKey={schemaActiveTab}
                                 transition={false}
                                 id="SchemaTabs"
                                 onSelect={handleTabChange}
                           >
                           <Tab eventKey="BySchema" title="Wikidata schema">
                               <InputWikidataSchema name="Schema"
                                            value={schemaEntity}
                                            handleChange={handleChangeSchemaEntity}
                                            placeholder="E.."
                                            raw="http://www.wikidata.org/wiki/Special:EntitySchemaText/"
                                            stem="https://www.wikidata.org/wiki/EntitySchema:"
                                   />
                            </Tab>
                            <Tab eventKey="ByShExTab" title="ShEx">
                               <ShExTabs activeTab={shEx.shExActiveTab}
                                     handleTabChange={handleShExTabChange}

                                     textAreaValue={shEx.shExTextArea}
                                     handleByTextChange={handleShExByTextChange}

                                     shExUrl={shEx.shExUrl}
                                     handleShExUrlChange={handleShExUrlChange}

                                     handleFileUpload={handleShExFileUpload}

                                     dataFormat={shEx.shExFormat}
                                     handleShExFormatChange={handleShExFormatChange} />
                                </Tab>
                           </Tabs>
                           <InputShapeLabel onChange={setShapeLabel} value={shapeLabel} />
                           <Button variant="primary"
                                   type="submit">Validate wikidata entities</Button>
                       </Form>

                   </Row>
           </Container>
   );
}

export default WikidataValidate;
