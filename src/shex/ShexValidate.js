import qs from "query-string";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import { useHistory } from "react-router";
import useWebSocket from "react-use-websocket";
import API from "../API";
import PageHeader from "../components/PageHeader";
import { ApplicationContext } from "../context/ApplicationContext";
import {
  getDataText,
  getStreamingDataText,
  InitialDataStream,
  mkDataServerParams,
  mkDataTabs,
  mkStreamDataServerParams,
  paramsFromStateData,
  paramsFromStateStreamData,
  updateStateData,
  updateStateStreamData
} from "../data/Data";
import { mkPermalinkLong } from "../Permalink";
import ResultValidateShex from "../results/ResultValidateShex";
import ResultValidateStream from "../results/ResultValidateStream";
import {
  getShapeMapText,
  InitialShapeMap,
  mkShapeMapTabs,
  mkTriggerModeServerParams,
  paramsFromStateShapeMap,
  updateStateShapeMap
} from "../shapeMap/ShapeMap";
import axios, { rootWsApi } from "../utils/networking/axiosConfig";
import { mkError } from "../utils/ResponseError";
import { curateBooleans, usePrevious } from "../utils/Utils";
import {
  getShexText,
  InitialShex,
  mkShexServerParams,
  mkShexTabs,
  paramsFromStateShex,
  updateStateShex
} from "./Shex";

