import PropTypes from "prop-types";
import React from "react";
import ReactTooltip from "react-tooltip";

// Simple header containing a tooltip with additional information
// Meant to be used in page headers to explain each page to users
const PageHeader = ({ title, details }) => {
  return (
    <div className="page-header">
      <h1>{title}</h1>
      {/* Show, close to the title, the additional information (if any) */}
      {details && (
        <div className="page-header-tip-container" data-tip data-for="helpTip">
          {/* <QuestionMarkIcon className="icon" /> */}
          <span className="icon">?</span>
          <ReactTooltip
            id="helpTip"
            delayShow={100}
            delayHide={150}
            place="right"
            effect="solid"
            className="page-header-tip"
            clickable={true}
          >
            {details}
          </ReactTooltip>
        </div>
      )}
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  details: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

export default PageHeader;
