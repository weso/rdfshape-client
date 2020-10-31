import PropTypes from 'prop-types';
import React from 'react';
import API from "../API";
import SelectFormat from "../components/SelectFormat";

function SelectSHACLEngine(props) {
    return (
        <SelectFormat handleFormatChange={props.handleSHACLEngineChange}
                      selectedFormat={props.selectedSHACLEngine}
                      urlFormats={API.schemaSHACLEngines}
                      name={props.name} />
    );
}

SelectSHACLEngine.propTypes = {
    handleSHACLEngineChange: PropTypes.func.isRequired,
    selectedSHACLEngine: PropTypes.string.isRequired,
    resetFromParams: PropTypes.func,
    fromParams: PropTypes.bool
};

SelectSHACLEngine.defaultProps = {
    name: 'SHACL engine',
};


export default SelectSHACLEngine;