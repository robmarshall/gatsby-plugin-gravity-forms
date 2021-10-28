import { gql } from "@apollo/client";

export default gql`
  mutation submitForm($formId: Int!, $fieldValues: [FieldValuesInput]) {
    submitGravityFormsForm(
      input: { formId: $formId, fieldValues: $fieldValues }
    ) {
      entryId
      errors {
        id
        message
      }
    }
  }
`;
