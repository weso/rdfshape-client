import axios from "axios";
import qs from "query-string";
import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import API from "../API";
import SelectFormat from "../components/SelectFormat";
import { mkPermalinkLong, params2Form } from "../Permalink";
import ResultDataConvert from "../results/ResultDataConvert";
import { mkError } from "../utils/ResponseError";
import {
  getDataText,
  InitialData,
  mkDataTabs,
  paramsFromStateData,
  updateStateData
} from "./Data";

function DataMerge(props) {
  const [data1, setData1] = useState(InitialData);
  const [data2, setData2] = useState(InitialData);
  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);
  const [dataTargetFormat, setDataTargetFormat] = useState(
    API.formats.defaultData
  );
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permalink, setPermalink] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  const url = API.routes.server.dataConvert;

  function handleTargetDataFormatChange(value) {
    setDataTargetFormat(value);
  }

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);

      if (queryParams[API.queryParameters.data.targetFormat]) {
        setDataTargetFormat(queryParams[API.queryParameters.data.targetFormat]);
      }

      if (queryParams[[API.queryParameters.data.compound]]) {
        try {
          const contents = JSON.parse(
            queryParams[API.queryParameters.data.compound]
          );
          const newData1 = updateStateData(contents[0], data1) || data1;
          const newData2 = updateStateData(contents[1], data2) || data2;

          setData1(newData1);
          setData2(newData2);

          setParams(queryParams);
          setLastParams(queryParams);
        } catch {
          setError(API.texts.errorParsingUrl);
        }
      } else {
        setError(API.texts.errorParsingUrl);
      }
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params && params[API.queryParameters.data.compound]) {
      const parameters = JSON.parse(params[API.queryParameters.data.compound]);
      if (
        parameters.some(
          (p) => p[API.queryParameters.data.source] == API.sources.byFile
        )
      ) {
        setError("Not implemented Merge from files.");
      } else if (
        parameters.some(
          (p) =>
            p[API.queryParameters.data.data] &&
            (p[API.queryParameters.data.source] == API.sources.byFile
              ? params[API.queryParameters.data.data].name
              : true) // Extra check for files
        )
      ) {
        // Check if some data was uploaded
        resetState();
        setUpHistory();
        postMerge();
      } else {
        setError(API.texts.noProvidedRdf);
      }
      window.scrollTo(0, 0);
    }
  }, [params]);

  async function handleSubmit(event) {
    event.preventDefault();
    // Combine params
    setParams({
      [API.queryParameters.data.compound]: JSON.stringify([
        paramsFromStateData(data1),
        paramsFromStateData(data2),
      ]),
      [API.queryParameters.data.targetFormat]: dataTargetFormat,
    });
  }

  function postMerge(cb) {
    setLoading(true);
    setProgressPercent(15);

    const formData = params2Form(params);
    setProgressPercent(35);

    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        setProgressPercent(75);
        setResult(data);
        setPermalink(mkPermalinkLong(API.routes.client.dataMergeRoute, params));
        setProgressPercent(90);
        checkLinks();
        if (cb) cb();
        setProgressPercent(100);
      })
      .catch(function(error) {
        setError(mkError(error, url));
      })
      .finally(() => {
        setLoading(false);
        window.scrollTo(0, 0); // Scroll top to results
      });
  }

  // Disabled permalinks, etc. if the user input is too long or a file
  function checkLinks() {
    const disabled =
      getDataText(data1).length + getDataText(data2).length >
      API.limits.byTextCharacterLimit
        ? API.sources.byText
        : data1.activeSource === API.sources.byFile ||
          data2.activeSource === API.sources.byFile
        ? API.sources.byFile
        : false;

    setDisabledLinks(disabled);
  }

  function setUpHistory() {
    // Store the last search URL in the browser history to allow going back
    if (
      params &&
      lastParams &&
      JSON.stringify(params) !== JSON.stringify(lastParams)
    ) {
      // eslint-disable-next-line no-restricted-globals
      history.pushState(
        null,
        document.title,
        mkPermalinkLong(API.routes.client.dataMergeRoute, {
          [API.queryParameters.data.compound]:
            lastParams[API.queryParameters.data.compound],
          [API.queryParameters.data.targetFormat]: dataTargetFormat,
        })
      );
    }
    // Change current url for shareable links
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(
      null,
      document.title,
      mkPermalinkLong(API.routes.client.dataMergeRoute, {
        [API.queryParameters.data.compound]:
          params[API.queryParameters.data.compound],
        [API.queryParameters.data.targetFormat]: dataTargetFormat,
      })
    );

    setLastParams(params);
  }

  function resetState() {
    setResult(null);
    setPermalink(null);
    setError(null);
    setProgressPercent(0);
  }

  return (
    <Container fluid={true}>
      <Row>
        <h1>{API.texts.pageHeaders.dataMergeConvert}</h1>
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkDataTabs(data1, setData1, "RDF input (1)")}
            <hr />
            {mkDataTabs(data2, setData2, "RDF input (2)")}
            <hr />
            <SelectFormat
              name="Target data format"
              selectedFormat={dataTargetFormat}
              handleFormatChange={handleTargetDataFormatChange}
              urlFormats={API.routes.server.dataFormatsOutput}
            />
            <Button
              id="submit"
              variant="primary"
              type="submit"
              className={"btn-with-icon " + (loading ? "disabled" : "")}
              disabled={loading}
            >
              Merge
            </Button>
          </Form>
        </Col>
        {loading || result || error || permalink ? (
          <Col className={"half-col"}>
            {loading ? (
              <ProgressBar
                striped
                animated
                variant="info"
                fromParams
                now={progressPercent}
              />
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : result ? (
              <ResultDataConvert
                result={result}
                fromParams={data1.fromParams}
                resetFromParams={() =>
                  setData1({ ...data1, fromParams: false })
                }
                permalink={permalink}
                disabled={disabledLinks}
              />
            ) : null}
          </Col>
        ) : (
          <Col className={"half-col"}>
            <Alert variant="info">{API.texts.mergeResultsWillAppearHere}</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default DataMerge;
