import React from "react";
import PropTypes from "prop-types";
import BootstrapTable from "react-bootstrap-table-next";
import { parseData } from "./ParseQueryResult";
import Alert from "react-bootstrap/Alert";
import PrintJson from "../utils/PrintJson";
import API from "../API";

function ResultQuery(props) {
  const result = props.result;
  let msg;
  if (!result || result === "") {
    msg = null;
  } else if (result.result.error) {
    msg = (
      <div>
        <Alert variant="danger">Error: {result.result.error}</Alert>
        {!result.result.error ? (
          <details>
            <PrintJson json={result} />
          </details>
        ) : null}
      </div>
    );
  } else {
    const prefixes = [];
    const table = parseData(result.result, prefixes);
    msg = (
      <div>
        <BootstrapTable
          keyField="_id"
          data={table.rows}
          columns={table.columns}
          bootstrap4
          striped
          hover
          condensed
        />
        <p>{result.msg}</p>
        <details>
          <summary>{API.responseSummaryText}</summary>
          <PrintJson json={result} />
        </details>
      </div>
    );
  }

  return <div>{msg}</div>;
}

ResultQuery.propTypes = {
  result: PropTypes.object.isRequired,
};

export default ResultQuery;
