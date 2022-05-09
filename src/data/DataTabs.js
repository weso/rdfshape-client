import PropTypes from "prop-types";
import React, { useContext, useEffect } from "react";
import API from "../API";
import InputTabsWithFormat from "../components/InputTabsWithFormat";
import { ApplicationContext } from "../context/ApplicationContext";

function DataTabs(props) {
  // Get data and its setter from context
  const {
    rdfData: ctxDataSet,
    setRdfData: setCtxDataSet,
    streamingData: ctxStreamingData,
    setStreamingData: setCtxStreamingData,
  } = useContext(ApplicationContext);

  const dataIndex = props?.data?.index;

  // Change context when the contained data changes
  useEffect(() => {
    if (props.data) {
      // Reducer, insert the modified data in the corresponding index
      const newDataset = ctxDataSet.reduce(
        (acc, curr) =>
          dataIndex === curr.index ? [...acc, props.data] : [...acc, curr],
        []
      );
      setCtxDataSet(newDataset);
    }
  }, [props.data]);

  // Change context when the contained stream data changes
  useEffect(() => {
    if (props.allowStream) {
      setCtxStreamingData(props.streamValue);
    }
  }, [props.streamValue]);

  return (
    <div>
      <InputTabsWithFormat
        nameInputTab={props.name}
        activeSource={props.activeSource || ctxDataSet[dataIndex]?.activeSource} // Change according to data in context when needed
        handleTabChange={props.handleTabChange}
        byTextName={props.subname}
        textAreaValue={props.textAreaValue || ctxDataSet[dataIndex]?.textArea}
        byTextPlaceholder={API.texts.placeholders.rdf}
        handleByTextChange={props.handleByTextChange}
        handleUrlChange={props.handleDataUrlChange}
        urlValue={props.urlValue || ctxDataSet[dataIndex]?.url}
        byURLPlaceholder={API.texts.placeholders.url}
        handleFileUpload={props.handleFileUpload}
        selectedFormat={props.selectedFormat || ctxDataSet[dataIndex]?.format}
        handleFormatChange={props.handleDataFormatChange}
        urlFormats={API.routes.server.dataFormatsInput}
        setCodeMirror={props.setCodeMirror}
        fromParams={props.fromParams || ctxDataSet[dataIndex]?.fromParams}
        resetFromParams={props.resetFromParams}
        allowStream={props.allowStream}
        streamValue={props.streamValue || ctxStreamingData}
        handleStreamChange={props.handleStreamChange}
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

  streamValue: PropTypes.object,
  handleStreamChange: PropTypes.func,
  allowStream: PropTypes.bool.isRequired,
};

DataTabs.defaultProps = {
  name: API.texts.dataTabs.dataHeader,
  subname: "",
  selectedFormat: API.formats.defaultData,
  activeSource: API.sources.default,
  allowStream: false,
};

export default DataTabs;
