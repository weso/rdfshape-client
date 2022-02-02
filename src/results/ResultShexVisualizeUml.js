import React from "react";
import ShowVisualization, {
  visualizationTypes
} from "../visualization/ShowVisualization";

function ResultShExVisualize({
  result: shexVisualizeResponse,
  raw,
  embedLink,
  disabledLinks,
}) {
  const {
    result: { schema: outputSchema },
  } = shexVisualizeResponse;

  if (shexVisualizeResponse) {
    return (
      <ShowVisualization
        data={outputSchema}
        type={visualizationTypes.svgRaw}
        raw={raw}
        controls={true}
        embedLink={embedLink}
        disabledLinks={disabledLinks}
      />
    );
  }
}

export default ResultShExVisualize;
