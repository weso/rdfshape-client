import axios from "axios";
import FormData from "form-data";
import PropTypes from "prop-types";
import qs from "query-string";
import React from "react";
import Button from "react-bootstrap/Button";
import { ClipboardIcon } from "react-open-iconic-svg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactTooltip from "react-tooltip";
import API from "./API";
import { notificationSettings } from "./utils/Utils";

// Returns a promise that will return a shortened permalink generated on the server
// or the full-length permalink if the server response fails
export function mkPermalink(route, params) {
  const permalink = mkPermalinkLong(route, params);

  return axios
    .get(API.serverPermalinkEndpoint, {
      params: { url: permalink },
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(
        `Error processing shortened permalink request for ${permalink}: ${err.message}`
      );
      return permalink;
    });
}

export function mkPermalinkLong(route, params) {
  return (
    getHost() +
    // "#" + // This one is added for HashBrowser
    route +
    "?" +
    qs.stringify(params)
  );
}

export function params2Form(params) {
  let formData = new FormData();
  Object.keys(params).forEach((key) => {
    formData.append(key, params[key]);
  });
  return formData;
}

function getHost() {
  const port = window.location.port;
  return (
    window.location.protocol +
    "//" +
    window.location.hostname +
    (port ? ":" + port : "")
  );
}

function handleClick(e) {
  e.preventDefault();
  // Create a dummy input to copy the link from it
  const dummy = document.createElement("input");

  // Add to document
  document.body.appendChild(dummy);
  dummy.setAttribute("id", "dummy_id");

  // Output the link into it
  document.getElementById("dummy_id").value = e.target.getAttribute("href");

  // Select it
  dummy.select();

  // Copy its contents
  document.execCommand("copy");

  // Remove it as its not needed anymore
  document.body.removeChild(dummy);

  toast.info(notificationSettings.permalinkText);
}

export function Permalink(props) {
  if (props.url)
    return (
      <span
        data-tip
        data-for="permalinkTip"
        style={props.style ? props.style : null}
      >
        <Button
          disabled={!!props.disabled}
          onClick={handleClick}
          className="btn-with-icon"
          variant="secondary"
          href={props.url}
        >
          Permalink <ClipboardIcon className="white-icon" />
        </Button>
        {props.disabled && (
          <ReactTooltip id="permalinkTip" place="top" effect="solid">
            {props.disabled === API.byTextTab
              ? "Can't generate permalinks for long manual inputs, try validating by URL"
              : "Can't generate permalinks for file-based validations, try validating by URL"}
          </ReactTooltip>
        )}
        <ToastContainer
          position={notificationSettings.position}
          autoClose={notificationSettings.autoClose}
          hideProgressBar={notificationSettings.hideProgressBar}
          closeOnClick={notificationSettings.closeOnClick}
          pauseOnFocusLoss={notificationSettings.pauseOnFocusLoss}
          pauseOnHover={notificationSettings.pauseOnHover}
          closeButton={notificationSettings.closeButton}
          transition={notificationSettings.transition}
          limit={notificationSettings.limit}
        />
      </span>
    );
  return null;
}

Permalink.propTypes = {
  url: PropTypes.string.isRequired,
  disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};
