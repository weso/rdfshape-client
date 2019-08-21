import Cytoscape from 'cytoscape';
// import COSEBilkent from 'cytoscape-cose-bilkent';
import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

/*
Cytoscape.use(COSEBilkent);
*/

function Cyto(props) {
    const style2 = { width: '80vw', height: '80vh', backgroundColor: 'rgb(250, 250, 250)' }
    const style = {width: '100%', height: '1000px', border: 'solid'}
    const layout = { name: props.layoutName };
    console.log("render() Layout: " + layout);
    return <CytoscapeComponent
        elements={props.elements}
        style={style2}
        layout={layout}
    />
}

export default Cyto;
