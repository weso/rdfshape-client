import qs from "query-string";
import React, { useContext, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import { useHistory } from "react-router";
import API from "../API";
import PageHeader from "../components/PageHeader";
import SelectFormat from "../components/SelectFormat";
import { ApplicationContext } from "../context/ApplicationContext";
import { mkPermalinkLong } from "../Permalink";
import ResultDataConvert from "../results/ResultDataConvert";
import axios from "../utils/networking/axiosConfig";
import { mkError } from "../utils/ResponseError";
import {
  getDataText,
  mkDataServerParams,
  mkDataTabs,
  paramsFromStateData,
  updateStateData
} from "./Data";

function DataConvert(props) {
  const {
    rdfData: [ctxData],
    addRdfData,
  } = useContext(ApplicationContext);

  const history = useHistory();

  const [data, setData] = useState(ctxData || addRdfData());
  const [dataTargetFormat, setDataTargetFormat] = useState(
    API.formats.defaultData
  );
  const [result, setResult] = useState("");

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);

  const [permalink, setPermalink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  const url = API.routes.server.dataConvert;

  function handleTargetDataFormatChange(value) {
    value && setDataTargetFormat(value);
  }

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      if (queryParams[API.queryParameters.data.data]) {
        const finalData = {
          index: 0,
          ...(updateStateData(queryParams, data) || data),
        };
        setData(finalData);

        if (queryParams[API.queryParameters.data.targetFormat]) {
          setDataTargetFormat(
            queryParams[API.queryParameters.data.targetFormat]
          );
        }

        const params = mkParams(
          finalData,
          queryParams[API.queryParameters.data.targetFormat] || dataTargetFormat
        );

        setParams(params);
        setLastParams(params);
      } else {
        setError(API.texts.errorParsingUrl);
      }
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params) {
      if (
        params[API.queryParameters.data.data] &&
        (params[API.queryParameters.data.source] == API.sources.byFile
          ? params[API.queryParameters.data.data].name
          : true) // Extra check for files
      ) {
        resetState();
        setUpHistory();
        postConvert();
      } else {
        setError(API.texts.noProvidedRdf);
      }
    }
  }, [params]);

  function handleSubmit(event) {
    event.preventDefault();
    setParams(mkParams());
  }

  function mkParams(pData = data, pTargetFormat = dataTargetFormat) {
    return {
      ...paramsFromStateData(pData),
      [API.queryParameters.data.targetFormat]: pTargetFormat,
    };
  }

  async function mkServerParams(
    pData = data,
    pTargetFormat = dataTargetFormat
  ) {
    return {
      [API.queryParameters.data.data]: await mkDataServerParams(pData),
      [API.queryParameters.targetFormat]: pTargetFormat,
    };
  }

  async function postConvert() {
    setLoading(true);
    setProgressPercent(20);

    try {
      const postParams = await mkServerParams();
      const { data: convertResponse } = await axios.post(url, postParams);

      setProgressPercent(70);
      setResult(convertResponse);

      setPermalink(
        mkPermalinkLong(API.routes.client.dataConvertRoute, params, true)
      );
      checkLinks();
    } catch (error) {
      setError(mkError(error, url));
    } finally {
      setLoading(false);
    }
  }

  // Disabled permalinks, etc. if the user input is too long or a file
  function checkLinks() {
    const disabled =
      getDataText(data).length > API.limits.byTextCharacterLimit
        ? API.sources.byText
        : data.activeSource === API.sources.byFile
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
      history.push(
        mkPermalinkLong(API.routes.client.dataConvertRoute, lastParams)
      );
    }
    // Change current url for shareable links
    history.replace(
      mkPermalinkLong(API.routes.client.dataConvertRoute, params)
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
        <PageHeader
          title={API.texts.pageHeaders.dataConversion}
          details={API.texts.pageExplanations.dataConversion}
        />
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkDataTabs(data, setData)}
            <hr />
            <SelectFormat
              name="Target data format"
              selectedFormat={dataTargetFormat}
              handleFormatChange={handleTargetDataFormatChange}
              urlFormats={API.routes.server.dataFormatsOutput}
            />
            <Button
              variant="primary"
              type="submit"
              className={"btn-with-icon " + (loading ? "disabled" : "")}
              disabled={loading}
            >
              {API.texts.actionButtons.convert}
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
                now={progressPercent}
              />
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : result ? (
              <ResultDataConvert
                result={result}
                permalink={permalink}
                disabled={disabledLinks}
              />
            ) : null}
          </Col>
        ) : (
          <Col className={"half-col"}>
            <Alert variant="info">
              {API.texts.conversionResultsWillAppearHere}
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default DataConvert;
