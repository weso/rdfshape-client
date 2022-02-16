import React, { useEffect, useReducer } from "react";
import API from "../API";
import { InitialData } from "../data/Data";
import {
  ApplicationContext,
  initialApplicationContext
} from "./ApplicationContext";

// Resort to session storage to persist session data
// Use Context API as middleware to parse and easily manipulate
// the data in session storage
// https://stackoverflow.com/a/62505656/9744696
const ApplicationProvider = ({ children }) => {
  // Reducer types
  const reducerTypes = Object.freeze({
    rdf: "rdf",
    addRdf: "addRdf",
    sparqlQuery: "sparql",
    sparqlEnpoint: "sparqlEndpoint",
    shex: "shex",
    shacl: "shacl",
    validationEndpoint: "validationEndpoint",
    shapeMap: "shapeMap",
    uml: "uml",
  });

  // Reducer function
  function applicationDataReducer(state, { type, value }) {
    // Last trap for nullish values
    if (!value) return state;

    // Trim text and URLs before storing
    const trimBeforeStore = (item) => ({
      ...item,
      textArea: item.textArea.trim(),
      url: item.url.trim(),
    });

    const finalValue = Array.isArray(value)
      ? value.map(trimBeforeStore)
      : typeof value === "object"
      ? trimBeforeStore(value)
      : typeof value === "string"
      ? value.trim()
      : value;

    switch (type) {
      case reducerTypes.rdf:
        return { ...state, rdfData: finalValue };
      case reducerTypes.addRdf:
        return {
          ...state,
          rdfData: [...state.rdfData, finalValue],
        };
      case reducerTypes.sparqlQuery:
        return { ...state, sparqlQuery: finalValue };
      case reducerTypes.sparqlEnpoint:
        return { ...state, sparqlEndpoint: finalValue };
      case reducerTypes.shex:
        return { ...state, shexSchema: finalValue };
      case reducerTypes.shacl:
        return { ...state, shaclSchema: finalValue };
      case reducerTypes.validationEndpoint:
        return { ...state, validationEndpoint: finalValue };
      case reducerTypes.shapeMap:
        return { ...state, shapeMap: finalValue };
      case reducerTypes.uml:
        return { ...state, umlData: finalValue };
      default:
        return state;
    }
  }

  // Reducer to handle the application data
  const [applicationData, dispatch] = useReducer(
    applicationDataReducer,
    getLocalStorage(API.sessionStorageDataKey, initialApplicationContext)
  );

  function setLocalStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // catch possible errors
    }
  }

  function getLocalStorage(key, initialValue) {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : initialValue;
    } catch (e) {
      // if error, return initial value
      return initialValue;
    }
  }

  // Update session data when context data changed
  useEffect(() => {
    setLocalStorage(API.sessionStorageDataKey, applicationData);
  }, [applicationData]);

  return (
    <ApplicationContext.Provider
      value={{
        ...applicationData,
        // Granular control over the data to be updated
        setRdfData: (rdfData) =>
          dispatch({ type: reducerTypes.rdf, value: rdfData }),
        addRdfData: (rdfData) => {
          const newIndex = applicationData.rdfData.length; // new Data index based on current context data
          // New data object, use InitialData if no data was provided
          const newData = {
            index: newIndex,
            ...(rdfData || InitialData),
          };
          dispatch({ type: reducerTypes.addRdf, value: newData }); // Update state and return new data
          return newData;
        },
        setSparqlQuery: (sparqlQuery) =>
          dispatch({ type: reducerTypes.sparqlQuery, value: sparqlQuery }),
        setSparqlEndpoint: (sparqlEndpoint) =>
          dispatch({ type: reducerTypes.sparqlEnpoint, value: sparqlEndpoint }),
        setShexSchema: (shexSchema) =>
          dispatch({ type: reducerTypes.shex, value: shexSchema }),
        setShaclSchema: (shaclSchema) =>
          dispatch({ type: reducerTypes.shacl, value: shaclSchema }),
        setValidationEndpoint: (vEndpoint) =>
          dispatch({ type: reducerTypes.validationEndpoint, value: vEndpoint }),
        setShapeMap: (shapeMap) =>
          dispatch({ type: reducerTypes.shapeMap, value: shapeMap }),
        setUmlData: (umlData) =>
          dispatch({ type: reducerTypes.uml, value: umlData }),
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export default ApplicationProvider;
