import React from 'react';


class ResultQuery extends React.Component {
 render() {
     const result = this.props.result
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


export default ResultQuery;
