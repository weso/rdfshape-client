import React from 'react';
import InputTabsWithFormat from "./InputTabsWithFormat";
import API from "./API";

class ShapeMapTabs extends React.Component {
    render() {
        return (
            <InputTabsWithFormat
                name="ShapeMap"
                activeTab={this.props.activeTab}
                textAreaValue={this.props.textAreaValue}
                byTextPlaceholder="<node>@<Shape>,..."
                handleByTextChange={this.props.handleByTextChange}
                handleTabChange={this.props.handleTabChange}
                byURLPlaceholder="http://..."
                nameFormat="ShapeMap format"
                defaultFormat={this.props.shapeMapFormat}
                handleFormatChange={this.props.handleShapeMapFormatChange}
                urlFormats={API.shapeMapFormats}
            />
        );
    }
}

export default ShapeMapTabs;