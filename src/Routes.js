import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import About from "./About.js";
import API from "./API.js";
import "./App.css";
import DataConvert from "./data/DataConvert.js";
import DataExtract from "./data/DataExtract.js";
import DataInfo from "./data/DataInfo.js";
import DataMerge from "./data/DataMerge";
import DataMergeVisualize from "./data/DataMergeVisualize";
import DataMergeVisualizeRaw from "./data/DataMergeVisualizeRaw.js";
import DataQuery from "./data/DataQuery.js";
import DataVisualizeCytoscape from "./data/DataVisualizeCytoscape";
import DataVisualizeCytoscapeRaw from "./data/DataVisualizeCytoscapeRaw";
import DataVisualizeGraphviz from "./data/DataVisualizeGraphviz.js";
import DataVisualizeGraphvizRaw from "./data/DataVisualizeGraphvizRaw.js";
import EndpointExtract from "./endpoint/EndpointExtract.js";
import EndpointInfo from "./endpoint/EndpointInfo";
import EndpointQuery from "./endpoint/EndpointQuery";
import Home from "./Home.js";
import NotFound from "./NotFound.js";
import PermalinkReceiver from "./PermalinkReceiver";
import RDFShapeNavbar from "./RDFShapeNavbar";
import Shacl2Shex from "./shacl/Shacl2Shex";
import ShaclConvert from "./shacl/ShaclConvert";
import ShaclInfo from "./shacl/ShaclInfo";
import ShaclValidate from "./shacl/ShaclValidate";
import ShapeMapInfo from "./shapeMap/ShapeMapInfo";
import ShapeForm from "./shex/ShapeForm";
import Shex2Shacl from "./shex/Shex2Shacl";
import Shex2xmi from "./shex/Shex2xmi";
import ShexConvert from "./shex/ShexConvert";
import ShexInfo from "./shex/ShexInfo";
import ShexValidate from "./shex/ShexValidate";
import ShexValidateEndpoint from "./shex/ShexValidateEndpoint";
import ShexVisualizeUml from "./shex/ShexVisualizeUml";
import ShexVisualizeUmlRaw from "./shex/ShexVisualizeUmlRaw";
// Only for testing
import WikidataExtract from "./wikidata/WikidataExtract.js";
import WikidataQuery from "./wikidata/WikidataQuery.js";
import WikidataValidate from "./wikidata/WikidataValidate.js";

