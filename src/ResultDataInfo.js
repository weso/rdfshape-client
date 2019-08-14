import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ServerHost from "./ServerHost";
import axios from 'axios';
import Form from "react-bootstrap/Form";
import DataTabs from "./DataTabs";

class ResultDataInfo extends React.Component {
 render() {
     return (
         <h1>Result: {JSON.stringify(this.props.msg)}</h1>
     );
 }
}

export default ResultDataInfo;
