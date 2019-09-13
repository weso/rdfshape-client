import React from 'react';
import PropTypes from "prop-types";
import PrintJson from "../utils/PrintJson";
import Code from "../Code";

function ResultShEx2Shacl(props) {
    const result = props.result ;
    return (
       <div>
        { result.result && <Code value={result.result} mode={props.mode}/> }
         <details><PrintJson json={result} /></details>
       </div>
    )
}

ResultShEx2Shacl.propTypes = {
    result: PropTypes.object,
    mode: PropTypes.string
};

export default ResultShEx2Shacl;