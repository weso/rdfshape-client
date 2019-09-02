import React from 'react';
import PropTypes from "prop-types";
import PrintJson from "../utils/PrintJson";
import PrintSVG from "../utils/PrintSVG";

function ResultShExInfo(props) {
    return (
       <div>
         <details><PrintJson json={props.result} /></details>
       </div>
    )
}

ResultShExInfo.propTypes = {
    result: PropTypes.object
};

export default ResultShExInfo;