function Routes() {
  const renderWithNavbar = (Component) => {
    return (
      <>
        <RDFShapeNavbar />
        {renderWithoutNavbar(Component)}
      </>
    );
  };

  const renderWithoutNavbar = (Component) => {
    // eslint-disable-next-line no-restricted-globals
    const loc = location;
    return <Component location={loc.search ? loc : undefined} />;
  };

  return (
    <Router>
      <Switch>
        <Route path="/" exact render={() => renderWithNavbar(Home)} />
        <Route
          path={API.routes.client.dataInfoRoute}
          render={() => renderWithNavbar(DataInfo)}
        />
        <Route
          path={API.routes.client.dataConvertRoute}
          render={() => renderWithNavbar(DataConvert)}
        />
        <Route
          path={API.routes.client.dataVisualizeGraphvizRoute}
          render={() => renderWithNavbar(DataVisualizeGraphviz)}
        />
        {/* RAW visualization */}
        <Route
          path={API.routes.client.dataVisualizeGraphvizRouteRaw}
          render={() => renderWithoutNavbar(DataVisualizeGraphvizRaw)}
        />
        <Route
          path={API.routes.client.dataVisualizeCytoscapeRoute}
          render={() => renderWithNavbar(DataVisualizeCytoscape)}
        />
        {/* RAW visualization */}
        <Route
          path={API.routes.client.dataVisualizeCytoscapeRouteRaw}
          render={() => renderWithoutNavbar(DataVisualizeCytoscapeRaw)}
        />
        <Route
          path={API.routes.client.dataQueryRoute}
          render={() => renderWithNavbar(DataQuery)}
        />
        <Route
          path={API.routes.client.dataExtractRoute}
          render={() => renderWithNavbar(DataExtract)}
        />
        <Route
          path={API.routes.client.dataMergeRoute}
          render={() => renderWithNavbar(DataMerge)}
        />
        <Route
          path={API.routes.client.dataMergeVisualizeRoute}
          render={() => renderWithNavbar(DataMergeVisualize)}
        />
        {/* RAW visualization */}
        <Route
          path={API.routes.client.dataMergeVisualizeRouteRaw}
          render={() => renderWithoutNavbar(DataMergeVisualizeRaw)}
        />

        <Route
          path={API.routes.client.endpointInfoRoute}
          render={() => renderWithNavbar(EndpointInfo)}
        />
        <Route
          path={API.routes.client.endpointQueryRoute}
          render={() => renderWithNavbar(EndpointQuery)}
        />
        <Route
          path={API.routes.client.endpointExtractRoute}
          render={() => renderWithNavbar(EndpointExtract)}
        />

        <Route
          path={API.routes.client.shexValidateRoute}
          render={() => renderWithNavbar(ShexValidate)}
        />
        <Route
          path={API.routes.client.shexValidateEndpointRoute}
          render={() => renderWithNavbar(ShexValidateEndpoint)}
        />
        <Route
          path={API.routes.client.shexInfoRoute}
          render={() => renderWithNavbar(ShexInfo)}
        />
        <Route
          path={API.routes.client.shexVisualizeUmlRoute}
          render={() => renderWithNavbar(ShexVisualizeUml)}
        />
        {/* RAW visualization */}
        <Route
          path={API.routes.client.shexVisualizeUmlRouteRaw}
          render={() => renderWithoutNavbar(ShexVisualizeUmlRaw)}
        />
        <Route
          path={API.routes.client.shexConvertRoute}
          render={() => renderWithNavbar(ShexConvert)}
        />
        <Route
          path={API.routes.client.shex2ShaclRoute}
          render={() => renderWithNavbar(Shex2Shacl)}
        />
        <Route
          path={API.routes.client.shex2XmiRoute}
          render={() => renderWithNavbar(Shex2xmi)}
        />

        <Route
          path={API.routes.client.shapeFormRoute}
          render={() => renderWithNavbar(ShapeForm)}
        />

        <Route
          path={API.routes.client.shaclInfoRoute}
          render={() => renderWithNavbar(ShaclInfo)}
        />
        <Route
          path={API.routes.client.shaclValidateRoute}
          render={() => renderWithNavbar(ShaclValidate)}
        />
        <Route
          path={API.routes.client.shaclConvertRoute}
          render={() => renderWithNavbar(ShaclConvert)}
        />
        <Route
          path={API.routes.client.shacl2ShExRoute}
          render={() => renderWithNavbar(Shacl2Shex)}
        />

        <Route
          path={API.routes.client.shapeMapInfoRoute}
          render={() => renderWithNavbar(ShapeMapInfo)}
        />

        <Route
          path={API.routes.client.wikidataQueryRoute}
          render={() => renderWithNavbar(WikidataQuery)}
        />
        <Route
          path={API.routes.client.wikidataValidateRoute}
          render={() => renderWithNavbar(WikidataValidate)}
        />
        <Route
          path={API.routes.client.wikidataExtractRoute}
          render={() => renderWithNavbar(WikidataExtract)}
        />
        <Route
          path={API.routes.client.aboutRoute}
          render={() => renderWithNavbar(About)}
        />
        {/* Route to be shown for processing permalinks */}
        <Route
          path={API.routes.client.permalinkRoute}
          component={PermalinkReceiver}
        />
        <Route render={() => renderWithNavbar(NotFound)} />
      </Switch>
    </Router>
  );
}

export default Routes;
