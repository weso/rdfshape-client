import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";
import Tabs from "react-bootstrap/Tabs";
import API from "../API";
import Code from "../components/Code";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";
import $ from "jquery";

function ResultShapeForm(props)  {
  const result = props.result;
  let msg;

  const [activeTab, setActiveTab] = useState(props.activeTab);

  function handleTabChange(e) {
    setActiveTab(e);
  }
  
    useEffect(() => { 
	    $("#resultform").html(result.result);
		
      $( ".newButton" ).each(function(index) {
        $(this).on("click", function(){
          let id = $(this).prev().attr("id").replace(":", "\\:");
          $(this).prev().clone().insertAfter("#container-" + id);
        });
		  });

      $("#checkbtn").click(function() {
        if(! $("#shexgform")[0].checkValidity()) {
          $("#shexgform").find(':submit').click();
        }
      });
	});

  if (result === "") {
    msg = null;
  } else if (result.error || result.msg.toLowerCase().includes("error")) {
    msg = (
      <div>
        <Alert variant="danger">Invalid ShEx schema</Alert>
        <ul>
          <li className="word-break">{result.error || result.msg}</li>
        </ul>
      </div>
    );
  } else {
    msg = (
      <div id="resultform">
        
      </div>
    );
  }

  return <div>{msg}</div>;
}

ResultShapeForm.propTypes = {
  result: PropTypes.object,
  mode: PropTypes.string,
};

export default ResultShapeForm;
