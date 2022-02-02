import PropTypes from "prop-types";
import React from "react";
import ShowVisualization from "../visualization/ShowVisualization";

function ResultDataVisualize({
  result: dataVisualizeResponse,
  data,
  type,
  raw,
  embedLink,
  disabledLinks,
}) {
  if (dataVisualizeResponse) {
    return (
      <ShowVisualization
        data={data}
        type={type}
        raw={raw}
        controls={true}
        embedLink={embedLink || false}
        disabledLinks={disabledLinks || false}
      />
    );
  }
}

ResultDataVisualize.defaultProps = {
  raw: false,
  disabledLinks: false,
};

ResultDataVisualize.propTypes = {
  raw: PropTypes.bool,
  result: PropTypes.object,
  data: PropTypes.object,
  type: PropTypes.string,
  zoom: PropTypes.number,
  embedLink: PropTypes.string,
  disabledLinks: PropTypes.bool,
};

export default ResultDataVisualize;
