import PropTypes from "prop-types";
import React from "react";

function PrintSVG({ svg }) {
  function mkInner(inner) {
    return { __html: inner };
  }

  return <div dangerouslySetInnerHTML={mkInner(svg)} />;
}

PrintSVG.propTypes = {
  svg: PropTypes.string,
};

export default PrintSVG;
