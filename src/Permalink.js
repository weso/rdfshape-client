import React from 'react';
import Button from "react-bootstrap/Button";
import qs from 'query-string';
import FormData from "form-data";
import PropTypes from "prop-types";
import axios from "axios";
import API from "./API";


// Returns a promise that will return a shortened permalink generated on the server
// or the full-length permalink if the server response fails
export function mkPermalink(route, params) {
    const permalink = getHost() +
        // "#" + // This one is added for HashBrowser
        route + "?" + qs.stringify(params)

    return axios.get(API.serverPermalinkEndpoint, {
        params: { 'url': permalink },
        headers: { 'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }
    })
        .then( res => {
            return res.data
        })
        .catch ( err => {
            console.error(`Error processing shortened permalink request for ${permalink}: ${err.message}`)
            return permalink
        })
}

export function params2Form(params) {
    let formData = new FormData()
    Object.keys(params).forEach(key => {
        console.log("Adding to formData: " + key + " =>" + params[key]);
        formData.append(key,params[key])
    });
    console.log("FormData in mkFormData: " + JSON.stringify(formData));
    return formData;
}

function getHost() {
    const port = window.location.port;
    return window.location.protocol + "//" +
        window.location.hostname + (port? ":" + port: "") ;
}

export function Permalink(props) {
    if (props.url)
        return <Button variant="success" href={props.url}>Permalink</Button>
    else
        return null
}

Permalink.propTypes = {
    url: PropTypes.string.isRequired,
};

