import classnames from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { graphql } from "gatsby";
import { useMutation } from "@apollo/client";
import { useForm, FormProvider } from "react-hook-form";
import FormGeneralError from "./components/FormGeneralError";
import FieldBuilder from "./container/FieldBuilder";
import {
  handleGravityFormsValidationErrors,
  // manageMainFormError,
} from "./utils/manageErrors";
import {
  submissionHasOneFieldEntry,
  cleanGroupedFields,
} from "./utils/manageFormData";
import submitMutation from "./submitMutation";
// import passToGravityForms from './utils/passToGravityForms'
import { valueToLowerCase } from "./utils/helpers";
/**
 * Component to take Gravity Form graphQL data and turn into
 * a fully functional form.
 * @param {mixed} data Form dataset from graphQL
 */
const GravityFormForm = ({
  data,
  presetValues = {},
  successCallback = ({ reset }) => reset(),
  errorCallback,
  controls,
}) => {
  const {
    button,
    confirmation,
    description,
    descriptionPlacement,
    labelPlacement,
    subLabelPlacement,
    formFields,
    formId,
    title,
  } = data?.wpGravityFormsForm;

  const [submitForm, { data: submittionData, loading, error }] = useMutation(
    submitMutation
  );

  console.log(submittionData, loading, error);

  // Pull in form functions
  const methods = useForm();
  const { watch, handleSubmit, reset, setError } = methods;

  useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      console.log(value, name, type)
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  const [generalError, setGeneralError] = useState("");
  const [formLoading, setLoadingState] = useState(false);

  // State for confirmation message
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const onSubmitCallback = async (values) => {
    console.log(values);
    // submitForm({
    //   variables: {
    //     formId: formId,
    //     fieldValues: values,
    //   },
    // }).catch((error) => {
    //   console.error(error);
    // });
  };

  // const onSubmitCallback = async (values) => {
  //     // Make sure we are not already waiting for a response
  //     if (!formLoading) {
  //         // Clean error
  //         setGeneralError('')
  //
  //         // Check that at least one field has been filled in
  //         if (submissionHasOneFieldEntry(values)) {
  //             setLoadingState(true)
  //
  //             const filteredValues = cleanGroupedFields(values)
  //
  //             // const { data, status } = await passToGravityForms({
  //             //     baseUrl: singleForm.apiURL,
  //             //     formData: filteredValues,
  //             //     id,
  //             //     lambdaEndpoint: lambda,
  //             // })
  //
  //             setLoadingState(false)
  //
  //             if (status === 'error') {
  //                 // Handle the errors
  //                 // First check to make sure we have the correct data
  //
  //                 if (data?.status === 'gravityFormErrors') {
  //                     // Pass messages to handle that sets react-hook-form errors
  //                     handleGravityFormsValidationErrors(
  //                         data.validation_messages,
  //                         setError
  //                     )
  //                 } else {
  //                     // Seemed to be an unknown issue
  //                     setGeneralError('unknownError')
  //                 }
  //
  //                 errorCallback &&
  //                     errorCallback({ filteredValues, error: data, reset })
  //             }
  //
  //             if (status === 'success') {
  //                 const { confirmation_message } = data?.data
  //
  //                 const { confirmations } = singleForm
  //
  //                 const confirmation = confirmations?.find(
  //                     (el) => el.isDefault
  //                 )
  //
  //                 setConfirmationMessage(
  //                     confirmation_message || confirmation?.message || false
  //                 )
  //
  //                 successCallback({
  //                     filteredValues,
  //                     reset,
  //                     confirmations,
  //                 })
  //             }
  //         } else {
  //             setGeneralError('leastOneField')
  //         }
  //     }
  // }

  if (!confirmationMessage) {
    return (
      <div className="gform_wrapper" id={`gform_wrapper_${formId}`}>
        <div className="gform_anchor" id={`gf_${formId}`} />

        <FormProvider {...methods}>
          <form
            className={
              formLoading
                ? `gravityform gravityform--loading gravityform--id-${formId}`
                : `gravityform gravityform--id-${formId}`
            }
            id={`gfrom_${formId}`}
            key={`gfrom_-${formId}`}
            onSubmit={handleSubmit(onSubmitCallback)}
          >
            {generalError && <FormGeneralError errorCode={generalError} />}
            <div className="gform_body">
              <ul
                className={classnames(
                  "gform_fields",
                  {
                    [`form_sublabel_${valueToLowerCase(
                      subLabelPlacement
                    )}`]: valueToLowerCase(subLabelPlacement),
                  },
                  `description_${valueToLowerCase(descriptionPlacement)}`,
                  `${valueToLowerCase(labelPlacement)}`
                )}
                id={`gform_fields_${formId}`}
              >
                <FieldBuilder
                  formLoading={formLoading}
                  setFormLoading={setLoadingState}
                  formFields={formFields.nodes}
                  presetValues={presetValues}
                  labelPlacement={labelPlacement}
                />
              </ul>
            </div>

            <div className={`gform_footer ${valueToLowerCase(labelPlacement)}`}>
              <button
                className="gravityform__button gform_button button"
                disabled={formLoading}
                id={`gform_submit_button_${formId}`}
                type="submit"
              >
                {formLoading ? (
                  <span className="gravityform__button__loading_span">
                    Loading
                  </span>
                ) : (
                  button?.text
                )}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    );
  }

  return (
    <div
      /* eslint-disable react/no-danger */
      dangerouslySetInnerHTML={{ __html: confirmations[0].message }}
    />
  );
};

GravityFormForm.propTypes = {
  errorCallback: PropTypes.func,
  data: PropTypes.object.isRequired,
  successCallback: PropTypes.func,
};

export default GravityFormForm;

export const GravityFormFields = graphql`
  fragment GravityFormFields on WpGravityFormsForm {
    formId
    title
    description
    descriptionPlacement
    labelPlacement
    subLabelPlacement
    button {
      ...Button
    }
    confirmations {
      ...FormConfirmation
    }
    formFields {
      nodes {
        id
        type
        ...CaptchaField
        ...CheckboxField
        ...DateField
        ...EmailField
        ...HtmlField
        ...HiddenField
        ...MultiSelectField
        ...RadioField
        ...SelectField
        ...TextAreaField
        ...TextField
        ...NumberField
        ...PhoneField
      }
    }
  }
`;
