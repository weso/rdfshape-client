import { createContext } from "react";
import { InitialData } from "../data/Data";
import { InitialQuery } from "../query/Query";
import { InitialShacl } from "../shacl/Shacl";
import { InitialShapeMap } from "../shapeMap/ShapeMap";
import { InitialShex } from "../shex/Shex";
import { InitialUML } from "../uml/UML";

// Initial values in context
export const initialApplicationContext = {
  rdfData: InitialData, // Array of data (merge uses 2 units of data and more data compound could be added in the future)
  sparqlQuery: InitialQuery,
  sparqlEndpoint: "",
  shexSchema: InitialShex,
  shaclSchema: InitialShacl,
  validationEndpoint: "", // Optional endpoint shown in ShaclValidate
  shapeMap: InitialShapeMap,
  umlData: InitialUML,
};

// Shared context for storing the data the user is operating on
// and using it throughout the application (e.g.: for autifilling input forms when changing page)
export const ApplicationContext = createContext(initialApplicationContext);
