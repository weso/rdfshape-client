import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import "./App.css";
import {
  initialApplicationContext
} from "./context/ApplicationContext";
import ApplicationProvider from "./context/ApplicationProvider";
import Routes from "./Routes.js";

function App() {
  const [appContext, setAppContext] = useState(initialApplicationContext);
  return (
    <Container fluid={true}>
      <ApplicationProvider>
        <Routes />
      </ApplicationProvider>
    </Container>
  );
}

export default App;
