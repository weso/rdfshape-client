import React from 'react';
import InputTabs from "./InputTabs";

class ShExTabs extends React.Component {
    render() {
        return (
            <InputTabs name="ShEx schema"
                       byTextPlaceholder="<Shape> {..."
                       byURLPlaceholder="http://..."
            />
        );
    }
}

export default ShExTabs;