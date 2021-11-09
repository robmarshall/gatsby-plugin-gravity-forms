/**
 * This function takes the React Hook Form data (clientData) and matches it
 * against the WP Gravity Forms graphQL data (serverData).
 *
 * Once matched, it formats the data to be able to be returned back to the WP
 * backend in the correct format.
 *
 * Variable names could be better...
 *
 * Useful info on Gravity Forms graphQL:
 * https://github.com/harness-software/wp-graphql-gravity-forms/blob/develop/docs/submitting-forms.md
 */

const formatter = ({ id, fieldResponse, type, inputs }) => {
  switch (type) {
    case "address":
      return {
        addressValues: value,
      };
    case "checkbox":
      // Loop through all Gravity Form Checkbox choices.
      const selectedChoices = inputs
        .map(({ id, label, name }) => {
          const inputName = name || label;
          // If the Gravity Forms choice matches with selected item from user.
          // Add to response.
          if (fieldResponse.find((option) => option === inputName)) {
            return {
              inputId: id,
              value: inputName,
            };
          }
        })
        .filter(Boolean);

      return {
        checkboxValues: selectedChoices,
      };
    case "email":
      return {
        emailValues: {
          value: fieldResponse,
        },
      };
    case "consent":
    case "date":
    case "hidden":
    case "number":
    case "phone":
    case "postContent":
    case "postExcerpt":
    case "postTitle":
    case "radio":
    case "select":
    case "signature":
    case "textarea":
    case "text":
    case "website":
      return {
        value: fieldResponse,
      };
    case "multiSelect":
      return {
        values: fieldResponse,
      };
    case "postCategory":
      return {
        values: fieldResponse,
      };
    case "postCustom":
      return {
        values: fieldResponse,
      };
    case "postTags":
      return {
        values: fieldResponse,
      };
    default:
      return {};
  }
};

export default ({ serverData, clientData }) => {
  const formattedData = serverData
    .map(({ type, inputs, id }) => {
      // Does this particular field have a response?
      const fieldResponse = clientData[`input_${id}`];

      // If so, lets re-format and add to array.
      if (fieldResponse) {
        return {
          id,
          ...formatter({ id, fieldResponse, type, inputs }),
        };
      }
    })
    .filter(Boolean);

  return formattedData;
};
