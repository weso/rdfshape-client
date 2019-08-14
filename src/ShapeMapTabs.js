import React from 'react';
import InputTabs from "./InputTabs";

class ShapeMapTabs extends React.Component {
    render() {
        return (
            <InputTabs name="ShapeMap"
                       byTextPlaceholder="<node>@<Shape>"
                       byURLPlaceholder="http://..."
            />
        );
    }
}

export default ShapeMapTabs;