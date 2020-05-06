import React from 'react';
import InputTabsWithFormat from "../components/InputTabsWithFormat";
import API from "../API";
import PropTypes from 'prop-types';

function SHACLTabs(props) {

    const turtleForm = null ;
    /*props.selectedFormat.toUpperCase() == "TURTLE" ? <TurtleForm
        onChange={props.handleByTextChange}
        fromParams={props.fromParams}
        resetFromParams={props.resetFromParams}
        value={props.textAreaValue}
    /> : null ; */

    return (
        <div>
            <InputTabsWithFormat
                nameInputTab={props.name}
                activeTab={props.activeTab}
                handleTabChange={props.handleTabChange}

                byTextName="RDF data"
                textAreaValue={props.textAreaValue}
                byTextPlaceholder="RDF data..."
                handleByTextChange={props.handleByTextChange}
                inputForm={turtleForm}


                byUrlName="URL data"
                handleUrlChange={props.handleDataUrlChange}
                urlValue={props.urlValue}
                byURLPlaceholder="http://..."

                byFileName="RDF File"
                handleFileUpload={props.handleFileUpload}

                nameFormat="SHACL format"
                selectedFormat={props.selectedFormat}
                handleFormatChange={props.handleDataFormatChange}
                urlFormats={API.dataFormatsInput}
                setCodeMirror={props.setCodeMirror}
                fromParams={props.fromParams}
                resetFromParams={props.resetFromParams}
            />
        </div>
    );
}

SHACLTabs.propTypes = {
    activeTab: PropTypes.string,
    handleTabChange: PropTypes.func.isRequired,
    textAreaValue: PropTypes.string,
    handleByTextChange: PropTypes.func.isRequired,
    urlValue: PropTypes.string.isRequired,
    handleDataUrlChange: PropTypes.func.isRequired,
    handleFileUpload: PropTypes.func.isRequired,

    selectedFormat: PropTypes.string.isRequired,
    handleDataFormatChange: PropTypes.func.isRequired,

    handleInferenceChange: PropTypes.func.isRequired,
    selectedInference: PropTypes.string.isRequired,

    resetFromParams: PropTypes.func,
    fromParams: PropTypes.bool
};

SHACLTabs.defaultProps = {
    name: 'SHACL Shapes',
    activeTab: 'ByText' ,
    // dataFormat: 'TURTLE'
};


export default SHACLTabs;