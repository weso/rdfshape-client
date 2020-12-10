import Viz from 'viz.js/viz.js';
const {Module, render} = require('viz.js/full.render.js');

// https://github.com/mdaines/viz.js/wiki/API
export function convertDot(dot, engine, format, setLoading, setError, setSVG) {
    let viz = new Viz({Module, render});
    const opts = {engine: 'dot'};
    viz.renderSVGElement(dot, opts).then(svg => {
        setLoading(false);
        setSVG({
            svg: svg.outerHTML
        });
    }).catch(error => {
        // Create a new Viz instance (@see Caveats page for more info)
        viz = new Viz({Module, render});
        setLoading(false);
        setError(`Error converting to ${format}: ${error}\nDOT:\n${dot}`)
    });
}
