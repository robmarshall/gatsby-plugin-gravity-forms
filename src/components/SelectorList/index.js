import classnames from "classnames";
import { graphql } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import { useFormContext } from "react-hook-form";
import { filteredKeys } from "../../utils/helpers";
import strings from "../../utils/strings";
import InputWrapper from "../InputWrapper";

// TODO: Enable Select All Choice
const SelectorList = ({ fieldData, name, ...wrapProps }) => {
  const { id, choices, cssClass, isRequired, size, type } = fieldData;

  const { register, errors } = useFormContext();

  const errorKey = filteredKeys(errors, RegExp(`input_${id}_`));

  return (
    <InputWrapper
      errors={errorKey.length > 0 ? errors[errorKey[0]] : null}
      inputData={fieldData}
      labelFor={name}
      {...wrapProps}
    >
      <ul className={`gfield_${type}`} id={name}>
        {choices.map(({ isSelected, text, value }, index) => {
          const choiceID = index + 1;
          return (
            <li key={`${name}-${index + 1}`}>
              <input
                className={classnames(
                  `gravityform__field__input__${type}`,
                  `gravityform__field__input__${type}--` + choiceID,
                  cssClass,
                  size
                )}
                defaultChecked={isSelected}
                id={`${name}_${choiceID}`}
                name={`${name}${type === "checkbox" ? `.${choiceID}` : ""}`}
                {...register(
                  `${name}${type === "checkbox" ? `.${choiceID}` : ""}`,
                  {
                    required: isRequired && strings.errors.required,
                  }
                )}
                type={type}
                value={value}
              />
              &nbsp;
              <label
                htmlFor={`${name}_${choiceID}`}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </li>
          );
        })}
      </ul>
    </InputWrapper>
  );
};

export default SelectorList;

SelectorList.propTypes = {
  fieldData: PropTypes.shape({
    choices: PropTypes.array,
    cssClass: PropTypes.string,
    id: PropTypes.number,
    isRequired: PropTypes.bool,
    size: PropTypes.string,
    type: PropTypes.string,
  }),
  name: PropTypes.string,
  wrapProps: PropTypes.object,
};

export const CheckboxField = graphql`
  fragment CheckboxField on WpCheckboxField {
    adminLabel
    adminOnly
    allowsPrepopulate
    checkboxValues {
      inputId
      value
    }
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
    enablePrice
    enableSelectAll
    errorMessage
    formId
    id
    inputName
    inputs {
      id
      label
      name
    }
    isRequired
    label
    layoutGridColumnSpan
    layoutSpacerGridColumnSpan
    pageNumber
    size
    type
    visibility
  }
`;

export const RadioField = graphql`
  fragment RadioField on WpRadioField {
    adminLabel
    adminOnly
    allowsPrepopulate
    choices {
      isOtherChoice
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
    enableOtherChoice
    enablePrice
    errorMessage
    formId
    id
    inputName
    isRequired
    label
    layoutGridColumnSpan
    layoutSpacerGridColumnSpan
    noDuplicates
    pageNumber
    size
    type
    value
    visibility
  }
`;
