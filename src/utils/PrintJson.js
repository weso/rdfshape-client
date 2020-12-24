import PropTypes from "prop-types";
import React from 'react';

const PrintJson = React.memo(({json, overflow}) => (
    <pre className={ overflow === false ? "no-overflow" : ""}>{JSON.stringify(json, null, 2)}</pre>));

PrintJson.propTypes = {
    json: PropTypes.object.isRequired,
    overflow: PropTypes.bool
};

export default PrintJson;
