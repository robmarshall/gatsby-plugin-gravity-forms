import React from "react";

/**
 * This file manages all of the Gravity Forms input settings.
 * Things such as: Input Mask, Required, Visibility
 */

export function outputDescription(
  description,
  placement,
  currentPosition,
  errors
) {
  if (description && currentPosition === placement) {
    return (
      <div
        className={`gravityforms__description gravityforms__description--${placement} gfield_description${
          errors ? " validation_error" : ""
        }`}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    );
  }
  return null;
}

export function islabelHidden(label) {
  return label === "hidden_label" ? true : false;
}
