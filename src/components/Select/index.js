import classnames from "classnames";
import { graphql } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import { useFormContext } from "react-hook-form";
import InputWrapper from "../../components/InputWrapper";
import { valueToLowerCase } from "../../utils/helpers";

const Select = ({ fieldData, name, defaultValue, ...wrapProps }) => {
  const { choices, cssClass, isRequired, size } = fieldData;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <InputWrapper
      errors={errors?.[name] || {}}
      inputData={fieldData}
      labelFor={name}
      {...wrapProps}
    >
      <select
        aria-invalid={errors}
        aria-required={isRequired}
        //TODO: GF uses select2 library and classes, need to figure out how to handle here if we're mimicing their functionality
        className={classnames(
          "gravityform__field__input",
          "gravityform__field__input__select",
          "gfield_select",
          cssClass,
          valueToLowerCase(size)
        )}
        id={name}
        name={name}
        {...register(name, {
          required: isRequired && "This field is required",
        })}
        defaultValue={
          defaultValue !== ""
            ? defaultValue
            : choices.find((choice) => choice.isSelected)?.value
        }
      >
        {choices.map(({ text, value }, index) => {
          return (
            <option key={`${name}-${index}`} value={value}>
              {text}
            </option>
          );
        })}
      </select>
    </InputWrapper>
  );
};

export default Select;

Select.propTypes = {
  defaultValue: PropTypes.string,
  fieldData: PropTypes.shape({
    choices: PropTypes.array,
    cssClass: PropTypes.string,
    isRequired: PropTypes.bool,
    size: PropTypes.string,
  }),
  register: PropTypes.func,
  wrapProps: PropTypes.object,
};

export const SelectField = graphql`
  fragment SelectField on WpSelectField {
    adminLabel
    autocompleteAttribute
    canPrepopulate
    choices {
      isSelected
      text
      value
    }
    conditionalLogic {
      ...ConditionalLogic
    }
    cssClass
    defaultValue
    description
    descriptionPlacement
    errorMessage
    hasAutocomplete
    hasChoiceValue
    hasEnhancedUI
    inputName
    isRequired
    label
    placeholder
    shouldAllowDuplicates
    size
    value
  }
`;
