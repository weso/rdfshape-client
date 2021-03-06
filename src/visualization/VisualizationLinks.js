import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import DataTransferDownloadIcon from "react-open-iconic-svg/dist/DataTransferDownloadIcon";
import ExternalLinkIcon from "react-open-iconic-svg/dist/ExternalLinkIcon";
import ReactTooltip from "react-tooltip";

function VisualizationLinks({
  embedLink,
  disabled,
  generateDownloadLink,
  styles,
  tooltips,
}) {
  const iconScaling = 2;
  const tooltipScaling = 1 / iconScaling;

  const [downloadLink, setDownloadLink] = useState("#");
  const [downloadType, setDownloadType] = useState("");

  useEffect(() => {
    udpateLink();
  }, []);

  const udpateLink = () => {
    const { link, type } = generateDownloadLink();
    link && setDownloadLink(link);
    type && setDownloadType(type);
  };

  return (
    <div
      style={{
        position: "absolute",
        right: "8px",
        top: "0",
        display: "flex",
        zIndex: "10",
        ...styles,
      }}
    >
      {
        <div
          data-tip
          data-for="downloadLinkTip"
          className="embedded-icon"
          style={{ transform: `scale(${iconScaling})` }}
        >
          <a
            id="downloadLink"
            href={downloadLink}
            download={"visualization" + (downloadType && `.${downloadType}`)}
            onClick={udpateLink}
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
                {disabled == "byText"
                  ? "Can't generate links for long manual inputs, try inserting data by URL"
                  : disabled == "byFile"
                  ? "Can't generate links for file-based inputs, try inserting data by URL"
                  : "Embedded link"}
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
  embedLink: PropTypes.string,
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
