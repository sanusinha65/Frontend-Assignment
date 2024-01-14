import React from "react";
import { useState } from "react";
import data from "../data";
import '../App.css';

function AutoFormMaker() {
  let formData = "";

  //function for setting the value of the textarea field to a global variable formdata that will help in making the form.
  const setFormData = (event) => {
    const newData = document.getElementById("data").value;
    let formData = newData;
    // checking if the json is correct or not
    if(isJSON(newData)==true){
        formData = JSON.parse(newData);
        document.getElementById("errorMessage").style.display = "none";
        makeFormUI(formData);
    }else{
        // for showing error message
        document.getElementById("errorMessage").style.display = "block";
    }
  };

  const makeFormUI = (formData) => {
    let formDiv = document.getElementById("newForm");
    formDiv.innerHTML = "";
    for (let i = 0; i < formData.length; i++) {
      // creating the initial div
      const parameter = formData[i];
      document.getElementById("submitBtn").disabled = false;
      const elementDiv = document.createElement("div");
      elementDiv.id = "sort" + parameter.sort;
      elementDiv.className = "col-md-12 col-12";
      formDiv.appendChild(elementDiv);
      // creating the sort div with their ids
      let sortDivs = document.getElementById(elementDiv.id);
      let newDiv = document.createElement("div");
      newDiv.className = "row mt-2";
      let newElements = document.createElement("label");
      newElements.className = "col-4";
      newElements.textContent = parameter.label;
      let fieldType;
      // creating switch case for checking the uiType
      switch (parameter.uiType.toLowerCase()) {
        case "input":
          fieldType = document.createElement("input");
          fieldType.type = "text";
          fieldType.name = parameter.jsonKey;
          fieldType.id=parameter.jsonKey;
          fieldType.disabled = parameter.validate.immutable;
          fieldType.required = parameter.validate.required;
          fieldType.placeholder = parameter.placeholder || "Enter";
          break;
        case "select":
          fieldType = document.createElement("select");
          fieldType.name = parameter.jsonKey;
          fieldType.id=parameter.jsonKey;
          fieldType.disabled = parameter.validate.immutable;
          fieldType.required = parameter.validate.required;
          parameter.validate.options.forEach((option) => {
            let optionElement = document.createElement("option");
            optionElement.value = option.value;
            optionElement.text = option.label;
            fieldType.add(optionElement);
          });
          fieldType.value = parameter.validate.defaultValue;
          break;
        case "group":

          // conditioning the group changes
          fieldType = document.createElement("div");
          fieldType.className = "group-container";
          let groupLabel = document.createElement("label");
          groupLabel.className = "col-12 mt-2";
          groupLabel.textContent = parameter.label;
          fieldType.appendChild(groupLabel);
          // Check if subParameters exist and have options
          if (parameter.subParameters && parameter.subParameters.length > 0) {
            for (let j = 0; j < parameter.subParameters.length; j++) {
              let subParameter = parameter.subParameters[j];
              let subParameterDiv = document.createElement("div");
              subParameterDiv.className = "sub-parameter-container mt-3";
              
              let subParameterLabel = document.createElement("label");
              subParameterLabel.className = "col-6";
              subParameterLabel.textContent = subParameter.label;
              subParameterDiv.appendChild(subParameterLabel);
              // conditioning the group fields 
              switch (subParameter.uiType.toLowerCase()) {
                case "select":
                  let selectElement = document.createElement("select");
                  selectElement.className = "col-6";
                  selectElement.name = subParameter.jsonKey;
                  selectElement.id=subParameter.jsonKey;
                  selectElement.disabled = subParameter.validate.immutable;
                  selectElement.required = subParameter.validate.required;
  
                  if (subParameter.validate.options) {
                    subParameter.validate.options.forEach((option) => {
                      let optionElement = document.createElement("option");
                      optionElement.value = option.value;
                      optionElement.text = option.label;
                      selectElement.add(optionElement);
                    });
                  }
                  selectElement.value = subParameter.validate.defaultValue;
                  subParameterDiv.appendChild(selectElement);
                  break;
                case "switch":
                  let switchElement = document.createElement("input");
                  switchElement.type = "checkbox";
                  switchElement.name = subParameter.jsonKey;
                  switchElement.id=subParameter.jsonKey;
                  switchElement.className = "";
                  switchElement.disabled = subParameter.validate.immutable;
                  switchElement.checked = subParameter.validate.defaultValue;
                  subParameterDiv.appendChild(switchElement);

                  break;
                case "radio":
                  subParameter.validate.options.forEach((option) => {
                    let radioLabel = document.createElement("label");
                    radioLabel.className = "col-3";
                    let radioInput = document.createElement("input");
                    radioInput.type = "radio";
                    radioInput.name = subParameter.jsonKey;
                    radioInput.value = option.value;
                    radioInput.checked= option.value===subParameter.validate.defaultValue;
                    radioInput.id=subParameter.jsonKey;
                    radioInput.disabled = subParameter.validate.immutable;
                    radioInput.required = subParameter.validate.required;
                    radioLabel.appendChild(radioInput);
                    radioLabel.appendChild(
                      document.createTextNode(option.label)
                    );
                    subParameterDiv.appendChild(radioLabel);
                  });
                  break;
                default:
                  console.error(`Unknown UI type: ${subParameter.uiType}`);
                  break;
              }
              fieldType.appendChild(subParameterDiv);
            }
          }
          break;
        default:
          console.error(`Unknown UI type: ${parameter.uiType}`);
          break;
      }
      fieldType.className = "col-6";
      newDiv.appendChild(newElements);
      newDiv.appendChild(fieldType);
      sortDivs.appendChild(newDiv);
    }
  };
  
  // function to check whether the submitted form data is valid or not to guide user in submitting form data that is valid
  function isJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  }

  function submitFormData(){
    console.log("Name;", document.getElementById("name").value);
    console.log("Type", document.getElementById("type").value);
    console.log("Sauce", document.getElementById("sauce").value);
    console.log("Main_topping",document.getElementById("main_topping").value);
    console.log("Include_seasonings",document.getElementById("include_seasonings").value);
    console.log("Second_topping",document.getElementById("second_topping").value);
    console.log("Size",document.getElementById("size").value);
  }
  return (
    <>
      <div className="container-fluid">
        <div className="row pt-5">
          <div className="col-12 col-md-6">
            <h1>Paste Your JSON Below</h1>
            <textarea id="data" className="form-control h-100"></textarea>
            <br />
            <p
              id="errorMessage"
              className="text-danger"
              style={{ display: "none" }}
            >
              Please Enter Correct JSON Format
            </p>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={setFormData}
            >
              Submit
            </button>
          </div>
          <div className="col-12 col-md-6">
            <h1>Auto Made Form</h1>
            <div className="row" id="newForm"></div>
            <button type="button" id="submitBtn" className="btn btn-success" onClick={submitFormData} disabled>Submit</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AutoFormMaker;