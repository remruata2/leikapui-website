import { Fragment, memo } from "react";
import { Container } from "react-bootstrap";
import BreadcrumbWidget from "../../components/BreadcrumbWidget";
import "./PrivacyPolicy.css";

const PrivacyPolicy = memo(() => {
  return (
    <Fragment>
      <div className="section-padding privacy-policy">
        <Container>
          <div className="policy-header">
            <h1>Privacy Policy for Leikapui Studios</h1>
            <p className="last-updated">Last Updated: April 03, 2025</p>
            <p className="intro">
              Leikapui Studios ("we," "us," or "our"), located at D/Z 31
              Dinthar, Aizawl, Mizoram, India, operates the OTT streaming
              platform https://leikapuistudios.com (the "Service"). We are
              committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, and safeguard your personal information when
              you use the Service.
            </p>
          </div>

          <div className="policy-section">
            <h2>1. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul>
              <li>
                <strong>Personal Information:</strong> Name, email address,
                payment details, and other information you provide when creating
                an account or making a purchase.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact
                with the Service, such as IP address, browser type, device
                information, and viewing history.
              </li>
              <li>
                <strong>Cookies:</strong> We use cookies and similar
                technologies to enhance your experience and track usage
                patterns.
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide, maintain, and improve the Service.</li>
              <li>Process payments and fulfill your requests.</li>
              <li>
                Communicate with you, including sending service-related updates
                or promotional offers (if you opt in).
              </li>
              <li>
                Prevent fraud, piracy, and unauthorized use of the Service.
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>3. Sharing Your Information</h2>
            <p>
              We do not sell or rent your personal information to third parties.
              We may share your information:
            </p>
            <ul>
              <li>
                With service providers who assist us in operating the Service
                (e.g., payment processors), under strict confidentiality
                agreements.
              </li>
              <li>
                If required by law or to protect our rights, property, or
                safety.
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>4. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your
              information from unauthorized access, loss, or misuse. However, no
              online service can guarantee absolute security.
            </p>
          </div>

          <div className="policy-section">
            <h2>5. Your Rights</h2>
            <p>You may:</p>
            <ul>
              <li>
                Request access to or correction of your personal information by
                contacting us at support@leikapuistudios.com.
              </li>
              <li>
                Opt out of promotional communications by following the
                unsubscribe instructions in those messages.
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>6. Retention</h2>
            <p>
              We retain your personal information only for as long as necessary
              to fulfill the purposes outlined in this Privacy Policy or as
              required by law.
            </p>
          </div>

          <div className="policy-section">
            <h2>7. Third-Party Links</h2>
            <p>
              The Service may contain links to third-party websites. We are not
              responsible for the privacy practices or content of those sites.
            </p>
          </div>

          <div className="policy-section">
            <h2>8. Children's Privacy</h2>
            <p>
              The Service is not intended for users under 13 years of age. We do
              not knowingly collect personal information from children under 13.
            </p>
          </div>

          <div className="policy-section">
            <h2>9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The updated
              version will be posted on this page with a revised "Last Updated"
              date. Your continued use of the Service after such changes
              constitutes acceptance of the new Privacy Policy.
            </p>
          </div>

          <div className="policy-section">
            <h2>10. Contact Us</h2>
            <p>
              For any questions or concerns regarding this Privacy Policy,
              please contact us at support@leikapuistudios.com.
            </p>
          </div>
        </Container>
      </div>
    </Fragment>
  );
});

PrivacyPolicy.displayName = "PrivacyPolicy";
export default PrivacyPolicy;
