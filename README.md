# Gatsby GraphQl Gravity Forms Component

A plug and play component for parsing GraphQL Gravity Form data. Outputs a component using BEM classes, meaning all you need to do is style it.

To be used alongside [gatsby-source-wordpress](https://www.npmjs.com/package/gatsby-source-wordpress) and [wp-graphql-gravity-forms](https://github.com/harness-software/wp-graphql-gravity-forms).

Uses [React Hook Forms](https://react-hook-form.com/) under the hood for all that good state management.

[Apollo](https://github.com/apollographql/apollo-client) is baked in for handling the data submission.

## Installation

```js
# Install the component
yarn add gatsby-plugin-gravity-forms

# Or with NPM
npm i gatsby-plugin-gravity-forms
```

## How To Use

1. Add the component to your gatsby-config.js file.

```
{
  resolve: "gatsby-plugin-gravity-forms",
  options: {
    // This URL should be the same as you use for your
    // gatsby-source-wordpress options.
    url: "https://yourwebdomain.com/graphql",
  },
},
```

2. Import the component and use it with a GraphQL query. Make sure to set the formID.

```js
import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import Layout from "../components/layout";
import GravityFormForm from "gatsby-plugin-gravity-forms";

const ExamplePage = () => {
  const data = useStaticQuery(graphql`
    query formQuery {
      wpGravityFormsForm(formId: { eq: 1 }) {
        ...GravityFormFields
      }
    }
  `);

  return (
    <Layout>
      <GravityFormForm data={data} />
    </Layout>
  );
};

export default ExamplePage;
```

The `...GravityFormFields` fragment is included within the gatsby-plugin-gravity-forms plugin.

This outputs the form that has been set up in WordPress - Gravity Forms. Ready for you to style it!

Tutorial on setup: https://thoughtsandstuff.com/headless-wordpress-gravity-forms-with-gatsby-step-by-step-tutorial/

## WordPress Backend Not Allowing Submission

Having CORS issues?

Add the following snippet of code to your WordPress functions.php file.

Make sure to update the 'https://yourfrontendurl.com' to your actual frontend. With no trailing slash.

```
add_filter( 'graphql_response_headers_to_send', function( $headers ) {
	return array_merge( $headers, [
		'Access-Control-Allow-Origin'  => 'https://yourfrontendurl.com',
		'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS, PUT, DELETE',
		'Access-Control-Allow-Credentials' => 'true'
	] );
} );
```

## Implementing Google reCAPTCHA

On your Gatsby project set up an Environment Variable named `GATSBY_RECAPTCHA_SITE_KEY` with your reCAPTCHA site key as value. This variable will be automatically used whenever Gravity Form that has a reCAPTCHA field.

Upon responding to the captcha Google sends back a **reCAPTCHA response token** that gets stored in a hidden `<input>` on your form. When your form data is sent back to your Wordpress website(through a Lambda function), Gravity Forms will automatically [verify the reCAPTCHA token](https://developers.google.com/recaptcha/docs/verify) token to ensure it was sent by a human.

## Testing & Developing

Firstly, yes please! Any help would be great.

### Developing Locally

To develop the component, you first need to link it to a Gatsby project. This is so you have an environment to work with. The [Gatsby Default Starter](https://github.com/gatsbyjs/gatsby-starter-default) is a good choice.

## To Do

### Field Components

- [x] Input
- [x] Textarea
- [ ] Select (half done, need to add default values)
- [ ] Multiselect
- [x] Number
- [ ] Checkbox (half done, need to add default values)
- [ ] Radio (half done, need to add default values and correct error placement)
- [x] Hidden
- [x] HTML
- [x] Captcha
- [x] Add masking to inputs
- [ ] Section
- [ ] Page
- [ ] Date
- [ ] File upload
- [ ] Post Fields
- [ ] Pricing Fields

### General Form

- [ ] Honeypot
- [ ] Save and Continue
- [x] Add submit/error callback for custom use

### Add Tests to Inputs

- [ ] Input
- [ ] Textarea
- [ ] Select (half done, need to add default values)
- [ ] Multiselect
- [ ] Number
- [ ] Checkbox (half done, need to add default values)
- [ ] Radio (half done, need to add default values)
- [ ] Hidden
- [ ] HTML
- [ ] Captcha

## Confirmations

- [x] Text Confirmation
- [ ] Page Change
- [ ] Redirect
