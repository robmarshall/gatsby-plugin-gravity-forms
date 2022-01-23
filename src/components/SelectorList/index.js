import classnames from "classnames";
import { graphql } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import { useFormContext } from "react-hook-form";
import strings from "../../utils/strings";
import InputWrapper from "../InputWrapper";
import { valueToLowerCase } from "../../utils/helpers";

// TODO: Enable Select All Choice
const SelectorList = ({ fieldData, name, ...wrapProps }) => {
  const {
    id,
    choices,
    cssClass,
    isRequired,
    size,
    type: typeUpper,
  } = fieldData;

  const type = valueToLowerCase(typeUpper);

  const {
    register,
    formState: { errors },
  } = useFormContext();

  // Due to checkboxes and radios are seen in GraphQL each choice is given an
  // error parameter. However in practice only one error matters.
  // So we check to see if one error exists across all choices.
  const error = errors[name]?.filter(({ message }) => {
    if (message) {
      return true;
    }
  })?.[0];

  return (
    <InputWrapper
      errors={error}
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
                  valueToLowerCase(size)
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
    canPrepopulate
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
      ...ConditionalLogic
    }
    cssClass
    description
    descriptionPlacement
    errorMessage
    hasChoiceValue
    hasSelectAll
    inputs {
      id
      label
      name
    }
    inputName
    isRequired
    label
  }
`;

export const RadioField = graphql`
  fragment RadioField on WpRadioField {
    adminLabel
    canPrepopulate
    choices {
      isOtherChoice
      isSelected
      text
      value
    }
    conditionalLogic {
      ...ConditionalLogic
    }
    cssClass
    description
    descriptionPlacement
    hasChoiceValue
    hasOtherChoice
    errorMessage
    inputName
    isRequired
    label
    shouldAllowDuplicates
    value
  }
`;
