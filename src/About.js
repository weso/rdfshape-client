import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import API from "./API";
import environmentConfiguration from "./EnvironmentConfig";
import PrintJson from "./utils/PrintJson";

function About() {
  const [status, setStatus] = useState({ msg: `Asking info to server` });

  useEffect(() => {
    const url = API.routes.server.health;
    setStatus({
      msg: `Requesting server status to ${API.routes.server.health}`,
    });
    axios
      .get(url)
      .then((response) => response.data)
      .then((data) => {
        setStatus({ msg: data });
      })
      .catch((error) => {
        setStatus({
          msg: `${error}. Server address: ${API.routes.server.health}`,
          error: error,
        });
      });
  }, []);

  return (
    <Container>
      <h1>About RDFShape</h1>
      <p>
        RDFShape offers an RDF playground which can be used to teach RDF related
        technologies
      </p>
      <p>
        Paper describing RDFShape:{" "}
        <a href="http://ceur-ws.org/Vol-2180/paper-35.pdf">
          RDFShape: An RDF playground based on Shapes
        </a>
        , <a href="http://labra.weso.es">Jose Emilio Labra Gayo</a>, Daniel
        Fernández Álvarez, Herminio García González, Demo presented at{" "}
        <a href="http://iswc2018.semanticweb.org/">
          International Semantic Web Conference
        </a>
        , Monterey, California - 2018
      </p>
      <ul>
        <li>
          RDFShape Client {environmentConfiguration.appVersion} [
          {process.env.NODE_ENV}]
        </li>
        <li>Server host: {environmentConfiguration.apiHost}</li>
        {/*                   <li>Built with <a href="http://www.scala-lang.org/">Scala</a> and <a href="http://www.scala-sbt.org/">SBT</a></li> */}
        <li>
          Source code:
          <ul>
            <li>
              <a href="https://github.com/weso/rdfshape-client">Client</a>
            </li>
            <li>
              <a href="https://github.com/weso/rdfshape">Server</a>
            </li>
            <li>
              <a href="https://github.com/weso/shaclex">Validation libraries</a>
            </li>
          </ul>
        </li>
        <li>
          Project <a href="https://www.weso.es/rdfshape-api/">webpage</a> and{" "}
          <a href="https://github.com/weso/rdfshape/">repository</a>
        </li>
        <li>
          <a href="http://book.validatingrdf.com">"Validating RDF Data" book</a>
        </li>
      </ul>
      <details>
        <summary>{API.texts.serverStatus}</summary>
        <p style={{ marginLeft: "15px" }}>
          {API.texts.misc.address}: <code>{API.routes.server.root}</code>
          <br />
          {API.texts.misc.status}: <code>{status.msg}</code>
          {status.error && (
            <details>
              <summary>{API.texts.errorDetails}</summary>
              <PrintJson json={status.error} />
            </details>
          )}
        </p>
      </details>
      <br />
      <h2>{API.texts.misc.authors}</h2>
      <ul>
        <li>
          <a href="http://labra.weso.es">Jose Emilio Labra Gayo</a> (
          <a href="http://www.weso.es">{API.texts.misc.wesoGroup}</a>)
        </li>
        <li>
          <a href="https://github.com/ulitol97">Eduardo Ulibarri Toledo</a> (
          <a href="http://www.weso.es">{API.texts.misc.wesoGroup}</a>)
        </li>
        <li>
          <a href="https://github.com/mistermboy">Pablo Menéndez Suárez</a> (
          <a href="http://www.weso.es">{API.texts.misc.wesoGroup}</a>)
        </li>
      </ul>
    </Container>
  );
}

export default About;
