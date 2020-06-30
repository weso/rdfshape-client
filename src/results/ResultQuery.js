import React from 'react';
import PropTypes from "prop-types";
import BootstrapTable from "react-bootstrap-table-next";
import {parseData} from "./ParseQueryResult";
import Alert from "react-bootstrap/Alert";


function ResultQuery(props)  {
  const result = props.result;
  console.log("ResultQuery " + JSON.stringify(result));
  let msg ;
  if (!result || result === '') {
         msg = null
  } else
  if (result.result.error) {
         msg =
             <div>
                 <Alert variant='danger'>Error: {result.result.error}</Alert>
                 {
                     !result.result.error ? <details><pre>{JSON.stringify(result)}</pre></details> : null
                 }
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
             <p>{result.msg}></p>
             <details><pre>{JSON.stringify(result)}</pre></details>
         </div>
     }

     return (
         <div>
             {msg}
         </div>
     );
}

ResultQuery.propTypes = {
    result: PropTypes.object.isRequired,
};

export default ResultQuery;
