import classnames from "classnames";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import React from "react";
import { useFormContext } from "react-hook-form";
import strings from "../../utils/strings";
import InputWrapper from "../InputWrapper";

const standardType = (type) => {
  switch (type) {
    case "phone":
      return "tel";
    case "fileupload":
      return "file";
    default:
      return type;
  }
};

const Input = ({ defaultValue, fieldData, name, ...wrapProps }) => {
  const {
    cssClass,
    inputMaskValue,
    isRequired,
    maxLength,
    placeholder,
    size,
    type,
  } = fieldData;

  const regex = inputMaskValue ? new RegExp(inputMaskValue) : false;
  let inputType = standardType(type);

  const { register, errors } = useFormContext();

  return (
    <InputWrapper
      errors={errors?.[name] || {}}
      inputData={fieldData}
      labelFor={name}
      {...wrapProps}
    >
      <input
        aria-invalid={errors}
        aria-required={isRequired}
        className={classnames(
          "gravityform__field__input",
          `gravityform__field__input__${type}`,
          cssClass,
          size
        )}
        defaultValue={defaultValue}
        id={name}
        maxLength={maxLength || 524288} // 524288 = 512kb, avoids invalid prop type error if maxLength is undefined.
        name={name}
        placeholder={placeholder}
        {...register(name, {
          required: isRequired && strings.errors.required,
          maxlength: {
            value: maxLength > 0 && maxLength,
            message:
              maxLength > 0 &&
              `${strings.errors.maxChar.front}  ${maxLength} ${strings.errors.maxChar.back}`,
          },
          pattern: {
            value: regex,
            message: regex && strings.errors.pattern,
          },
        })}
        type={inputType}
      />
    </InputWrapper>
  );
};

export default Input;

Input.propTypes = {
  defaultValue: PropTypes.string,
  fieldData: PropTypes.shape({
    cssClass: PropTypes.string,
    inputMaskValue: PropTypes.string,
    maxLength: PropTypes.number,
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool,
    type: PropTypes.string,
    size: PropTypes.string,
  }),
  value: PropTypes.string,
  name: PropTypes.string,
  wrapProps: PropTypes.object,
};

export const TextField = graphql`
  fragment TextField on WpTextField {
    id
    cssClass
    errorMessage
    defaultValue
    description
    descriptionPlacement
    visibility
    value
    type
    size
    placeholder
    pageNumber
    noDuplicates
    maxLength
    layoutSpacerGridColumnSpan
    layoutGridColumnSpan
    label
    inputName
    isRequired
    formId
    enablePasswordInput
    enableAutocomplete
    autocompleteAttribute
    allowsPrepopulate
    adminOnly
    adminLabel
    conditionalLogic {
      actionType
      logicType
      rules {
        fieldId
        operator
        value
      }
    }
  }
`;

export const DateField = graphql`
  fragment DateField on WpDateField {
    adminLabel
    adminOnly
    allowsPrepopulate
    calendarIconType
    calendarIconUrl
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
    dateFormat
    dateType
    defaultValue
    description
    descriptionPlacement
    errorMessage
    formId
    id
    inputName
    inputs {
      customLabel
      defaultValue
      id
      label
      placeholder
    }
    isRequired
    label
    layoutGridColumnSpan
    layoutSpacerGridColumnSpan
    noDuplicates
    pageNumber
    placeholder
    size
    subLabelPlacement
    type
    value
    visibility
  }
`;

export const EmailField = graphql`
  fragment EmailField on WpEmailField {
    adminLabel
    adminOnly
    allowsPrepopulate
    autocompleteAttribute
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
    defaultValue
    description
    descriptionPlacement
    emailConfirmEnabled
    enableAutocomplete
    errorMessage
    formId
    id
    inputName
    inputs {
      autocompleteAttribute
      customLabel
      defaultValue
      id
      label
      name
      placeholder
    }
    isRequired
    label
    layoutGridColumnSpan
    layoutSpacerGridColumnSpan
    noDuplicates
    pageNumber
    placeholder
    size
    subLabelPlacement
    type
    value
    visibility
  }
`;

export const HiddenField = graphql`
  fragment HiddenField on WpHiddenField {
    allowsPrepopulate
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
    defaultValue
    formId
    id
    inputName
    label
    layoutGridColumnSpan
    layoutSpacerGridColumnSpan
    pageNumber
    size
    type
    value
  }
`;

export const NumberField = graphql`
  fragment NumberField on WpNumberField {
    adminLabel
    adminOnly
    allowsPrepopulate
    autocompleteAttribute
    calculationFormula
    calculationRounding
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
    defaultValue
    description
    descriptionPlacement
    enableAutocomplete
    enableCalculation
    errorMessage
    formId
    id
    inputName
    isRequired
    label
    layoutGridColumnSpan
    layoutSpacerGridColumnSpan
    noDuplicates
    numberFormat
    pageNumber
    placeholder
    rangeMax
    rangeMin
    size
    type
    value
    visibility
  }
`;

export const PhoneField = graphql`
  fragment PhoneField on WpPhoneField {
    adminLabel
    adminOnly
    allowsPrepopulate
    autocompleteAttribute
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
    defaultValue
    description
    descriptionPlacement
    enableAutocomplete
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
    phoneFormat
    placeholder
    size
    type
    value
    visibility
  }
`;