function ShexValidate(props) {
  // Get all required data from state: data, schema, shapemap
  const {
    rdfData: [ctxData],
    addRdfData,
    shexSchema: ctxShex,
    shapeMap: ctxShapeMap,
    streamingData: ctxStreamingData,
    setStreamingData: setCtxStreamingData,
  } = useContext(ApplicationContext);

  const history = useHistory();

  const [data, setData] = useState(ctxData || addRdfData());
  const [streamData, setStreamData] = useState(
    mkStreamDataInfoFromQs() || ctxStreamingData || InitialDataStream
  );
  const [shex, setShEx] = useState(ctxShex || InitialShex);
  const [shapeMap, setShapeMap] = useState(ctxShapeMap || InitialShapeMap);

  const [currentTab, setCurrentTab] = useState(null);
  // Array of results, instead of single result
  // Streaming validations consist of several results
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permalink, setPermalink] = useState(null);

  const [params, setParams] = useState(null);
  const [lastParams, setLastParams] = useState(null);
  const [serverParams, setServerParams] = useState(null);

  const [progressPercent, setProgressPercent] = useState(0);

  const [disabledLinks, setDisabledLinks] = useState(false);

  const apiValidateUrl = API.routes.server.schemaValidate;

  /* STREAMING VALIDATIONS */

  const wsUrl = rootWsApi + API.routes.server.schemaValidateStream;

  // Shorthand enabled when the current client tab is the Stream one
  const [isStreamingValidation, setIsStreamingValidation] = useState(false);

  // https://github.com/robtaussig/react-use-websocket
  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    readyState: wsReadyState,
    getWebSocket,
  } = useWebSocket(wsUrl, {
    // Should attempt reconnection on all closing events,
    // so that the WS connection is always on standby waiting for commands
    shouldReconnect: (closeEvent) => true,
    reconnectAttempts: 10,
    reconnectInterval: 1800,
    // Action handlers:
    onOpen: () => {
      console.log("WS client Open");
    },
    onError: () => {
      console.log("Errored WS connection...");
      setStreamValidationInProgress(false);
    },
    onClose: (closeEvent) => {
      console.log("Closing WS connection...");

      // Get values from close event
      const { code, reason } = closeEvent;
      // If the close code is one of our custom API codes, set the reason as error
      if (code > 3000 && code < 4999)
        setStreamValidationError(
          `${reason} (WebSocket closed with code ${code})` ||
            API.texts.streamingTexts.unknownError
        );

      // Set state: if the validation is just paused, do not tell the state that it is over
      if (!streamValidationPaused) setStreamValidationInProgress(false);
      // setStreamValidationError();
    },
    onMessage: (msg) => {
      setStreamValidationInProgress(true); // Double check
      try {
        // Get response contents as JSON
        const messageData = JSON.parse(msg.data);
        // Check the response type, separate the contents
        const { type, content } = messageData;
        switch (type) {
          case API.queryParameters.streaming.responseTypes.result:
            // Result received, update result list with it
            setResults([content, ...results]);
            break;
          case API.queryParameters.streaming.responseTypes.error:
            // Stream was stopped, show/handle errors, set state...
            setStreamValidationError(
              content.message || API.texts.streamingTexts.unknownError
            );
            // If a reason is specified, then it was an invalid result that we can still append
            // to the results list
            const reason = content[API.queryParameters.streaming.reason];
            if (reason) setResults([reason, ...results]);
            break;
        }
      } catch (err) {
        console.warn(`Could not parse streaming validation response: ${err}`);
      }
    },
    // Other
    share: false,
  });

  // Functions to stop / kickstart the stream validation with in-memory params
  const stopStreamingValidation = () => {
    getWebSocket().close();
  };
  const startStreamingValidation = async (cancelPrevious = true) => {
    // If a validation is already running, cancel it before invoking a new one
    if (cancelPrevious && streamValidationInProgress) {
      console.log("Closing current WS connection before launching a new one.");
    }

    // Departing from a clean connection:
    setStreamValidationInProgress(true);
    // 1. Send server params to begin the validation
    sendJsonMessage(serverParams);
  };

  // Control variables

  // Errors, status, etc. of the streaming validation, once connection was established
  // A stream validation is taking place
  const [streamValidationInProgress, setStreamValidationInProgress] = useState(
    false
  );
  // The current streaming validation is paused by user, but could resume (starts as false)
  const [streamValidationPaused, setStreamValidationPaused] = useState(false);
  const [streamValidationError, setStreamValidationError] = useState(null);

  // Connection status reference
  // Memoize current connection status
  const connectionStatus = useMemo(() => API.wsStatuses[wsReadyState], [
    wsReadyState,
  ]);

  // Was validation paused before or not?
  const prevPaused = usePrevious(streamValidationPaused);

  // If we receive a change in the paused status, stop or resume the current validation
  // Do not run the resume logic if the component was already running.
  // Similarly, so not run the pause logic if things were already paused.
  useEffect(() => {
    if (streamValidationPaused && !prevPaused) stopStreamingValidation();
    else if (!streamValidationPaused && prevPaused)
      startStreamingValidation(false);
  }, [streamValidationPaused]);

  // If client is in Stream Form tab, update that info
  useEffect(() => {
    setIsStreamingValidation(currentTab === API.sources.byStream);
  }, [currentTab]);

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);

      // Data from URL or default
      const finalData = {
        index: 0,
        ...(updateStateData(queryParams, data) || data),
      };
      setData(finalData);

      // Shex
      const finalShex = updateStateShex(queryParams, shex) || shex;
      setShEx(finalShex);

      // ShapeMap
      const finalShapeMap =
        updateStateShapeMap(queryParams, shapeMap) || shapeMap;
      setShapeMap(finalShapeMap);

      // Streaming data
      const finalStreamData = updateStateStreamData(queryParams, streamData);
      setStreamData(finalStreamData);

      // Confirm it is a streaming validation, taking the query string into accound
      const isStreaming =
        queryParams[API.queryParameters.data.source] === API.sources.byStream;
      setIsStreamingValidation(isStreaming);

      const newParams = mkParams(
        finalData,
        finalShex,
        finalShapeMap,
        finalStreamData,
        isStreaming
      );

      setParams(newParams);
      setLastParams(newParams);
    }
  }, [props.location?.search]);

  // Attempt to parse the query parameters, exclusively for streaming validation data
  function mkStreamDataInfoFromQs() {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      // Streaming data
      return updateStateStreamData(queryParams, InitialDataStream);
    }
  }

  useEffect(() => {
    const fn = async () => {
      if (params) {
        const isStreaming =
          (params[API.queryParameters.data.source] || isStreamingValidation) ===
          API.sources.byStream;
        const dataPresent =
          params[API.queryParameters.data.data] &&
          (params[API.queryParameters.data.source] == API.sources.byFile
            ? params[API.queryParameters.data.data].name
            : true);

        const schemaPresent =
          params[API.queryParameters.schema.schema] &&
          (params[API.queryParameters.schema.source] == API.sources.byFile
            ? params[API.queryParameters.schema.schema].name
            : true);

        const shapeMapPresent =
          params[API.queryParameters.shapeMap.shapeMap] &&
          (params[API.queryParameters.shapeMap.source] == API.sources.byFile
            ? params[API.queryParameters.shapeMap.shapeMap].name
            : true);

        const streamServerPresent = isStreamingValidation
          ? streamData.server.trim().length !== 0
          : true;

        const streamPortPresent = isStreamingValidation
          ? !!streamData.port
          : true;

        const streamTopicPresent = isStreamingValidation
          ? streamData.topic.trim().length !== 0
          : true;

        // No data was provided and a non-stream date is needed
        let error;
        if (!dataPresent && !isStreaming) error = API.texts.noProvidedRdf;
        else if (!schemaPresent) error = API.texts.noProvidedSchema;
        else if (!shapeMapPresent) error = API.texts.noProvidedShapeMap;
        else if (isStreamingValidation) {
          if (!streamServerPresent)
            error = API.texts.streamingTexts.noProvidedServer;
          else if (!streamPortPresent)
            error = API.texts.streamingTexts.noProvidedPort;
          else if (!streamTopicPresent)
            error = API.texts.streamingTexts.noProvidedTopic;
        }

        // No errors found, proceed
        if (error) setError(error);
        else {
          resetState();
          setUpHistory();
          setServerParams(await mkServerParams());
        }
      }
    };
    fn();
  }, [params]);

  // Trigger validation when server params change
  useEffect(() => {
    if (!serverParams) return;
    if (isStreamingValidation) streamValidate();
    else postValidate();
  }, [serverParams]);

  function handleSubmit(event) {
    event.preventDefault();
    setParams(mkParams());
  }

  function mkParams(
    pData = data,
    pShex = shex,
    pShapeMap = shapeMap,
    pStreamData = streamData,
    pIsStreamingValidation = isStreamingValidation
  ) {
    const baseParams = {
      ...paramsFromStateShex(pShex),
      ...paramsFromStateShapeMap(pShapeMap), // + trigger mode
    };

    const dataParams = pIsStreamingValidation
      ? paramsFromStateStreamData(pStreamData)
      : paramsFromStateData(pData);
    return curateBooleans({
      ...baseParams,
      ...dataParams,
    });
  }

  async function mkServerParams(
    pData = data,
    pShex = shex,
    pShapeMap = shapeMap,
    pStreamData = streamData,
    pIsStreamingValidation = isStreamingValidation
  ) {
    const schemaServerParams = await mkShexServerParams(pShex);
    const shapeMapServerParams = await mkTriggerModeServerParams(pShapeMap);
    if (!pIsStreamingValidation) {
      return {
        [API.queryParameters.data.data]: await mkDataServerParams(pData),
        [API.queryParameters.schema.schema]: schemaServerParams,
        [API.queryParameters.schema.triggerMode]: shapeMapServerParams,
      };
    } else
      return mkStreamDataServerParams(
        pStreamData,
        schemaServerParams,
        shapeMapServerParams
      );
  }

  // Branch the logic depending on the type of validation: streaming or not
  async function requestValidation(isStreaming = isStreamingValidation) {
    // Check if we are being requested a streaming validation,
    // based on the active form Tab when the validation is requested
    if (isStreaming) streamValidate();
    else postValidate();
  }

  // WS request for a streaming validation
  // Open WS connection and set permalink
  async function streamValidate() {
    startStreamingValidation();
    setPermalink(
      mkPermalinkLong(API.routes.client.shexValidateRoute, params, true)
    );
    checkLinks();
  }

  // HTTP request for a standard validation
  async function postValidate() {
    // Stop streaming validation, if any
    stopStreamingValidation();

    setLoading(true);
    setProgressPercent(30);

    try {
      const postParams = serverParams;
      const { data: validateResponse } = await axios.post(
        apiValidateUrl,
        postParams
      );
      setProgressPercent(60);

      // Single array result
      setResults([validateResponse]);
      setProgressPercent(80);

      setPermalink(
        mkPermalinkLong(API.routes.client.shexValidateRoute, params, true)
      );
      checkLinks();
    } catch (error) {
      setError(mkError(error, apiValidateUrl));
    } finally {
      setLoading(false);
    }
  }

  // Disabled permalinks, etc. if the user input is too long or a file
  function checkLinks() {
    const dataText = isStreamingValidation
      ? getStreamingDataText(streamData)
      : getDataText(data);

    const disabled =
      dataText.length +
        getShexText(shex).length +
        getShapeMapText(shapeMap).length >
      API.limits.byTextCharacterLimit
        ? API.sources.byText
        : data.activeSource === API.sources.byFile ||
          shex.activeSource === API.sources.byFile ||
          shapeMap.activeSource === API.sources.byFile
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
        mkPermalinkLong(API.routes.client.shexValidateRoute, lastParams)
      );
    }
    // Change current url for shareable links
    history.replace(
      mkPermalinkLong(API.routes.client.shexValidateRoute, params)
    );

    setLastParams(params);
  }

  function resetState() {
    setResults([]);
    setPermalink(null);
    setError(null);
    setStreamValidationError(null);
    setStreamValidationPaused(false);
    // setStreamValidationInProgress(false); Self-managed
    setProgressPercent(0);
  }

  return (
    <Container fluid={true}>
      <Row>
        <PageHeader
          title={API.texts.pageHeaders.shexValidation}
          details={API.texts.pageExplanations.shexValidation}
        />
      </Row>
      <Row>
        <Col className={"half-col border-right"}>
          <Form onSubmit={handleSubmit}>
            {mkDataTabs(data, setData, {
              allowStream: true,
              streamData,
              setStreamData,
              currentTabStore: currentTab,
              setCurrentTabStore: setCurrentTab,
            })}
            <hr />
            {mkShexTabs(shex, setShEx)}
            <hr />
            {mkShapeMapTabs(shapeMap, setShapeMap)}
            <hr />
            <Button
              variant="primary"
              type="submit"
              className={"btn-with-icon " + (loading ? "disabled" : "")}
              disabled={loading}
            >
              {API.texts.actionButtons.validate}
            </Button>
          </Form>
        </Col>
        {loading || results || permalink || error ? (
          <Col className={"half-col"}>
            {loading ? (
              <ProgressBar
                className="width-100"
                striped
                animated
                variant="info"
                now={progressPercent}
              />
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : streamValidationError ||
              streamValidationInProgress ||
              streamValidationPaused ? (
              <ResultValidateStream
                results={results}
                error={streamValidationError}
                config={serverParams}
                paused={streamValidationPaused}
                setPaused={setStreamValidationPaused}
                permalink={permalink}
                disabled={disabledLinks}
              />
            ) : results.length && !streamValidationError ? (
              <ResultValidateShex
                result={results[0]}
                permalink={permalink}
                disabled={disabledLinks}
              />
            ) : (
              <>
                {console.log("RESULTS: " + results.length)}
                {console.log("IN PROGRESS: " + streamValidationInProgress)}
                {console.log("PAUSED: " + streamValidationPaused)}
                <p>Fallback</p>
              </>
            )}
          </Col>
        ) : (
          <Col className={"half-col"}>
            <Alert variant="info">
              {API.texts.validationResultsWillAppearHere}
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default ShexValidate;
