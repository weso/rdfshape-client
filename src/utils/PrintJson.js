import React from 'react';
import PropTypes from "prop-types";

const PrintJson = React.memo(({json}) => (
    <pre>{JSON.stringify(json, null, 2)}</pre>));

PrintJson.propTypes = {
    json: PropTypes.object
};

export default PrintJson;
