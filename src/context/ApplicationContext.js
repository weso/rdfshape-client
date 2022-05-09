import { createContext } from "react";
import { InitialDataStream } from "../data/Data";
import { InitialQuery } from "../query/Query";
import { InitialShacl } from "../shacl/Shacl";
import { InitialShapeMap } from "../shapeMap/ShapeMap";
import { InitialShex } from "../shex/Shex";
import { InitialUML } from "../uml/UML";

// Initial values in context
export const initialApplicationContext = {
  // Array of data (merge uses 2 units of data and more data compound could be added in the future)
  // See provider for the function to add new data
  rdfData: [],
  sparqlQuery: InitialQuery,
  sparqlEndpoint: "",
  shexSchema: InitialShex,
  shaclSchema: InitialShacl,
  shapeMap: InitialShapeMap,
  umlData: InitialUML,
  streamingData: { ...InitialDataStream, lastUsed: false },
};

// Shared context for storing the data the user is operating on
// and using it throughout the application (e.g.: for autifilling input forms when changing page)
export const ApplicationContext = createContext(initialApplicationContext);
