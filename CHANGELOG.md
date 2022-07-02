# Changelog

## v3.1.0 - Added Invisible Gravity Forms reCaptcha

- New fragment added, as well as support for the Invisible Google reCaptcha.

## v3.0.2 - Fixed errors, and added initial confirmation handling

- The Gravity Form error object had slightly changed. This has been corrected.
- Confirmations were being forced to default. Now new confirmations can be
  added in WordPress and picked over default if active.

## v3.0.1 - Small Fixes

- Implements a Select Fix (Thanks [@embergardens](https://github.com/embergardens))
- Adds basic confirmation redirect support.
- Small typo fixes.

## v3.0.0 - Updates button query

Updates button query to latest GraphQL GF format.

## v2.0.3 - Bugfix

Removed the checking of an entry ID on submission. This is because some users delete the entry immediately for GDPR purposes. Meaning there is no entry to check for. This has been replaced with a simple check of an error object.

## v2.0.2 - Hotfix

This _hotfix_ updates how errors/messaging is handled for empty fields containing checkboxes.

## v2.0.1 - Hotfix

This _hotfix_ adds the missed wpGraphQl fields from the v0.10.0 update. Now submits as it should! No more strange errors.

## v2.0.0 - Support WP GraphQL Gravity Forms v0.10.0 Updates

**:warning: This release contains breaking changes.**

This major release updates the GraphQL queries to match those in the recently updated v0.10.0 [wp-graphql-gravity-forms](https://github.com/harness-software/wp-graphql-gravity-forms).

What's New

- GraphQl query now uses `wpGfForm` rather than `wpGravityFormsForm`.
- The form is now selected by its databaseId rather than formId.
- Gravity Forms entries and draft entries now inherit the gfEntry interface, and use the GfSubmittedEntry and GfDraftEntry object types.
- A large number of scheme changes. See [here](https://github.com/harness-software/wp-graphql-gravity-forms/releases/tag/v0.10.0) for more details.
