import { graphql } from "gatsby";

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
    isActive
    isDefault
    message
    name
    pageId
    queryString
    type
    url
  }
`;

export const SubmitButton = graphql`
  fragment SubmitButton on WpFormSubmitButton {
    conditionalLogic {
      ...ConditionalLogic
    }
    imageUrl
    text
    type
  }
`;
