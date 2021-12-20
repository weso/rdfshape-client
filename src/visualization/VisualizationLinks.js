import PropTypes from "prop-types";
import React, { useState } from "react";
import DataTransferDownloadIcon from "react-open-iconic-svg/dist/DataTransferDownloadIcon";
import ExternalLinkIcon from "react-open-iconic-svg/dist/ExternalLinkIcon";
import ReactTooltip from "react-tooltip";
import API from "../API";

function VisualizationLinks({
  embedLink,
  disabled,
  generateDownloadLink, // Function creating the correct download link + type
  styles,
  tooltips,
}) {
  const iconScaling = 2;
  const tooltipScaling = 1 / iconScaling;

  const [downloadLink, setDownloadLink] = useState({
    link: "#",
    type: null,
  });

  return (
    <div className="visualization-links" style={styles}>
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
  );
}

VisualizationLinks.propTypes = {
  generateDownloadLink: PropTypes.func,
  embedLink: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  styles: PropTypes.object,
  tooltips: PropTypes.bool,
};

VisualizationLinks.defaultProps = {
  disabled: false,
  styles: {},
  tooltips: true,
};

export default VisualizationLinks;
