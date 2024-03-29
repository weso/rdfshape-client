import PropTypes from "prop-types";
import React from "react";

const PrintJson = React.memo(({ json, overflow, styles }) => (
  <pre className={overflow === false ? "no-overflow" : ""} style={styles}>
    {JSON.stringify(json, null, 2)}
  </pre>
));

PrintJson.propTypes = {
  json: PropTypes.object.isRequired,
  overflow: PropTypes.bool,
};

export default PrintJson;
