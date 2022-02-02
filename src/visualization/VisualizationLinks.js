import PropTypes from "prop-types";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import {
  FullscreenEnterIcon,
  FullscreenExitIcon,
  ZoomInIcon,
  ZoomOutIcon
} from "react-open-iconic-svg";
import DataTransferDownloadIcon from "react-open-iconic-svg/dist/DataTransferDownloadIcon";
import ExternalLinkIcon from "react-open-iconic-svg/dist/ExternalLinkIcon";
import ReactTooltip from "react-tooltip";
import API from "../API";
import { breadthfirst, circle } from "../utils/cytoscape/cytoUtils";
import {
  visualizationMaxZoom,
  visualizationMinZoom,
  visualizationStepZoom
} from "../utils/Utils";
import { visualizationTypes } from "./ShowVisualization";

function VisualizationLinks({
  embedLink,
  disabled,
  generateDownloadLink, // Function creating the correct download link + type
  styles,
  type, // Visualization type
  tooltips,
  controls,
  zoomControls,
  fullscreenControls,
  layoutControls,
}) {
  const [zoom, setZoom] = zoomControls;
  const [fullscreen, setFullscreen] = fullscreenControls;
  const [layout, setLayout] = layoutControls;

  const iconScaling = 2;
  const tooltipScaling = 1 / iconScaling;

  const [downloadLink, setDownloadLink] = useState({
    link: "#",
    type: null,
  });

  // Change zoom whilst keeping the globally defined boundaries
  function setZoomControlled(zoomIn) {
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
  }

  return (
    <div className={`visualization-links ${fullscreen && ""}`} style={styles}>
      <div id="download-controls" className="controls-group">
        {
          <div
            data-tip
            data-for="downloadLinkTip"
            className="embedded-icon"
            style={{ transform: `scale(${iconScaling})` }}
          >
            <a
              id="downloadLink"
              href={downloadLink.link}
              download={
                "visualization" +
                (downloadLink.type ? `.${downloadLink.type}` : "")
              }
              onMouseEnter={() => setDownloadLink(generateDownloadLink())}
            >
              <DataTransferDownloadIcon style={{ fill: "black" }} />
            </a>
            {tooltips ?? (
              <div style={{ transform: `scale(${tooltipScaling})` }}>
                <ReactTooltip id="downloadLinkTip" place="top" effect="solid">
                  {"Download"}
                </ReactTooltip>
              </div>
            )}
          </div>
        }
        {embedLink && (
          <div
            data-tip
            data-for="embedLinkTip"
            className="embedded-icon"
            style={{ transform: `scale(${iconScaling})` }}
          >
            <a
              target="_blank"
              href={disabled ? null : embedLink}
              className={disabled ? "disabled" : ""}
              style={{ transform: `scale(${iconScaling})` }}
            >
              <ExternalLinkIcon style={{ fill: "black" }} />
            </a>
            {tooltips ?? (
              <div style={{ transform: `scale(${tooltipScaling})` }}>
                <ReactTooltip id="embedLinkTip" place="top" effect="solid">
                  {disabled == API.sources.byText
                    ? API.texts.noPermalinkManual
                    : disabled == API.sources.byFile
                    ? API.texts.noPermalinkFile
                    : API.texts.embeddedLink}
                </ReactTooltip>
              </div>
            )}
          </div>
        )}
      </div>

      {controls && (
        <div id="scale-controls" className="controls-group">
          {fullscreenControls && (
            <>
              <Button
                onClick={() => {
                  setFullscreen(!fullscreen);
                }}
                className="btn-controls"
                variant="secondary"
              >
                {fullscreen ? (
                  <FullscreenExitIcon className="white-icon" />
                ) : (
                  <FullscreenEnterIcon className="white-icon" />
                )}
              </Button>
            </>
          )}
          {zoomControls && type !== visualizationTypes.cytoscape && (
            <>
              <Button
                onClick={() => setZoomControlled(false)}
                className="btn-controls"
                variant="secondary"
                disabled={zoom <= visualizationMinZoom}
              >
                <ZoomOutIcon className="white-icon" />
              </Button>
              <Button
                onClick={() => setZoomControlled(true)}
                style={{ marginLeft: "1px" }}
                className="btn-controls"
                variant="secondary"
                disabled={zoom >= visualizationMaxZoom}
              >
                <ZoomInIcon className="white-icon" />
              </Button>
            </>
          )}
        </div>
      )}
      {controls && (
        <div id="layout-controls" className="controls-group">
          {layoutControls && type === visualizationTypes.cytoscape && (
            <>
              <Button
                onClick={() => setLayout(breadthfirst)}
                className="btn-zoom"
                variant="secondary"
                disabled={layout === breadthfirst}
              >
                {breadthfirst.uiName.toUpperCase()}
              </Button>
              <Button
                onClick={() => setLayout(circle)}
                style={{ marginLeft: "1px" }}
                className="btn-zoom"
                variant="secondary"
                disabled={layout === circle}
              >
                {circle.uiName.toUpperCase()}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

VisualizationLinks.propTypes = {
  generateDownloadLink: PropTypes.func,
  embedLink: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  styles: PropTypes.object,
  tooltips: PropTypes.bool,
  controls: PropTypes.bool,
  zoomControls: PropTypes.array,
  fullscreenControls: PropTypes.array,
  layoutControls: PropTypes.array,
};

VisualizationLinks.defaultProps = {
  disabled: false,
  styles: {},
  tooltips: true,
  zoom: 1,
  controls: false,
};

export default VisualizationLinks;
