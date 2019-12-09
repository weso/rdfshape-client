import React from 'react';
import Button from "react-bootstrap/Button";
import qs from 'query-string';
import FormData from "form-data";
import PropTypes from "prop-types";
import SelectFormat from "./components/SelectFormat";


export function mkPermalink(route, params) {
    console.log(`mkPermalink: ${JSON.stringify(params)}`)
    const newUrl = getHost() + route + "?" + qs.stringify(params)
    console.log("mkPermalink newUrl: " + newUrl);
    return newUrl ;
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
        return <Button variant="secondary" href={props.url}>Permalink</Button>
    else
        return null
}

Permalink.propTypes = {
    url: PropTypes.string.isRequired,
};

