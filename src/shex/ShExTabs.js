import React from 'react';
import InputTabs from "../components/InputTabs";
import ShExForm from "./ShExForm";
import API from "../API";
import PropTypes from "prop-types";

function ShExTabs(props) {

    const shExForm = <ShExForm // id="textAreaShEx"
                               onChange={props.handleByTextChange}
                               setCodeMirror={props.setCodeMirror}
                               fromParams={props.fromParams}
                               resetFromParams={props.resetFromParams}
                               value={props.textAreaValue} />;

    return (
        <div>
            <InputTabs
                name={"ShEx Input (ShExC)"}
                activeTab={props.activeTab}
                handleTabChange={props.handleTabChange}

                byTextName={props.subname || ""}
                textAreaValue={props.textAreaValue}
                byTextPlaceholder="RDF shEx..."
                handleByTextChange={props.handleByTextChange}
                setCodeMirror = {props.setCodeMirror}
                inputForm={shExForm}


                byUrlName="ShEx URL"
                handleUrlChange={props.handleShExUrlChange}
                urlValue={props.urlValue}
                byURLPlaceholder="http://..."

                byFileName="ShEx File"
                handleFileUpload={props.handleFileUpload}

                nameFormat="ShEx format"
                selectedFormat={props.selectedFormat}
                handleFormatChange={props.handleShExFormatChange}
                urlFormats={API.shExFormats}

                fromParams = {props.fromParams}
                resetFromParams={props.resetFromParams}
            />
        </div>
    );
}

ShExTabs.propTypes = {
    activeTab: PropTypes.string,
    handleTabChange: PropTypes.func.isRequired,
    textAreaValue: PropTypes.string,
    handleByTextChange: PropTypes.func.isRequired,
    setCodeMirror:PropTypes.func.isRequired,

    urlValue: PropTypes.string.isRequired,
    handleShExUrlChange: PropTypes.func.isRequired,

    handleFileUpload: PropTypes.func.isRequired,
    selectedFormat: PropTypes.string.isRequired,
    handleShExFormatChange: PropTypes.func.isRequired,

    /** Flag to signal if values come from Params */
    fromParams: PropTypes.bool.isRequired,

    /** Function to reset value of fromParams */
    resetFromParams: PropTypes.func.isRequired
};

ShExTabs.defaultProps = {
    activeTab: 'ByText',
    shExFormat: 'ShExC'
};

export default ShExTabs;
