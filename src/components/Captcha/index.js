import PropTypes from "prop-types";
import { graphql } from "gatsby";
import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
} from "react";
import { useFormContext } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";

import InputWrapper from "../InputWrapper";

const Captcha = forwardRef(
  ({ captchaTheme, fieldData, name, settings, ...wrapProps }, ref) => {
    const { register, errors, setValue } = useFormContext();

    if (!settings?.publicKey) {
      return (
        <div className="gravityform__captcha_notification">
          <p>
            <strong>
              To use reCAPTCHA, you need to sign up for an API key pair for your
              site and use it as a node environment variable named
              GATSBY_RECAPTCHA_SITE_KEY. The key pair consists of a site key and
              secret. The site key is used to display the widget on your site.
              Sign up for an API key pair at
              <a
                href="http://www.google.com/recaptcha"
                rel="noopener noreferrer"
                target="_blank"
                title="This link opens a new page"
              >
                https://www.google.com/recaptcha
              </a>
            </strong>
          </p>
        </div>
      );
    }

    const captchaRef = useRef(null);
    const [isLoaded, setLoaded] = useState(false);

    useImperativeHandle(ref, () => ({
      recaptcha: async () => {
        if (settings?.type === "INVISIBLE") {
          const token = await captchaRef.current.executeAsync();
          setValue(name, token, true);
        } else {
          const token = captchaRef.current.getValue();
          setValue(name, token, true);
        }
      },
    }));

    const changeCaptchaToken = (token = "") => {
      setValue(name, token, true);
    };

    useEffect(() => {
      if (isLoaded && errors && errors.message) {
        captchaRef.current.reset();
      }
    }, [errors, isLoaded]);

    return (
      <InputWrapper
        errors={errors?.[`g-recaptcha-response`]}
        inputData={fieldData}
        labelFor={name}
        {...wrapProps}
      >
        <ReCAPTCHA
          onExpired={changeCaptchaToken}
          onLoad={() => setLoaded(true)}
          onChange={changeCaptchaToken}
          ref={captchaRef}
          sitekey={settings?.publicKey}
          theme={captchaTheme || "light"}
          size={settings?.type === "INVISIBLE" ? "invisible" : "compact"}
        />
        <input
          name="g-recaptcha-response"
          {...register(name, {})}
          type="hidden"
        />
      </InputWrapper>
    );
  }
);

Captcha.propTypes = {
  captchaTheme: PropTypes.string,
  fieldData: PropTypes.object,
  name: PropTypes.string,
  wrapClassName: PropTypes.string,
};

export default Captcha;

export const CaptchaField = graphql`
  fragment CaptchaField on WpCaptchaField {
    captchaLanguage
    captchaTheme
    captchaType
    conditionalLogic {
      ...ConditionalLogic
    }
    cssClass
    description
    descriptionPlacement
    errorMessage
    label
    simpleCaptchaBackgroundColor
    simpleCaptchaFontColor
    simpleCaptchaSize
  }
`;
