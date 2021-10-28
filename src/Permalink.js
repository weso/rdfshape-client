import axios from "axios";
import FormData from "form-data";
import PropTypes from "prop-types";
import qs from "query-string";
import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ClipboardIcon from "react-open-iconic-svg/dist/ClipboardIcon";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactTooltip from "react-tooltip";
import API from "./API";
import { copyToClipboard, notificationSettings } from "./utils/Utils";

// Returns a promise that will return a shortened permalink generated on the server
// or the full-length permalink if the server response fails
export async function mkPermalink(route, params) {
  const url = mkPermalinkLong(route, params);
  return await mkPermalinkFromUrl(url);
}

export async function mkPermalinkFromUrl(url) {
  try {
    const res = await axios.get(API.serverPermalinkEndpoint, {
      params: { url },
    });
    // The server only returns the permalink code. The full link is: current host + code
    return `${getHost()}/link/${res.data}`;
  } catch (err) {
    console.error(
      `Error processing shortened permalink request for ${url}: ${err.message}`
    );
    return url;
  }
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

// Returns a tuple [status, message], the message being the target link or an error in case of failure
export async function getOriginalLink(code) {
  try {
    const res = await axios.get(API.serverOriginalLinkEndpoint, {
      params: { urlCode: code },
    });
    return [true, `${getHost()}${res.data}`];
  } catch (error) {
    const errorMsg = error.response
      ? `${error.response.data} (error ${error.response.status})`
      : `Error retrieving original link request for permalink '${code}': ${error.message}`;

    console.error(errorMsg);
    return [false, errorMsg];
  }
}

// Returns a tuple [status, message], the message being the original link or an error in case of failure
export async function getOriginalLinkFromUrl(url) {
  const urlCode = url.split("/").slice(-1)[0];
  return await getOriginalLink(urlCode);
}

export function Permalink(props) {
  const [loading, setLoading] = useState(false);
  const [permalink, setPermalink] = useState();

  async function handleClick(e) {
    e.preventDefault();

    // If a permalink has been generated already, copy to clipboard and notify
    if (permalink) {
      copyToClipboard(permalink);
      toast.info(notificationSettings.permalinkText);
      return;
    }

    // Set to loading
    setLoading(true);

    // Generate short URL / return the og link in case of error
    const newPermalink = props.shorten
      ? await mkPermalinkFromUrl(props.url)
      : props.url;

    // Copy results and update state
    copyToClipboard(newPermalink);
    setPermalink(newPermalink);
    setLoading(false);

    // Notify
    toast.info(notificationSettings.permalinkText);
  }

  if (props.url)
    return (
      <span
        data-tip
        data-for="permalinkTip"
        style={props.style ? props.style : null}
      >
        <Button
          disabled={!!props.disabled}
          className={"btn-with-icon " + (loading ? "disabled" : "")}
          onClick={handleClick}
          variant="secondary"
          href={permalink || props.url}
        >
          {props.text}
          {loading ? (
            <Spinner
              className="white-filler"
              animation="border"
              size="sm"
            ></Spinner>
          ) : (
            props.icon
          )}
        </Button>
        {props.disabled && (
          <ReactTooltip id="permalinkTip" place="top" effect="solid">
            {props.disabled === API.byTextSource
              ? "Can't generate links for long manual inputs, try inserting data by URL"
              : "Can't generate links for file-based inputs, try inserting data by URL"}
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
  icon: PropTypes.node,
};

Permalink.defaultProps = {
  text: "Permalink",
  shorten: true,
  icon: <ClipboardIcon className="white-icon" />,
};
