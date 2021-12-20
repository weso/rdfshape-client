import PropTypes from "prop-types";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import API from "../API";

function EndpointInput({ value, handleOnChange, handleOnSelect }) {
  const endpoints = [
    { name: "wikidata", url: API.routes.utils.wikidataUrl },
    { name: "dbpedia", url: API.routes.utils.dbpediaUrl },
  ];

  const dropDownItems = endpoints.map((endpoint, index) => (
    <Dropdown.Item key={index} eventKey={endpoint.url}>
      {endpoint.name}
    </Dropdown.Item>
  ));

  function onChange(e) {
    handleOnChange(e.target.value);
  }

  function onSelect(e) {
    handleOnSelect && handleOnSelect();
    handleOnChange(e);
  }

  return (
    <Form.Group id="common-endpoints">
      <Form.Label>Endpoint</Form.Label>
      <Form.Control
        as="input"
        type="url"
        placeholder={API.texts.placeholders.url}
        value={value}
        onChange={onChange}
      />
      <Dropdown onSelect={onSelect}>
        <DropdownButton
          alignRight
          title="Common endpoints"
          id="select-endpoint"
        >
          {dropDownItems}
        </DropdownButton>
      </Dropdown>
    </Form.Group>
  );
}

EndpointInput.propTypes = {
  value: PropTypes.string.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  handleOnSelect: PropTypes.func,
};

export default EndpointInput;
