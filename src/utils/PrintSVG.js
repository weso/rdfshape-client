import React from 'react';
import PropTypes from "prop-types";

function mkInner(inner) {
    return {__html: inner};
}

const PrintSVG = React.memo(({svg}) => (
   <div dangerouslySetInnerHTML={mkInner(svg)}/>
 )
);

PrintSVG.propTypes = {
    svg: PropTypes.isRequired,
};

export default PrintSVG;
