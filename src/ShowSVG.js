import React from 'react';
import Cyto from "./Cyto";

class ShowSVG extends React.Component {

    render() {
        return <div>
            <p>Show SVG: {this.props.svg}</p>
        </div>
    }
}

export default ShowSVG;
