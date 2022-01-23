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
  // Split out data depending on how it is passed in.
  let form;
  if (data?.wpGravityFormsForm) {
    form = data.wpGravityFormsForm;
  } else {
    form = data;
  }

  const {
    button,
    confirmations,
    description,
    descriptionPlacement,
    labelPlacement,
    subLabelPlacement,
    formFields,
    databaseId,
    title,
  } = form;

  const [submitForm, { data: submittionData, loading }] = useMutation(
    submitMutation
  );

  // Handle Gravity Form Submittion state.
  // Thanks to: https://developers.wpengine.com/blog/gravity-forms-in-headless-wordpress-gatsby
  const haveEntryId = Boolean(submittionData?.submitGravityFormsForm?.entryId);
  const haveFieldErrors = Boolean(
    submittionData?.submitGravityFormsForm?.errors?.length
  );
  const wasSuccessfullySubmitted = haveEntryId && !haveFieldErrors;

  // Pull in form functions
  const methods = useForm();
  const {
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = methods;

  const [generalError, setGeneralError] = useState("");

  const onSubmitCallback = async (values) => {
    // Make sure we are not already waiting for a response
    if (!loading) {
      // Clean error

      // Check that at least one field has been filled in
      if (submissionHasOneFieldEntry(values)) {
        setGeneralError("");

        const formRes = formatPayload({
          serverData: formFields?.nodes,
          clientData: values,
        });

        submitForm({
          variables: {
            databaseId: databaseId,
            fieldValues: formRes,
          },
        })
          .then(
            ({
              data: {
                submitGravityFormsForm: { entryId, errors },
              },
            }) => {
              // Success
              if (entryId) {
                successCallback({
                  data: formRes,
                  reset,
                });
              }
              // We have a problem
              if (errors?.length) {
                handleGravityFormsValidationErrors(errors, setError);
                errorCallback({ data: formRes, error: errors, reset });
              }
            }
          )
          .catch((error) => {
            setGeneralError("unknownError");
            errorCallback({ data: formRes, error, reset });
          });
      } else {
        setGeneralError("leastOneField");
      }
    }
  };

  if (wasSuccessfullySubmitted) {
    const confirmation = confirmations?.find((el) => el.isDefault);

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

  return (
    <div className="gform_wrapper" id={`gform_wrapper_${databaseId}`}>
      <div className="gform_anchor" id={`gf_${databaseId}`} />

      <FormProvider {...methods}>
        <form
          className={
            loading
              ? `gravityform gravityform--loading gravityform--id-${databaseId}`
              : `gravityform gravityform--id-${databaseId}`
          }
          id={`gfrom_${databaseId}`}
          key={`gfrom_-${databaseId}`}
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
              id={`gform_fields_${databaseId}`}
            >
              <FieldBuilder
                formLoading={loading}
                formFields={formFields.nodes}
                presetValues={presetValues}
                labelPlacement={labelPlacement}
              />
            </ul>
          </div>

          <div className={`gform_footer ${valueToLowerCase(labelPlacement)}`}>
            <button
              className="gravityform__button gform_button button"
              disabled={loading}
              id={`gform_submit_button_${databaseId}`}
              type="submit"
            >
              {loading ? (
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
    button {
      ...Button
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
