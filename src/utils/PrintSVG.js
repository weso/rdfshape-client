import React from "react";
import PropTypes from "prop-types";

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
