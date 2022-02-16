import PropTypes from "prop-types";
import React, { useContext, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import API from "../API";
import { ApplicationContext } from "../context/ApplicationContext";

function EndpointInput({ endpoint, handleOnChange, handleOnSelect }) {
  const {
    sparqlEndpoint: ctxEndpoint,
    setSparqlEndpoint: setCtxEndpoint,
  } = useContext(ApplicationContext);

  // Endpoints shown on dropdown list
  const exampleEndpoints = [
    { name: "wikidata", url: API.routes.utils.wikidataUrl },
    { name: "dbpedia", url: API.routes.utils.dbpediaUrl },
  ];

  useEffect(() => {
    setCtxEndpoint(endpoint);
  }, [endpoint]);

  function onChange(e) {
    e.preventDefault();
    handleOnChange && handleOnChange(e.target.value);
  }

  function onSelect(e) {
    handleOnSelect && handleOnSelect(e);
    handleOnChange(e);
  }

  return (
    <Form.Group id="common-endpoints">
      <Form.Label>Endpoint</Form.Label>
      <Form.Control
        type="url"
        placeholder={API.texts.placeholders.url}
        value={endpoint || ctxEndpoint}
        onChange={onChange}
      />
      <Dropdown onSelect={onSelect}>
        <DropdownButton
          alignRight
          title={API.texts.endpoints.commonEndpoints}
          id="select-endpoint"
        >
          {exampleEndpoints.map((endpoint, index) => (
            <Dropdown.Item key={index} eventKey={endpoint.url}>
              {endpoint.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </Dropdown>
    </Form.Group>
  );
}

EndpointInput.propTypes = {
  endpoint: PropTypes.string.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  handleOnSelect: PropTypes.func,
};

export default EndpointInput;
