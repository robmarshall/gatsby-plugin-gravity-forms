import classnames from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useState, useRef } from "react";
import { graphql, navigate } from "gatsby";
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
import formatPayload from "./utils/formatPayload";
import { valueToLowerCase } from "./utils/helpers";

/**
 * Component to take Gravity Form graphQL data and turn into
 * a fully functional form.
 * @param {mixed} data Form dataset from graphQL
 */
const GravityFormForm = ({
  data,
  presetValues,
  successCallback,
  errorCallback,
}) => {
  const preOnSubmit = useRef();

  // Split out data depending on how it is passed in.
  const form = data?.wpGfForm || data;

  // Deconstruct global settings (if provided).
  const settings = data?.wp?.gfSettings || {};

  const {
    submitButton,
    confirmations,
    databaseId,
    description,
    descriptionPlacement,
    formFields,
    labelPlacement,
    subLabelPlacement,
    title,
  } = form;

  const [submitForm, { data: submittionData, loading }] =
    useMutation(submitMutation);

  const hasBeenSubmitted = Boolean(submittionData?.submitGfForm);
  const haveFieldErrors = Boolean(submittionData?.submitGfForm?.errors?.length);

  const wasSuccessfullySubmitted = hasBeenSubmitted && !haveFieldErrors;

  // Pull in form functions
  const methods = useForm();
  const {
    handleSubmit,
    setError,
    reset,
    getValues,
    formState: { errors },
  } = methods;

  const [generalError, setGeneralError] = useState("");

  const onSubmitCallback = async () => {
    // Make sure we are not already waiting for a response
    if (!loading) {
      // Clean error

      await preOnSubmit?.current?.recaptcha();

      const values = getValues();

      // Check that at least one field has been filled in
      if (submissionHasOneFieldEntry(values)) {
        setGeneralError("");

        const formRes = formatPayload({
          serverData: formFields?.nodes,
          clientData: values,
        });

        submitForm({
          variables: {
            databaseId,
            fieldValues: formRes,
          },
        })
          .then(({ data: { submitGfForm: errors } }) => {
            // Success if no errors returned.
            if (!Boolean(errors?.length)) {
              successCallback({
                data: formRes,
                reset,
              });
            } else {
              handleGravityFormsValidationErrors(errors, setError);
              errorCallback({
                data: formRes,
                error: errors,
                reset,
              });
            }
          })
          .catch((error) => {
            // There is an Issue with Safari when parsing the Response
            if (
              error.message ===
              'JSON Parse error: Unexpected identifier "object"'
            ) {
              successCallback({
                data: formRes,
                reset,
              });
            } else {
              setGeneralError("unknownError");
              errorCallback({ data: formRes, error, reset });
            }
          });
      } else {
        setGeneralError("leastOneField");
      }
    }
  };

  if (wasSuccessfullySubmitted) {
    const confirmation = confirmations?.find((el) => {
      // First check if there is a custom confirmation
      // that is not the default.
      if (el.isActive && !el.isDefault) {
        return true;
      }

      // If not, revert back to the default one.
      if (el.isDefault) {
        return true;
      }
    });

    if (confirmation.type !== "PAGE") {
      // TODO: Somehow need to get the page URL. Query currently
      // returns the page ID for the page redirect.
      navigate(confirmation?.url);
    }

    if (confirmation.type !== "REDIRECT") {
      // TODO: Check that the redirect is internal.
      // If not, use window.location to direct to external URL.
      navigate(confirmation?.url);
    }

    if (confirmation.type == "MESSAGE") {
      return (
        <div className="gform_confirmation_wrapper">
          <div
            className="gform_confirmation_message"
            /* eslint-disable react/no-danger */
            dangerouslySetInnerHTML={{ __html: confirmation?.message }}
          />
        </div>
      );
    }
  }

  return (
    <div className="gform_wrapper" id={`gform_wrapper_${databaseId}`}>
      <div className="gform_anchor" id={`gf_${databaseId}`} />

      {formFields && (
        <FormProvider {...methods}>
          <form
            className={
              loading
                ? `gravityform gravityform--loading gravityform--id-${databaseId}`
                : `gravityform gravityform--id-${databaseId}`
            }
            id={`gform_${databaseId}`}
            key={`gform_-${databaseId}`}
            onSubmit={handleSubmit(onSubmitCallback)}>
            {generalError && <FormGeneralError errorCode={generalError} />}
            <div className="gform_body">
              <ul
                className={classnames(
                  "gform_fields",
                  {
                    [`form_sublabel_${valueToLowerCase(subLabelPlacement)}`]:
                      valueToLowerCase(subLabelPlacement),
                  },
                  `description_${valueToLowerCase(descriptionPlacement)}`,
                  `${valueToLowerCase(labelPlacement)}`
                )}
                id={`gform_fields_${databaseId}`}>
                <FieldBuilder
                  databaseId={databaseId}
                  formLoading={loading}
                  formFields={formFields.nodes}
                  labelPlacement={labelPlacement}
                  preOnSubmit={preOnSubmit}
                  presetValues={presetValues}
                  settings={settings}
                />
              </ul>
            </div>

            <div className={`gform_footer ${valueToLowerCase(labelPlacement)}`}>
              <button
                className="gravityform__button gform_button button"
                disabled={loading}
                id={`gform_submit_button_${databaseId}`}
                type="submit">
                {loading ? (
                  <span className="gravityform__button__loading_span">
                    Loading
                  </span>
                ) : (
                  submitButton?.text
                )}
              </button>
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
};

GravityFormForm.propTypes = {
  errorCallback: PropTypes.func,
  data: PropTypes.object.isRequired,
  successCallback: PropTypes.func,
  presetValues: PropTypes.shape({}),
};

GravityFormForm.defaultProps = {
  errorCallback: () => {},
  successCallback: () => {},
  presetValues: {},
};

export default GravityFormForm;

export const GravityFormFields = graphql`
  fragment GravityFormFields on WpGfForm {
    databaseId
    description
    descriptionPlacement
    labelPlacement
    subLabelPlacement
    title
    submitButton {
      ...SubmitButton
    }
    confirmations {
      ...FormConfirmation
    }
    formFields {
      nodes {
        displayOnly
        id
        inputType
        layoutGridColumnSpan
        layoutSpacerGridColumnSpan
        pageNumber
        type
        visibility
        ...CaptchaField
        ...CheckboxField
        ...DateField
        ...EmailField
        ...HiddenField
        ...HtmlField
        ...MultiSelectField
        ...NumberField
        ...PhoneField
        ...RadioField
        ...SelectField
        ...TextAreaField
        ...TextField
      }
    }
  }
`;

export const GravityFormSettings = graphql`
  fragment GravityFormSettings on Wp {
    gfSettings {
      recaptcha {
        publicKey
        type
      }
    }
  }
`;
