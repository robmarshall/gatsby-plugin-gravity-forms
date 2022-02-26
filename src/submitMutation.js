import { gql } from "@apollo/client";

export default gql`
  mutation submitForm($databaseId: ID!, $fieldValues: [FormFieldValuesInput]!) {
    submitGfForm(input: { id: $databaseId, fieldValues: $fieldValues }) {
      errors {
        id
        message
      }
    }
  }
`;
