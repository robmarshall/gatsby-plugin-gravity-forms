import React from "react";
import fetch from "cross-fetch";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";

export const wrapRootElement = ({ element }, { url }) => {
  // Add error handling if no URL passed.
  if (!url) {
    return null;
  }

  const client = new ApolloClient({
    link: new HttpLink({
      uri: url,
      fetch,
    }),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{element}</ApolloProvider>;
};
