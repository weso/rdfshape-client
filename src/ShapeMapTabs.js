import React from 'react';
import InputTabsWithFormat from "./InputTabsWithFormat";
import API from "./API"
import PropTypes from 'prop-types';

class ShapeMapTabs extends React.Component {
    render() {
        return (
            <div>
                <InputTabsWithFormat
                    nameInputTab="ShapeMap"
                    activeTab={this.props.activeTab}
                    handleTabChange={this.props.handleTabChange}

                    byTextName="Input shapeMap"
                    textAreaValue={this.props.textAreaValue}
                    byTextPlaceholder="<node>@<Shape>...>"
                    handleByTextChange={this.props.handleByTextChange}

                    byUrlName="URL shapeMap"
                    handleUrlChange={this.props.handleShapeMapUrlChange}
                    urlValue={this.props.shapeMapUrl}
                    byURLPlaceholder="http://..."

                    byFileName="ShapeMap File"
                    handleFileUpload={this.props.handleFileUpload}

                    nameFormat="ShapeMap format"
                    defaultFormat={this.props.shapeMapFormat}
                    handleFormatChange={this.props.handleShapeMapFormatChange}
                    urlFormats={API.shapeMapFormats}
                />
            </div>
        );
    }
}

ShapeMapTabs.propTypes = {
    activeTab: PropTypes.string,
    textAreaValue: PropTypes.string,
    handleByTextChange: PropTypes.func.isRequired,
    handleFileUpload: PropTypes.func.isRequired,
    handleShapeMapUrlChange: PropTypes.func.isRequired,
    shapeMapFormat: PropTypes.string.isRequired,
    handleShapeMapFormatChange: PropTypes.func.isRequired
};

ShapeMapTabs.defaultProps = {
    activeTab: 'ByText',
    shapeMapFormat: 'TURTLE'
};


export default ShapeMapTabs;