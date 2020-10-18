import React from 'react';
import InputTabs from "../components/InputTabs";
import UMLForm from "./UMLForm";
import API from "../API";
import PropTypes from "prop-types";

function UMLTabs(props) {

    const umlForm = <UMLForm // id="textAreaShEx"
                               onChange={props.handleByTextChange}
                               setCodeMirror={props.setCodeMirror}
                               fromParams={props.fromParams}
                               resetFromParams={props.resetFromParams}
                               value={props.textAreaValue} />;

    return (
        <div>
            <InputTabs
                name={"UML Input (XMI)"}
                activeTab={props.activeTab}
                handleTabChange={props.handleTabChange}

                byTextName={props.subname || ""}
                textAreaValue={props.textAreaValue}
                byTextPlaceholder="XMI..."
                handleByTextChange={props.handleByTextChange}
                setCodeMirror = {props.setCodeMirror}
                inputForm={umlForm}

                byUrlName="XMI URL"
                handleUrlChange={props.handleShExUrlChange}
                urlValue={props.urlValue}
                byURLPlaceholder="http://..."

                byFileName="XMI File"
                handleFileUpload={props.handleFileUpload}

                //nameFormat="XMI format"
                //selectedFormat={props.selectedFormat}
               // handleFormatChange={props.handleShExFormatChange}
                //urlFormats={API.shExFormats}

                fromParams = {props.fromParams}
                resetFromParams={props.resetFromParams}
            />
        </div>
    );
}

UMLTabs.propTypes = {
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

UMLTabs.defaultProps = {
    activeTab: 'ByText',
};

export default UMLTabs;
