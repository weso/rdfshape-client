import React from 'react';
import InputTabsWithFormat from "./InputTabsWithFormat";
import ShExForm from "./ShExForm";
import API from "./API";
import PropTypes from "prop-types";

function ShExTabs(props) {

    const shExForm = <ShExForm // id="textAreaShEx"
                               onChange={props.handleByTextChange}
                               setCodeMirror={props.setCodeMirror}
                               value={props.textAreaValue} />;

    return (
        <div>
            <InputTabsWithFormat
                nameInputTab="ShEx input"
                activeTab={props.activeTab}
                handleTabChange={props.handleTabChange}

                byTextName="RDF shEx"
                textAreaValue={props.textAreaValue}
                byTextPlaceholder="RDF shEx..."
                handleByTextChange={props.handleByTextChange}
                setCodeMirror = {props.setCodeMirror}
                inputForm={shExForm}


                byUrlName="ShEx URL"
                handleUrlChange={props.handleShExUrlChange}
                urlValue={props.shExUrl}
                byURLPlaceholder="http://..."

                byFileName="ShEx File"
                handleFileUpload={props.handleFileUpload}

                nameFormat="ShEx format"
                defaultFormat={props.shExFormat}
                handleFormatChange={props.handleShExFormatChange}
                urlFormats={API.shExFormats}
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

    shExUrl: PropTypes.string.isRequired,
    handleShExUrlChange: PropTypes.func.isRequired,

    handleFileUpload: PropTypes.func.isRequired,
    shExFormat: PropTypes.string.isRequired,
    handleShExFormatChange: PropTypes.func.isRequired
};

ShExTabs.defaultProps = {
    activeTab: 'ByText',
    shExFormat: 'ShExC'
};

export default ShExTabs;