import React from "react";
import PropTypes from "prop-types";
import BootstrapTable from "react-bootstrap-table-next";
import { parseData } from "./ParseQueryResult";
import Alert from "react-bootstrap/Alert";
import PrintJson from "../utils/PrintJson";
import API from "../API";

function ResultQuery({ result: dataQueryResponse }) {
  // De-structure the server response for convenience
  const { message, result } = dataQueryResponse;

  if (dataQueryResponse) {
    const prefixes = [];
    const table = parseData(result, prefixes);

    return (
      <div>
        <Alert variant="success">{message}</Alert>
        <BootstrapTable
          keyField="_id"
          data={table.rows}
          columns={table.columns}
          bootstrap4
          striped
          hover
          condensed
        />
        <details>
          <summary>{API.responseSummaryText}</summary>
          <PrintJson json={dataQueryResponse} />
        </details>
      </div>
    );
  }
}

ResultQuery.propTypes = {
  result: PropTypes.object.isRequired,
};

export default ResultQuery;
