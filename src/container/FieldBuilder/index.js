import classnames from "classnames";
import React from "react";

import Captcha from "../../components/Captcha";
import Html from "../../components/Html";
import Input from "../../components/Input";
import Multiselect from "../../components/Multiselect";
import Select from "../../components/Select";
import SelectorList from "../../components/SelectorList";
import Textarea from "../../components/Textarea";
import { valueToLowerCase } from "../../utils/helpers";
import { islabelHidden } from "../../utils/inputSettings";

const FieldBuilder = ({
  databaseId,
  formFields,
  formLoading,
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
    } = field;

    const isHiddenField = type === "HIDDEN";

    let inputWrapperClass = classnames(
      "gfield",
      "gravityform__field",
      "gravityform__field__" + valueToLowerCase(type),
      { [`gravityform__field--${valueToLowerCase(size)}`]: size },
      field.cssClass,
      { "field-required": isRequired },
      { "hidden-label": islabelHidden(labelPlacement) },
      { gfield_contains_required: isRequired },
      {
        [`field_sublabel_${valueToLowerCase(
          subLabelPlacement
        )}`]: valueToLowerCase(subLabelPlacement),
      },
      {
        [`field_description_${valueToLowerCase(
          descriptionPlacement
        )}`]: descriptionPlacement,
      },
      `gfield_visibility_${
        valueToLowerCase ? "hidden" : valueToLowerCase(visibility)
      }`
    );

    const wrapId = `field_${databaseId}_${id}`;

    //TODO: Should this match GF version "input_form.id_input.id"
    const inputName = `input_${field.id}`;

    const defaultValue = presetValues?.[inputName] || field?.defaultValue || "";

    switch (field.type) {
      // Add note for unsupported captcha field
      case "CAPTCHA":
        return (
          <Captcha
            captchaTheme={captchaTheme}
            fieldData={field}
            key={id}
            gfId={id}
            name={inputName}
            wrapClassName={inputWrapperClass}
          />
        );
      case "HTML":
        return (
          <Html
            fieldData={field}
            key={id}
            gfId={id}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );
      // Start with the standard fields
      case "TEXT":
      case "NUMBER":
      case "EMAIL":
      case "HIDDEN":
      case "DATE":
      case "PHONE":
        return (
          <Input
            fieldData={field}
            key={id}
            gfId={id}
            name={inputName}
            defaultValue={defaultValue}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );
      case "TEXTAREA":
        return (
          <Textarea
            fieldData={field}
            defaultValue={defaultValue}
            key={id}
            gfId={id}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );
      case "SELECT":
        return (
          <Select
            fieldData={field}
            key={id}
            gfId={id}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );
      case "MULTISELECT":
        return (
          <Multiselect
            fieldData={field}
            key={id}
            gfId={id}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );
      case "RADIO":
      case "CHECKBOX":
        return (
          <SelectorList
            fieldData={field}
            key={id}
            gfId={id}
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
