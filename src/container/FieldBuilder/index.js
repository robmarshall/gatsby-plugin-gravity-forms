import classnames from "classnames";
import React from "react";

import Captcha from "../../components/Captcha";
import Html from "../../components/Html";
import Input from "../../components/Input";
import Multiselect from "../../components/Multiselect";
import Select from "../../components/Select";
import SelectorList from "../../components/SelectorList";
import Textarea from "../../components/Textarea";
import { get } from "../../utils/helpers";
import { islabelHidden } from "../../utils/inputSettings";

const FieldBuilder = ({
  formFields,
  formLoading,
  setFormLoading,
  presetValues,
}) => {
  // Loop through fields and create
  return formFields.map((field) => {
    // Set the wrapper classes
    const {
      id,
      captchaTheme,
      descriptionPlacement,
      isRequired,
      subLabelPlacement,
      labelPlacement,
      type,
      size,
      visibility,
      formId,
    } = field;

    let inputWrapperClass = classnames(
      "gfield",
      "gravityform__field",
      "gravityform__field__" + type,
      "gravityform__field--" + size,
      field.cssClass,
      { "field-required": isRequired },
      { "hidden-label": islabelHidden(labelPlacement) },
      { gfield_contains_required: isRequired },
      { [`field_sublabel_${subLabelPlacement}`]: subLabelPlacement },
      `field_description_${descriptionPlacement}`,
      `gfield_visibility_${visibility}`
    );

    const wrapId = `field_${formId}_${id}`;

    //TODO: Should this match GF version "input_form.id_input.id"
    const inputName = `input_${field.id}`;

    switch (field.type) {
      // Add note for unsupported captcha field
      case "captcha":
        return (
          <Captcha
            captchaTheme={captchaTheme}
            fieldData={field}
            key={id}
            name={inputName}
            wrapClassName={inputWrapperClass}
          />
        );
      // Start with the standard fields
      case "text":
      case "number":
      case "email":
      case "hidden":
      case "date":
      case "phone":
        return (
          <Input
            fieldData={field}
            key={id}
            name={inputName}
            defaultValue={
              get(presetValues, inputName, false) || field.defaultValue
            }
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );
      case "textarea":
        return (
          <Textarea
            fieldData={field}
            defaultValue={
              get(presetValues, inputName, false) || field.defaultValue
            }
            key={id}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );
      case "select":
        return (
          <Select
            fieldData={field}
            key={id}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );
      case "multiselect":
        return (
          <Multiselect
            fieldData={field}
            key={id}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );
      case "radio":
      case "checkbox":
        return (
          <SelectorList
            fieldData={field}
            key={id}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );
      case "html":
        return (
          <Html
            fieldData={field}
            key={id}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );

      default:
        return null;
    }
  });
};

export default FieldBuilder;
