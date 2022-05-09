import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { InputGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import API from "../API";
import { ApplicationContext } from "../context/ApplicationContext";
import { InitialDataStream } from "../data/Data";
import { curateBoolean } from "../utils/Utils";

// Form asking for/updating the input data stream information
function ByStream({ streamValue: stream, handleStreamChange }) {
  // Get all required data from state: data, schema, shapemap
  const { streamingData: ctxStreamingData } = useContext(ApplicationContext);

  // In-state stream data
  const [streamData, setStreamData] = useState({
    ...InitialDataStream,
    ...stream,
  });

  // Generic change handler for all inputs,
  // resorts to the props' handleChange implementation,
  // passing down the changed fields
  const handleChange = (changedProps) => {
    setStreamData({ ...streamData, ...changedProps });
  };

  // Call the upper change handler on Form changes
  useEffect(() => {
    handleStreamChange(streamData);
  }, [streamData]);

  return (
    <div className="marginTop">
      {/* Server name, port, topic */}
      <InputGroup className="mb-2">
        <Form.Group controlId="streamServer">
          <Form.Label>Server</Form.Label>
          <Form.Control
            type="text"
            placeholder="localhost"
            value={streamData.server}
            onChange={(e) => {
              handleChange({ server: e.target.value });
            }}
          />
        </Form.Group>
      </InputGroup>
      <InputGroup className="mb-2">
        <Form.Group controlId="streamPort">
          <Form.Label>Port</Form.Label>
          <Form.Control
            type="number"
            placeholder={API.kafkaBaseValues.port}
            min={1024}
            max={65535}
            value={streamData.port}
            onChange={(e) => handleChange({ port: e.target.value })}
          />
        </Form.Group>
      </InputGroup>
      <InputGroup>
        <Form.Group className="mb-3" controlId="streamTopic">
          <Form.Label>Topic</Form.Label>
          <Form.Control
            type="text"
            placeholder="my-kafka-topic"
            value={streamData.topic}
            onChange={(e) => handleChange({ topic: e.target.value })}
          />
        </Form.Group>
      </InputGroup>

      {/* Validator settings */}
      <InputGroup>
        <Form.Group>
          <Form.Check
            type="switch"
            id="haltInvalidCheck"
            label={API.texts.streamingTexts.haltOnInvalid}
            checked={curateBoolean(streamData.haltOnInvalid)}
            onChange={(e) => handleChange({ haltOnInvalid: e.target.checked })}
          />
          <Form.Check
            type="switch"
            id="haltErroredCheck"
            label={API.texts.streamingTexts.haltOnErrored}
            checked={curateBoolean(streamData.haltOnErrored)}
            onChange={(e) => handleChange({ haltOnErrored: e.target.checked })}
          />
        </Form.Group>
      </InputGroup>
    </div>
  );
}

ByStream.propTypes = {
  name: PropTypes.string.isRequired,
  streamValue: PropTypes.object.isRequired,
  handleStreamChange: PropTypes.func.isRequired,
};

ByStream.defaultProps = {
  name: "",
};

export default ByStream;
