import { graphql } from "gatsby";

export const Button = graphql`
  fragment Button on WpFormSubmitButton {
    conditionalLogic {
      ...ConditionalLogic
    }
    imageUrl
    text
    type
  }
`;

export const ConditionalLogic = graphql`
  fragment ConditionalLogic on WpConditionalLogic {
    actionType
    logicType
    rules {
      fieldId
      operator
      value
    }
  }
`;

export const FormConfirmation = graphql`
  fragment FormConfirmation on WpFormConfirmation {
    conditionalLogic {
      ...ConditionalLogic
    }
    id
    isDefault
    message
    name
    pageId
    queryString
    type
    url
  }
`;
