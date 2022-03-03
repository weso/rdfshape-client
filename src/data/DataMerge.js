import qs from "query-string";
import React, { useContext, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import API from "../API";
import PageHeader from "../components/PageHeader";
import SelectFormat from "../components/SelectFormat";
import { ApplicationContext } from "../context/ApplicationContext";
import { mkPermalinkLong } from "../Permalink";
import ResultDataMerge from "../results/ResultDataMerge";
import axios from "../utils/networking/axiosConfig";
import { mkError } from "../utils/ResponseError";
import { getFileContents } from "../utils/Utils";
import {
  getDataText,
  mkDataServerParams,
  mkDataTabs,
  paramsFromStateData,
  updateStateData
} from "./Data";

function DataMerge(props) {
  // Recover user input data from context, if any. Use 2 items of the data array
  const { rdfData: rdfDataSet, addRdfData } = useContext(ApplicationContext);
  const [ctxData1, ctxData2] = rdfDataSet;

  const [data1, setData1] = useState(ctxData1 || addRdfData());
  const [data2, setData2] = useState(ctxData2 || addRdfData());

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
          const newData1 = {
            index: 0,
            ...(updateStateData(contents[0], data1) || data1),
          };
          const newData2 = {
            index: 1,
            ...(updateStateData(contents[1], data2) || data2),
          };

          setData1(newData1);
          setData2(newData2);

          const params = mkParams(
            newData1,
            newData2,
            queryParams[API.queryParameters.data.targetFormat] ||
              dataTargetFormat
          );
          setParams(params);
          setLastParams(params);
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
      if (parameters.every((p) => p[API.queryParameters.data.data])) {
        // Check if some data was uploaded
        resetState();
        setUpHistory();
        postMerge();
      } else {
        setError(API.texts.noProvidedRdf);
      }
    }
  }, [params]);

  async function handleSubmit(event) {
    event.preventDefault();
    setParams(mkParams());
  }

  function mkParams(
    pData1 = data1,
    pData2 = data2,
    pTargetFormat = dataTargetFormat
  ) {
    const finalDataParams = [
      paramsFromStateData(pData1),
      paramsFromStateData(pData2),
    ];

    return {
      [API.queryParameters.data.compound]: JSON.stringify(finalDataParams),
      [API.queryParameters.data.targetFormat]: pTargetFormat,
    };
  }

  async function mkServerParams(
    pData1 = data1,
    pData2 = data2,
    pTargetFormat = dataTargetFormat
  ) {
    const dataItems = [pData1, pData2];
    // Check for invalid files first
    if (
      dataItems.some(
        (it) => it.activeSource === API.sources.byFile && !it.file?.name
      )
    )
      return;

    return {
      [API.queryParameters.data.data]: {
        [API.queryParameters.content]: [
          await mkDataServerParams(pData1),
          await mkDataServerParams(pData2),
        ],
        [API.queryParameters.source]: API.sources.byCompound,
      },
      [API.queryParameters.targetFormat]: pTargetFormat,
    };
  }

  async function postMerge() {
    setLoading(true);
    setProgressPercent(25);

    try {
      const postParams = await mkServerParams();
      // Early detection of invalid files
      if (!postParams) {
        resetState();
        setError(API.texts.noProvidedRdf);
        return;
      }

      setProgressPercent(40);
      const { data: serverMergeResponse } = await axios.post(url, postParams);
      setProgressPercent(80);

      setResult(serverMergeResponse);

      setPermalink(mkPermalinkLong(API.routes.client.dataMergeRoute, params));
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
    setLoading(false);
    setProgressPercent(0);
  }

  return (
    <Container fluid={true}>
      <Row>
        <PageHeader
          title={API.texts.pageHeaders.dataMerge}
          details={API.texts.pageExplanations.dataMerge}
        />
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
              {API.texts.actionButtons.merge}
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
              <ResultDataMerge
                result={result}
                fromParams={data1.fromParams}
                resetFromParams={() => {
                  setData1({ ...data1, fromParams: false });
                  setData2({ ...data2, fromParams: false });
                }}
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

// Make the "fake" params used to implement File uploads. More info below.
export async function mkCompoundParams(data1Params, data2Params, targetFormat) {
  const dataItems = [data1Params, data2Params];
  // Check for invalid file parameters first
  if (
    dataItems.some(
      (it) => it.activeSource === API.sources.byFile && !it.file?.name
    )
  )
    return;

  const finalDataParams = dataItems
    .map(paramsFromStateData)
    .filter((it) => !!it[API.queryParameters.data.data]); // Do not include empty data in the array

  // We upload to the server all the data items after applying JSON.stringify.
  // This destroys data items uploaded by file, thus:
  // 1- If any data item is uploaded by File, extract file contents as raw text
  // 2- In the API request, change the source to byText and the contents to the text to
  // pretend it is a raw text upload

  for (const it of finalDataParams) {
    if (it[API.queryParameters.data.source] === API.sources.byFile) {
      it[API.queryParameters.data.source] = API.sources.byText;
      it[API.queryParameters.data.data] = await getFileContents(
        it[API.queryParameters.data.data]
      );
    }
  }

  return {
    [API.queryParameters.data.compound]: JSON.stringify(finalDataParams),
    [API.queryParameters.data.targetFormat]: targetFormat,
  };
}
