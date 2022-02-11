import PropTypes from "prop-types";
import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  CSVExport,
  Search
} from "react-bootstrap-table2-toolkit";
import DataTransferDownloadIcon from "react-open-iconic-svg/dist/DataTransferDownloadIcon";
import { showQualified, showQualify, sortCaretGen } from "../utils/Utils";

/* Converts SPARQL representation to Turtle representation */
function cnvValueFromSPARQL(sparqlVal) {
  const { value, type } = sparqlVal;
  switch (type) {
    case "uri":
      return `<${value}>`;
    case "literal":
      if (sparqlVal.datatype) {
        switch (sparqlVal.datatype) {
          case "http://www.w3.org/2001/XMLSchema#integer":
            return `${value}`;
          case "http://www.w3.org/2001/XMLSchema#decimal":
            return `${value}`;
          default:
            return `"${value}"^^${sparqlVal.datatype}`;
        }
      }
      if (sparqlVal["xml:lang"]) return `"${value}"@${sparqlVal["xml:lang"]}`;
      return `"${value}"`;
    default:
      console.error(`cnvValueFromSPARQL: Unknown value type for ${sparqlVal}`);
      return sparqlVal;
  }
}

// Given the result of a SPARQL query, display the results in a multi-functional table
function ShowQueryItems({ query, result, prefixMap }) {
  const {
    head: { vars: resultColumns },
    results: { bindings: resultRows },
  } = result;

  // If invalid data is parsed or no variable is to be shown, return
  if (
    !Array.isArray(resultColumns) ||
    !Array.isArray(resultRows) ||
    resultColumns.length === 0
  )
    return <></>;

  const formatRowsForDisplay = (result) =>
    showQualified(
      showQualify(cnvValueFromSPARQL(result, prefixMap), prefixMap)
    );

  // Create Columns dinamically based on the SPARQL query
  // Columns: variables fetched in the query
  const columns = resultColumns.map((col) => ({
    dataField: col,
    text: col,
    sort: true,
    headerClasses: "capitalize", // CSS capitalization of column header
    searchable: true,
    sortCaret: sortCaretGen,
    sortValue: (_, row) => row[col],
    formatter: (cell, row) =>
      formatRowsForDisplay({
        value: row[col],
        type: row[`${col}-type`],
      }),
    csvFormatter: (_, row) => row[col], // Plain values for CSV exports
  }));

  // Rows: results from the query to be displayed on table
  const rows = resultRows.map((result, idx) => {
    return resultColumns.reduce(
      // For each variable to fetch in the result...add it to the row content
      (prev, curr) => ({
        ...prev,
        [curr]: result[curr].value,
        [`${curr}-type`]: result[curr].type,
      }),
      { id: idx } // Use the index of each result as ID
    );
  });

  // Settings for exporting the table results to CSV
  // https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/export-csv-props.html
  const csvSettings = {
    fileName: "sparql.csv",
    separator: ";",
    ignoreHeader: false,
    noAutoBOM: false,
  };

  // Settings for pagination
  // https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/pagination-props.html
  const paginationSettings = {
    sizePerPage: 5,
    paginationSize: 3,
    hidePageListOnlyOnePage: true,
    sizePerPageList: [
      ...[5, 10, 15, 20, 25, 30]
        .filter((n) => n < rows.length)
        .map((n) => ({
          text: n.toString(),
          value: n,
        })),
      { text: "All", value: rows.length },
    ],
    sizePerPageOptionRenderer: ({ text, page, onSizePerPageChange }) => (
      <li
        key={text}
        role="presentation"
        className="dropdown-item size-per-page-dropdown"
        onMouseDown={(e) => {
          e.preventDefault();
          onSizePerPageChange(page);
        }}
      >
        <a href="#" tabIndex="-1" role="menuitem" data-page={page}>
          {text}
        </a>
      </li>
    ),
  };

  // Settings for searching the results
  const searchSettings = {};

  return (
    <>
      {/* https://react-bootstrap-table.github.io/react-bootstrap-table2/ */}
      {/* https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html */}
      <ToolkitProvider
        keyField="id"
        data={rows}
        columns={columns}
        exportCSV={csvSettings}
        search={searchSettings}
      >
        {(props) => (
          <>
            <div className="table-options">
              <Search.SearchBar
                {...props.searchProps}
                className="search-form"
              />
              <CSVExport.ExportCSVButton
                {...props.csvProps}
                className="btn-secondary btn-export-csv"
              >
                <span>CSV</span>
                <DataTransferDownloadIcon className="white-icon" />
              </CSVExport.ExportCSVButton>
            </div>
            <BootstrapTable
              {...props.baseProps}
              classes="results-table"
              pagination={paginationFactory(paginationSettings)}
              condensed
              responsive
              tabIndexCell={true}
              noDataIndication={() => "No matching elements"}
            />
          </>
        )}
      </ToolkitProvider>
    </>
  );
}

ShowQueryItems.propTypes = {
  query: PropTypes.object,
  result: PropTypes.object.isRequired,
  prefixMap: PropTypes.array,
};

ShowQueryItems.defaultProps = {
  query: {},
  prefixMap: [],
};

export default ShowQueryItems;
