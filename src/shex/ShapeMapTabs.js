import React from 'react';
import InputTabsWithFormat from "../InputTabsWithFormat";
import API from "../API"
import PropTypes from 'prop-types';

function ShapeMapTabs(props) {
    return ( <div>
        <InputTabsWithFormat
            defaultFormat={"Compact"}
            nameInputTab="ShapeMap"
            activeTab={props.activeTab}
            handleTabChange={props.handleTabChange}

            byTextName="Input shapeMap"
            textAreaValue={props.textAreaValue}
            byTextPlaceholder="<node>@<Shape>...>"
            handleByTextChange={props.handleShapeMapByTextChange}

            byUrlName="URL shapeMap"
            handleUrlChange={props.handleShapeMapUrlChange}
            urlValue={props.shapeMapUrl}
            byURLPlaceholder="http://..."

            byFileName="ShapeMap File"
            handleFileUpload={props.handleShapeMapFileUpload}

            nameFormat="ShapeMap format"
            textFormat={props.shapeMapFormat}
            handleFormatChange={props.handleShapeMapFormatChange}
            urlFormats={API.shapeMapFormats}
            fromParams={props.fromParams}
            resetFromParams={props.resetFromParams}
        />
    </div>
    );
}

ShapeMapTabs.propTypes = {
    activeTab: PropTypes.string,
    textAreaValue: PropTypes.string,
    handleShapeMapByTextChange: PropTypes.func.isRequired,
    handleShapeMapFileUpload: PropTypes.func.isRequired,
    handleShapeMapUrlChange: PropTypes.func.isRequired,
    shapeMapFormat: PropTypes.string.isRequired,
    handleShapeMapFormatChange: PropTypes.func.isRequired,
    resetFromParams: PropTypes.func.isRequired,
    fromParams: PropTypes.bool.isRequired
};

ShapeMapTabs.defaultProps = {
    activeTab: 'ByText',
    shapeMapFormat: 'TURTLE'
};


export default ShapeMapTabs;