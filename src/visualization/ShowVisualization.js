import cytoscape from "cytoscape";
import svg from "cytoscape-svg";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import format from "xml-formatter";
import API from "../API";
import { breadthfirst } from "../utils/cytoscape/cytoUtils";
import PrintJson from "../utils/PrintJson";
import PrintSVG from "../utils/PrintSVG";
import PrintXml from "../utils/PrintXml";
import {
  randomInt,
  visualizationMaxZoom,
  visualizationMinZoom,
  visualizationStepZoom
} from "../utils/Utils";
import CytoscapeContainer from "./CytoscapeContainer";
import VisualizationLinks from "./VisualizationLinks";

// "cytoscape-svg" package
// https://www.npmjs.com/package/cytoscape-svg
cytoscape.use(svg);

export const visualizationTypes = {
  svgObject: "svg",
  svgRaw: "svgRaw",
  image: "image",
  json: "json",
  cytoscape: "cyto",
  text: "text",
  object: "object",
};

// Unified class for showing data visualizations
function ShowVisualization({
  data,
  type,
  raw,
  zoom: defaultZoom,
  embedLink,
  disabledLinks,
  controls,
  tab,
}) {
  // Visualization ID and the ID of te html container of the visualization
  const id = randomInt();
  const htmlId = `visualization-container-${id}`;

  // CSS-applied zoom on the element (via transform scale). Not needed for cyto
  const [zoom, setZoom] = useState(defaultZoom || 1);

  // Current state of the visualization, fullscreen or not
  const [fullscreen, setFullscreen] = useState(false);

  // Cyto object for controlled updates, used for Cyto
  const [cytoObject, setCytoObject] = useState(null);
  // Current layout of the visualization, used for cyto.
  const [layout, setLayout] = useState(data?.layout || breadthfirst);
  // Extra styles for the visualization, used for cyto.
  const [cytoStyles, setCytoStyles] = useState([]);

  // React element with the visualization
  const [visualization, setVisualization] = useState(<></>);
  // Download link, may change when the visualization changes
  const [downloadLink, setDownloadLink] = useState({});

  // Sync fullscreen state with the browser
  useEffect(() => {
    const syncFullscreen = () => {
      document.fullscreenElement ? setFullscreen(true) : setFullscreen(false);
    };
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () =>
      document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  // Use the browser native API to enter fullscreen on visualizations
  useEffect(() => {
    // If new value of fullscreen is false and there's a fullscreen element, exit
    if (!fullscreen && document.fullscreenElement) {
      document.exitFullscreen();
    }
    // Else if new value of fullscreen is true and there's no fullscreen element, request
    else if (fullscreen && !document.fullscreenElement) {
      const element = document.getElementById(htmlId);
      element.requestFullscreen();
    }
  }, [fullscreen]);

  // Re-render the visualization if significant data changes
  useEffect(() => {
    setVisualization(generateVisualElement());
    setDownloadLink(generateDownloadLink());
  }, [data, type, layout, cytoStyles]);

  // Re-gen download link with update cyto object when it is manupulated by the user
  useEffect(() => {
    setDownloadLink(generateDownloadLink(data, type));
  }, [cytoObject]);

  // Change zoom whilst keeping the globally defined boundaries
  const setZoomControlled = (zoomIn) => {
    if (zoomIn) {
      const new_zoom = Math.min(
        visualizationMaxZoom,
        zoom + visualizationStepZoom
      );
      setZoom(new_zoom);
    } else {
      const new_zoom = Math.max(
        visualizationMinZoom,
        zoom - visualizationStepZoom
      );
      setZoom(new_zoom);
    }
  };

  const generateVisualElement = (vData = data, vType = type) => {
    switch (vType) {
      case visualizationTypes.svgObject:
        return <div dangerouslySetInnerHTML={{ __html: vData.outerHTML }} />;

      case visualizationTypes.svgRaw:
        return <PrintSVG svg={vData} />;

      case visualizationTypes.cytoscape:
        const userStyles = data?.stylesheet || [];
        return (
          <CytoscapeContainer
            elements={vData.elements}
            cytoControls={[cytoObject, setCytoObject]}
            layoutControls={[layout, setLayout]}
            styles={[...userStyles, ...cytoStyles]}
          />
        );

      case visualizationTypes.image:
        return <img src={vData.src} />;

      case visualizationTypes.json:
      case visualizationTypes.object:
        return <PrintJson json={vData} overflow={false}></PrintJson>;

      // DOT, PS, (String)
      case visualizationTypes.text:
      default:
        return <PrintXml xml={vData} overflow={false}></PrintXml>;
    }
  };

  const generateDownloadLink = (vData = data, vType = type) => {
    switch (vType) {
      case visualizationTypes.svgRaw:
      case visualizationTypes.svgObject:
        return () => ({
          link: URL.createObjectURL(
            new Blob([vData?.outerHTML || vData], {
              type: "image/svg+xml;charset=utf-8",
            })
          ),
          type: API.formats.svg.toLowerCase(),
        });

      case visualizationTypes.cytoscape:
        // "cytoscape-svg" package
        if (!cytoObject) return;

        return () => {
          const svgVisualization = cytoObject.svg({
            full: true,
          });
          return {
            link: URL.createObjectURL(
              new Blob([svgVisualization], {
                type: "image/svg+xml;charset=utf-8",
              })
            ),
            type: API.formats.svg.toLowerCase(),
          };
        };

      case visualizationTypes.image:
        return () => ({
          link: vData.src,
          type: API.formats.png.toLowerCase(),
        });

      case visualizationTypes.json:
      case visualizationTypes.object:
        return () => ({
          link: URL.createObjectURL(
            new Blob([JSON.stringify(vData, null, 2)], {
              type: "application/json;charset=utf-8",
            })
          ),
          type: API.formats.json.toLowerCase(),
        });

      case visualizationTypes.text:
      default:
        return () => ({
          link: URL.createObjectURL(
            new Blob([format(vData)], {
              type: "application/xml;charset=utf-8",
            })
          ),
          type: API.formats.txt.toLowerCase(),
        });
    }
  };

  return (
    <div
      id={htmlId}
      className={`visualization-container width-100 height-100`}
      style={{ height: "58vh" }}
    >
      <div
        id="visualization-box"
        style={{ position: "relative" }}
        className={`width-100 height-100 ${!raw && "border"}`}
      >
        <div
          style={{ overflow: raw ? "inherit" : "auto" }}
          className={raw ? "width-100v height-100v" : "width-100 height-100"}
        >
          {/* // Basic div changing with the zoom level with the final contents */}
          <div className="width-100 height-100">
            <div
              className="width-100 height-100"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
              }}
            >
              {visualization}
            </div>
          </div>
        </div>
      </div>
      <VisualizationLinks
        generateDownloadLink={generateDownloadLink}
        embedLink={raw ? false : embedLink}
        disabled={raw ? true : disabledLinks}
        controls={controls}
        zoomControls={[zoom, setZoomControlled]}
        fullscreenControls={[fullscreen, setFullscreen]}
        layoutControls={[layout, setLayout]}
        cytoscape={cytoObject}
        styleControls={[cytoStyles, setCytoStyles]}
        type={type}
      />
    </div>
  );
}

ShowVisualization.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  zoom: PropTypes.number,
  raw: PropTypes.bool,
  embedLink: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabledLinks: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  tab: PropTypes.string.isRequired,
};

ShowVisualization.defaultProps = {
  zoom: 1,
  raw: false,
  controls: false, // Show or hide zoom controls
  tab: API.tabs.none,
};
export default ShowVisualization;
