import React from 'react';
import PropTypes from "prop-types";
import PrintJson from "../utils/PrintJson";

function ResultShEx2Shacl(props) {
    return (
       <div>
         <details><PrintJson json={props.result} /></details>
       </div>
    )
}

ResultShEx2Shacl.propTypes = {
    result: PropTypes.object,
};

export default ResultShEx2Shacl;