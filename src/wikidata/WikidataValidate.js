import axios from "axios";
import React, { useReducer, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Pace from "react-pace-progress";
import API from "../API";
import InputEntitiesByText from "../components/InputEntitiesByText";
import InputShapeLabel from "../components/InputShapeLabel";
import InputWikidataSchema from "../components/InputWikidataSchema";
import { mkPermalinkLong, params2Form, Permalink } from "../Permalink";
import ResultValidate from "../results/ResultValidate";
import { paramsFromStateShex } from "../shex/Shex";
import ShExTabs from "../shex/ShexTabs";
import { mkError } from "../utils/ResponseError";

function WikidataValidate(props) {
  const initialStatus = {
    loading: false,
    error: false,
    result: null,
    permalink: null,
  };
  const initialShExStatus = {
    shExActiveSource: API.sources.default,
    shExTextArea: "",
    shExUrl: "",
    shExFormat: API.formats.defaultShex,
  };

  const [status, dispatch] = useReducer(statusReducer, initialStatus);
  const [entities, setEntities] = useState([]);

  const [schemaEntity, setSchemaEntity] = useState("");
  const [schemaActiveSource, setSchemaActiveSource] = useState(
    API.sources.bySchema
  );
  const [shEx, dispatchShEx] = useReducer(shExReducer, initialShExStatus);
  const [shapeLabel, setShapeLabel] = useState("");
  const url = API.routes.server.schemaValidate;
  const [permalink, setPermalink] = useState(null);

  function handleChange(es) {
    setEntities(es);
  }

  function handleChangeSchemaEntity(e) {
    dispatchShEx({ type: "setUrl", value: e });
    setSchemaEntity(e);
  }

  function shExReducer(status, action) {
    switch (action.type) {
      case "changeTab":
        return { ...status, shExActiveSource: action.value };
      case "setText":
        return {
          ...status,
          shExActiveSource: API.sources.byText,
          shExTextArea: action.value,
        };
      case "setUrl":
        return {
          ...status,
          shExActiveSource: API.sources.byUrl,
          shExUrl: action.value,
        };
      case "setFile":
        return {
          ...status,
          shExActiveSource: API.sources.byFile,
          shExFile: action.value,
        };
      case "setFormat":
        return { ...status, shExFormat: action.value };
      default:
        return new Error(`shExReducer: unknown action type: ${action.type}`);
    }
  }

  function statusReducer(status, action) {
    switch (action.type) {
      case "set-loading":
        return { ...status, loading: true, error: false, result: null };
      case "set-result":
        console.info(
          `statusReducer: set-result: ${JSON.stringify(action.value)}`
        );
        return { loading: false, error: false, result: action.value };
      case "set-error":
        return { loading: false, error: action.value, result: null };
      default:
        throw new Error(
          `Unknown action type for statusReducer: ${action.type}`
        );
    }
  }

  function shapeMapFromEntities(entities, shapeLabel) {
    const shapeMap = entities.map((e) => `<${e.uri}>@${shapeLabel}`).join(",");
    return shapeMap;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const paramsShEx = paramsFromStateShex(shEx);
    const shapeMap = shapeMapFromEntities(entities, shapeLabel);
    const paramsEndpoint = { endpoint: API.routes.utils.wikidataUrl };
    let params = { ...paramsEndpoint, ...paramsShEx };
    params[API.queryParameters.schema.engine] = API.engines.shex;
    params[API.queryParameters.schema.triggerMode] = API.triggerModes.shapeMap;
    params[API.queryParameters.shapeMap.shapeMap] = shapeMap;
    params[API.queryParameters.shapeMap.format] = API.formats.compact;
    const formData = params2Form(params);
    setPermalink(
      mkPermalinkLong(API.routes.client.wikidataValidateRoute, params)
    );
    postValidate(url, formData);
  }

  function postValidate(url, formData, cb) {
    dispatch({ type: "set-loading" });
    axios
      .post(url, formData)
      .then((response) => response.data)
      .then((data) => {
        dispatch({ type: "set-result", value: data });
        if (cb) cb();
      })
      .catch(function(error) {
        dispatch({ type: "set-error", value: error });
      });
  }

  function handleShExTabChange(value) {
    dispatchShEx({ type: "changeTab", value: value });
  }
  function handleShExFormatChange(value) {
    dispatchShEx({ type: "setFormat", value: value });
  }
  function handleShExByTextChange(value) {
    dispatchShEx({ type: "setText", value: value });
  }
  function handleShExUrlChange(value) {
    dispatchShEx({ type: "setUrl", value: value });
  }
  function handleShExFileUpload(value) {
    dispatchShEx({ type: "setFile", value: value });
  }

  function handleTabChange(e) {
    setSchemaActiveSource(e);
  }

  return (
    <Container>
      <h1>Validate Wikidata entities</h1>
      {status.result || status.loading || status.error ? (
        <Row>
          {status.loading ? (
            <Pace color="#27ae60" />
          ) : status.error ? (
            <Alert variant="danger">{mkError(status.error, url)}</Alert>
          ) : status.result ? (
            <ResultValidate result={status.result} />
          ) : null}
          {permalink && (
            <Col>
              <Permalink url={permalink} />{" "}
            </Col>
          )}
        </Row>
      ) : null}
      <Row>
        <Form onSubmit={handleSubmit}>
          <InputEntitiesByText onChange={handleChange} entities={entities} />
          <Tabs
            activeKey={schemaActiveSource}
            transition={false}
            id="SchemaTabs"
            onSelect={handleTabChange}
          >
            <Tab eventKey="BySchema" title="Wikidata schema">
              <InputWikidataSchema
                name="Schema"
                value={schemaEntity}
                handleChange={handleChangeSchemaEntity}
                placeholder="E.."
                raw="http://www.wikidata.org/wiki/Special:EntitySchemaText/"
                stem="https://www.wikidata.org/wiki/EntitySchema:"
              />
            </Tab>
            <Tab eventKey="ByShExTab" title="ShEx">
              <ShExTabs
                activeSource={shEx.shExActiveSource}
                handleTabChange={handleShExTabChange}
                textAreaValue={shEx.shExTextArea}
                handleByTextChange={handleShExByTextChange}
                shExUrl={shEx.shExUrl}
                handleShExUrlChange={handleShExUrlChange}
                handleFileUpload={handleShExFileUpload}
                dataFormat={shEx.shExFormat}
                handleShExFormatChange={handleShExFormatChange}
              />
            </Tab>
          </Tabs>
          <InputShapeLabel onChange={setShapeLabel} value={shapeLabel} />
          <Button variant="primary" type="submit">
            Validate wikidata entities
          </Button>
        </Form>
      </Row>
    </Container>
  );
}

export default WikidataValidate;
