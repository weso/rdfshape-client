import React from 'react';
import PropTypes from "prop-types";
import PrintJson from "../utils/PrintJson";
import PrintSVG from "../utils/PrintSVG";

function ResultShExVisualize(props) {
    return (
       <div>
         <PrintSVG svg={props.result.svg}/>
         <details><PrintJson json={props.result} /></details>
       </div>
    )
}

ResultShExVisualize.propTypes = {
    result: PropTypes.object,
};

export default ResultShExVisualize;