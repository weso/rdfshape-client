import React from 'react';
import PropTypes from "prop-types";
import BootstrapTable from "react-bootstrap-table-next";
import EndpointInput from "../EndpointInput";
import {cnvValueFromSPARQL, showQualified, showQualify} from "../Utils";


class ResultQuery extends React.Component {
 render() {
     const result = this.props.result;
     console.log("ResultQuery" + JSON.stringify(result));
     let msg ;
     if (!result || result === '') {
         msg = null
     } else
     if (result.error) {
         msg =
             <div><p>Error: {result.error}</p>
                 <details><pre>{JSON.stringify(result)}</pre></details>
                </div>
     } else {
         const prefixes = [] ;
         const table = parseData(result.result, prefixes);
         msg = <div>
             <BootstrapTable
                 keyField='_id'
                 data={table.rows}
                 columns={table.columns}
                 bootstrap4
                 striped
                 hover
                 condensed />
             <p>{result.msg}</p>
             <details><pre>{JSON.stringify(result)}</pre></details>
         </div>
     }

     function parseData(data, prefixes) {
         if (data.head && data.head.vars && data.head.vars.length) {
             const vars = data.head.vars;
             const columns = vars.map(v => {
                 return {
                     dataField: v,
                     text: v,
                     sort: true
                 }});
             const rows = data.results.bindings.map((binding,idx) => {
                 let row = {_id: idx};
                 vars.map(v => {
                     const b = binding[v]
                     const converted = cnvValueFromSPARQL(b);
                     const qualify = showQualify(converted,prefixes);
                     const value = showQualified(qualify, prefixes)
                     row[v] = value
                 });
                 return row;
             })
             return {
                 columns: columns,
                 rows: rows
             }
         } else {
             return [];
         }
     }

     return (
         <div>
             {msg}
         </div>
     );
 }
}

EndpointInput.propTypes = {
    result: PropTypes.object.isRequired,
};

export default ResultQuery;
