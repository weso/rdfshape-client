import Cytoscape from 'cytoscape';
// import COSEBilkent from 'cytoscape-cose-bilkent';
import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

/*
Cytoscape.use(COSEBilkent);
*/

class Cyto extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        const elements = this.props.elements;
        const layout = { name: 'cose' };
        return <CytoscapeComponent
            elements={elements}
            style={ {
                width: 'auto',
                height: 'auto',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0
             }
            }
            layout={layout}
          />;
    }
}

export default Cyto;
