import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import API from "../API";
import InputTabsWithFormat from "../components/InputTabsWithFormat";
import { ApplicationContext } from "../context/ApplicationContext";

function DataTabs(props) {
  // Get data and its setter from context
  const { rdfData: ctxDataSet, setRdfData: setCtxDataSet } = useContext(
    ApplicationContext
  );

  const [dataIndex] = useState(props?.data?.index);

  // Change context when the contained data changes
  useEffect(() => {
    // const newDataset = ctxDataSet.reduce(
    //   (acc, curr, idx) =>
    //     dataIndex === idx ? [...acc, props.data] : [...acc, curr],
    //   []
    // );
    setCtxDataSet(props.data);
  }, [props.data]);

  return (
    <div>
      <InputTabsWithFormat
        nameInputTab={props.name}
        activeSource={props.activeSource || ctxDataSet.activeSource} // Change according to data in context when needed
        handleTabChange={props.handleTabChange}
        byTextName={props.subname}
        textAreaValue={props.textAreaValue || ctxDataSet.textArea}
        byTextPlaceholder={API.texts.placeholders.rdf}
        handleByTextChange={props.handleByTextChange}
        handleUrlChange={props.handleDataUrlChange}
        urlValue={props.urlValue || ctxDataSet[dataIndex]?.url}
        byURLPlaceholder={API.texts.placeholders.url}
        handleFileUpload={props.handleFileUpload}
        selectedFormat={props.selectedFormat || ctxDataSet.format}
        handleFormatChange={props.handleDataFormatChange}
        urlFormats={API.routes.server.dataFormatsInput}
        setCodeMirror={props.setCodeMirror}
        fromParams={props.fromParams || ctxDataSet.fromParams}
        resetFromParams={props.resetFromParams}
      />
    </div>
  );
}

DataTabs.propTypes = {
  data: PropTypes.object.isRequired,
  activeSource: PropTypes.string,
  handleTabChange: PropTypes.func.isRequired,
  textAreaValue: PropTypes.string,
  handleByTextChange: PropTypes.func.isRequired,
  urlValue: PropTypes.string.isRequired,
  handleDataUrlChange: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func.isRequired,

  selectedFormat: PropTypes.string.isRequired,
  handleDataFormatChange: PropTypes.func.isRequired,

  resetFromParams: PropTypes.func,
  fromParams: PropTypes.bool,
};

DataTabs.defaultProps = {
  name: API.texts.dataTabs.dataHeader,
  subname: "",
  selectedFormat: API.formats.defaultData,
  activeSource: API.sources.default,
};

export default DataTabs;
