import PropTypes from "prop-types";
import React from 'react';
import format from "xml-formatter";

const PrintXml = React.memo(({xml, overflow}) => (
    <pre className={ overflow === false ? "no-overflow" : ""}>{format(xml)}</pre>));

PrintXml.propTypes = {
    xml: PropTypes.string.isRequired,
    overflow: PropTypes.bool
};

export default PrintXml;
