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
    case "ADDRESS":
      return {
        addressValues: value,
      };
    case "CHECKBOX":
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
    case "EMAIL":
      // UPDATE TO INCLUDE CONFIRMATION VALUE IF REQUIRED.
      return {
        emailValues: {
          value: fieldResponse,
        },
      };
    case "CONSENT":
    case "DATE":
    case "HIDDEN":
    case "NUMBER":
    case "PHONE":
    case "POSTCONTENT":
    case "POSTEXCERPT":
    case "POSTTITLE":
    case "RADIO":
    case "SELECT":
    case "SIGNATURE":
    case "TEXTAREA":
    case "TEXT":
    case "WEBSITE":
      return {
        value: fieldResponse,
      };
    case "MULTISELECT":
      return {
        values: fieldResponse,
      };
    case "POSTCATEGORY":
      return {
        values: fieldResponse,
      };
    case "POSTCUSTOM":
      return {
        values: fieldResponse,
      };
    case "POSTTAGS":
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
