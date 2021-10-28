import classnames from "classnames";
import { graphql } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import { useFormContext } from "react-hook-form";
import InputWrapper from "../../components/InputWrapper";
import { valueToLowerCase } from "../../utils/helpers";

const Multiselect = ({ fieldData, name, ...wrapProps }) => {
  const { choices, cssClass, id, isRequired, size } = fieldData;
  const options = JSON.parse(choices);

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
        //TODO: GF uses select2 library and classes, need to figure out how to handle here if we're mimicing their functionality
        className={classnames(
          "gravityform__field__input__select",
          "gfield_select",
          cssClass,
          valueToLowerCase(size)
        )}
        id={name}
        multiple={true}
        name={name}
        {...register(name, {
          required: isRequired,
        })}
      >
        {options.map(({ isSelected, text, value }, index) => {
          return (
            <option
              defaultValue={isSelected}
              key={`${id}_${index}`}
              value={value}
            >
              {text}
            </option>
          );
        })}
      </select>
    </InputWrapper>
  );
};

export default Multiselect;

Multiselect.propTypes = {
  fieldData: PropTypes.shape({
    cssClass: PropTypes.string,
    id: PropTypes.number,
    choices: PropTypes.string,
    size: PropTypes.string,
    isRequired: PropTypes.bool,
  }),
  name: PropTypes.string,
  wrapProps: PropTypes.object,
};

export const MultiSelectField = graphql`
  fragment MultiSelectField on WpMultiSelectField {
    adminLabel
    adminOnly
    allowsPrepopulate
    choices {
      isSelected
      text
      value
    }
    conditionalLogic {
      actionType
      logicType
      rules {
        fieldId
        operator
        value
      }
    }
    cssClass
    description
    descriptionPlacement
    enableChoiceValue
    enableEnhancedUI
    errorMessage
    formId
    id
    inputName
    isRequired
    label
    layoutGridColumnSpan
    layoutSpacerGridColumnSpan
    pageNumber
    size
    type
    values
    visibility
  }
`;
