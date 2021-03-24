import PropTypes from "prop-types";
import React from "react";
import PrintJson from "../utils/PrintJson";
import PrintXml from "../utils/PrintXml";

function ShowVisualization({ data, zoom }) {
  const visualizationType = Object.getPrototypeOf(data).toString();
  let ret = null;
  switch (visualizationType) {
    case "[object SVGSVGElement]":
      ret = (
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}
          dangerouslySetInnerHTML={{ __html: data.outerHTML }}
        />
      );
      break;
    case "[object HTMLImageElement]":
      ret = (
        <img
          style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}
          src={data.src}
        ></img>
      );
      break;

    // JSON
    case "[object Object]":
      ret = <PrintJson json={data} overflow={false}></PrintJson>;
      break;

    // DOT, PS (String)
    default:
      ret = <PrintXml xml={data} overflow={false}></PrintXml>;
      break;
  }

  return ret;
}

ShowVisualization.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  zoom: PropTypes.number,
};

ShowVisualization.defaultProps = {
  zoom: 1,
};
export default ShowVisualization;
