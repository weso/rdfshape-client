import React from 'react';
import './App.css';
import RDFShapeNavbar from "./RDFShapeNavbar";
import Container from 'react-bootstrap/Container';
import Routes from './Routes.js';

function App() {

  return (
      <Container>
        <RDFShapeNavbar />
        <Routes />
      </Container>
  );
}

export default App;
