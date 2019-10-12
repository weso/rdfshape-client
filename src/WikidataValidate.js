import React, { useState, useReducer } from 'react';
import Container from 'react-bootstrap/Container';
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Pace from "react-pace-progress";
import {mkPermalink, params2Form, Permalink} from "./Permalink";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputEntity from "./InputEntity";
import ShExTabs from "./ShExTabs";
import API from "./API"
import {convertTabSchema} from "./Utils";
import axios from "axios";
import Tab from "react-bootstrap/Tab";
import ByText from "./ByText";
import Tabs from "react-bootstrap/Tabs";

function WikidataValidate(props) {

    const initialStatus = { loading: false, error: false, result: null, permalink: null }
    const initialShExStatus = { shExActiveTab: API.defaultTab, shExTextArea: '', shExUrl: '', shExFormat: API.defaultShExFormat} ;
    const [status, dispatch] = useReducer(statusReducer, initialStatus);
    const [entity,setEntity] = useState('');
    const [shEx, dispatchShEx] = useReducer(shExReducer, initialShExStatus);
    const urlServer = API.schemaValidate

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
                return { ...status, shExTextArea: action.value }
            case 'setUrl':
                return { ...status, shExUrl: action.value }
            case 'setFile':
                return { ...status, shExFile: action.value }
            case 'setFormat':
                return { ...status, shExFormat: action.value }
            default:
                return new Error(`shExReducer: unknown action type: ${action.type}`)
        }
    }

    function statusReducer(status,action) {
        switch (action.type) {
            case 'set-loading':
              return { ...status, loading: true, error: false, result: null, permalink: action.permalink };
            case 'set-result':
              return { loading: false, error: false, result: action.data, permalink: action.permalink };
          case 'set-error':
              return { loading: false, error: action.msg, result: null, permalink: action.permalink };
          default: throw new Error(`Unknown action type for statusReducer: ${action.type}`)
        }
    }

    function shapeMapFromEntity(entity) {
       return `<${entity}>@start`;
    }

    function handleSubmit(event) {
        event.preventDefault();
        const paramsShEx = paramsFromShEx(shEx)
        const shapeMap = shapeMapFromEntity(entity)
        const paramsEndpoint = { endpoint: API.wikidataUrl };
        let params = {...paramsEndpoint,...paramsShEx};
        params['schemaEngine']='ShEx';
        params['triggerMode']='shapeMap';
        params['shapeMap']=shapeMap;
        params['shapeMapFormat']='Compact';
        const formData = params2Form(params);
        postValidate(urlServer,formData);
    }

    function postValidate(url, formData, cb) {
        dispatch({type: 'set-loading'} );
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                dispatch({type: 'set-result', result: data })
                if (cb) cb()
            })
            .catch(function (error) {
                dispatch({type: 'set-error', error: `Error: ${error}` })
            });
    }


    function handleShExTabChange(value) { dispatchShEx({ type: 'changeTab', value: value } ); }
    function handleShExFormatChange(value) {  dispatchShEx({type: 'setFormat', value: value }); }
    function handleShExByTextChange(value) { dispatchShEx({type: 'setText', value: value}) }
    function handleShExUrlChange(value) { dispatchShEx({type: 'setUrl', value: value}) }
    function handleShExFileUpload(value) { dispatchShEx({type: 'setFile', value: value}) }



    return (
       <Container>
         <h1>Validate Wikidata entities</h1>
               <Row>
                   { status.result || status.loading || status.error ?
                       <Col>
                           {status.loading ? <Pace color="#27ae60"/> :
                               status.error? <Alert variant="danger">{status.error}</Alert> :
                               status.result ?
                                       <p>{JSON.stringify(status.result)} </p> : null
                           }
                           { status.permalink &&  <Permalink url={status.permalink} /> }
                       </Col> : null
                   }
                   <Col>
                       <Form onSubmit={handleSubmit}>
                           <InputEntity name="Entity"
                                        value={entity}
                                        handleChange={setEntity}
                                        placeholder="Q.."
                                        stem="http://www.wikidata.org/entity/"
                                        raw="http://www.wikidata.org/entity/"
                           />

                           <Tabs activeKey="Schema"
                                 transition={false}
                                 id="SchemaTabs"
                                 onSelect={()=> null}
                           >
                               <Tab eventKey="Schema" title="Wikidata schema">
                                   <InputEntity name="Schema"
                                                value={entity}
                                                handleChange={setEntity}
                                                placeholder="E.."
                                                raw="http://www.wikidata.org/wiki/Special:EntitySchemaText/"
                                                stem="https://www.wikidata.org/wiki/EntitySchema:"
                                   />
                               </Tab>
                               <Tab eventKey="ShExTab" title="ShEx">
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
                           <Button variant="primary"
                                   type="submit">Validate wikidata entities</Button>
                       </Form>
                   </Col>
               </Row>
           </Container>
   );
}

export default WikidataValidate;
