import PropTypes from 'prop-types';
import React from 'react';
import API from "../API";
import InputTabsWithFormat from "../components/InputTabsWithFormat";

function DataTabs(props) {

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

                       byTextName={props.subname || ""}
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

                       nameFormat="Data format"
                       selectedFormat={props.selectedFormat}
                       handleFormatChange={props.handleDataFormatChange}
                       urlFormats={API.dataFormatsInput}
                       setCodeMirror={props.setCodeMirror}
                       fromParams = {props.fromParams}
                       resetFromParams={props.resetFromParams}
            />
            </div>
        );
}

DataTabs.propTypes = {
    activeTab: PropTypes.string,
    handleTabChange: PropTypes.func.isRequired,
    textAreaValue: PropTypes.string,
    handleByTextChange: PropTypes.func.isRequired,
    urlValue: PropTypes.string.isRequired,
    handleDataUrlChange: PropTypes.func.isRequired,
    handleFileUpload: PropTypes.func.isRequired,

    selectedFormat: PropTypes.string.isRequired,
    handleDataFormatChange: PropTypes.func.isRequired,

    resetFromParams: PropTypes.func,
    fromParams: PropTypes.bool
};

DataTabs.defaultProps = {
    name: '',
    activeTab: 'ByText' ,
    // dataFormat: 'TURTLE'
};


export default DataTabs;
