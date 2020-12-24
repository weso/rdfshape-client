import React from "react";
import Container from "react-bootstrap/Container";
import "./App.css";
import Routes from "./Routes.js";
// import Cyto from './components/Cyto.js';

function App() {
  return (
    <Container fluid={true}>
      <Routes />
    </Container>
  );
}

export default App;
