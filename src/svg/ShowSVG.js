import React from 'react';

class ShowSVG extends React.Component {

    render() {
        return <div className="SVG" border="1"
                    dangerouslySetInnerHTML={{__html: this.props.svg}}
        />
    }
}

export default ShowSVG;
