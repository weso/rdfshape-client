import PropTypes from "prop-types";
import React from "react";
import PrintJson from "../utils/PrintJson";
import PrintXml from "../utils/PrintXml";

class ShowVisualization extends React.Component {
  render() {
    const visualizationType = Object.getPrototypeOf(this.props.data).toString();
    let ret = null;
    switch (visualizationType) {
      case "[object SVGSVGElement]":
        ret = (
          <div
            dangerouslySetInnerHTML={{ __html: this.props.data.outerHTML }}
          />
        );
        break;
      case "[object HTMLImageElement]":
        ret = <img src={this.props.data.src}></img>;
        break;

      // JSON
      case "[object Object]":
        ret = <PrintJson json={this.props.data} overflow={false}></PrintJson>;
        break;

      // DOT, PS (String)
      default:
        console.log(this.props.data);
        ret = <PrintXml xml={this.props.data} overflow={false}></PrintXml>;
        break;
    }

    return ret;
  }
}

ShowVisualization.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default ShowVisualization;
