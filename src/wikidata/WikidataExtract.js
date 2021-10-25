import axios from "axios";
import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Pace from "react-pace-progress";
import API from "../API";
import InputEntitiesByText from "../components/InputEntitiesByText";
import { mkPermalinkLong, params2Form, Permalink } from "../Permalink";
import ResultDataExtract from "../results/ResultDataExtract";
import { mkError } from "../utils/ResponseError";

function WikidataExtract(props) {
  const [entities, setEntities] = useState([]);
  const [permalink, setPermalink] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(es) {
    setEntities(es);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const url = API.dataExtract;
    let params = {};
    params["endpoint"] = API.wikidataUrl;
    if (entities.length > 0 && entities[0].uri) {
      const nodeSelector = entities[0].uri;
      params["nodeSelector"] = "<" + nodeSelector + ">";
      console.info(`Node selector: ${nodeSelector}`);
      setPermalink(mkPermalinkLong(API.dataExtractRoute, params));
      let formData = params2Form(params);
      postConvert(url, formData);
    } else {
      setError(`No entities selected`);
    }
  }

  function postConvert(url, formData, cb) {
    setLoading(true);
    axios
      .post(url, formData)
      .then((response) => response.data)
      .then((data) => {
        setResult(data);
        if (cb) cb();
      })
      .catch(function(error) {
        setError(mkError(error, url));
      })
      .finally(() => setLoading(false));
  }

  return (
    <Container>
      <h1>Extract schema from Wikidata entities</h1>
      <InputEntitiesByText onChange={handleChange} entities={entities} />
      <Table>
        {entities.map((e) => (
          <tr>
            <td>{e.label}</td>
            <td>{e.uri}</td>
            <td>{e.descr}</td>
          </tr>
        ))}
      </Table>
      <Form onSubmit={handleSubmit}>
        <Button variant="primary" type="submit">
          Extract Schema
        </Button>
      </Form>
      {loading ? <Pace color="#27ae60" /> : null}
      {error ? <Alert variant="danger">{error}</Alert> : null}
      <ResultDataExtract result={result} />
      {permalink ? <Permalink url={permalink} /> : null}
    </Container>
  );
}

export default WikidataExtract;
