import React from 'react';
import PropTypes from "prop-types";
import EndpointInput from "../EndpointInput";


class ResultQuery extends React.Component {
 render() {
     const result = this.props.result;
     console.log("ResultQuery" + JSON.stringify(result));
     let msg ;
     if (result === "") {
         msg = null
     } else
     if (result.error) {
         msg =
             <div><p>Error: {result.error}</p>
                 <details><pre>{JSON.stringify(result)}</pre></details>
                </div>
     } else {
         msg = <div>
             <p>{result.msg}</p>
             <details><pre>{JSON.stringify(result)}</pre></details>
         </div>
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
