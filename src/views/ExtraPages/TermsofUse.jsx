import React, { Fragment, memo } from "react";
import { Container } from "react-bootstrap";
import BreadCrumbWidget from "../../components/BreadcrumbWidget";
import "./TermsofUse.css";

const TermsofUse = memo(() => {
  return (
    <Fragment>
      <BreadCrumbWidget title="Terms and Conditions" />
      <div className="section-padding terms-of-use">
        <Container>
          <div className="terms-header">
            <h1>Terms and Conditions for Leikapui Studios</h1>
            <p className="last-updated">Last Updated: April 03, 2025</p>
            <p className="intro">
              Welcome to Leikapui Studios, an over-the-top (OTT) streaming
              platform operated by Leikapui Studios, located at D/Z 31 Dinthar,
              Aizawl, Mizoram, India ("we," "us," or "our"). By accessing or
              using our website https://leikapuistudios.com (the "Service"), you
              agree to be bound by these Terms and Conditions ("Terms"). If you
              do not agree with these Terms, please do not use the Service.
            </p>
          </div>

          <div className="terms-section">
            <h2>1. Use of the Service</h2>
            <ul>
              <li>
                <strong>Eligibility:</strong> You must be at least 18 years old
                or have parental consent to use the Service.
              </li>
              <li>
                <strong>Account:</strong> You may need to create an account to
                access certain features. You are responsible for maintaining the
                confidentiality of your account credentials and for all
                activities under your account.
              </li>
              <li>
                <strong>License:</strong> We grant you a limited, non-exclusive,
                non-transferable license to access and view content on the
                Service for personal, non-commercial use only.
              </li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>2. Prohibited Activities</h2>
            <p>You agree not to:</p>
            <ul>
              <li>
                Capture, record, or reproduce any content from the Service,
                including but not limited to screencapturing, screen recording,
                or any other means of copying.
              </li>
              <li>
                Distribute, share, or engage in piracy of any content available
                on the Service.
              </li>
              <li>Use the Service for any illegal or unauthorized purpose.</li>
              <li>
                Attempt to bypass any technological protection measures
                implemented by us.
              </li>
            </ul>
            <p>
              Any violation of these prohibitions may result in immediate
              termination of your account and legal action.
            </p>
          </div>

          <div className="terms-section">
            <h2>3. Content Ownership</h2>
            <p>
              All content available on the Service, including movies, videos,
              and related materials, is the property of Leikapui Studios or its
              licensors and is protected by copyright and intellectual property
              laws. Unauthorized use of the content is strictly prohibited.
            </p>
          </div>

          <div className="terms-section">
            <h2>4. Payment and Refund Policy</h2>
            <ul>
              <li>
                <strong>Payment:</strong> Access to certain content may require
                payment. All fees are non-refundable except as outlined below.
              </li>
              <li>
                <strong>Refund Policy:</strong> No refunds will be provided
                unless you are unable to watch a movie or access content due to
                a technical issue caused by the Service. To request a refund,
                contact us at support@leikapuistudios.com within 7 days of the
                issue, providing evidence of the technical problem. Refunds are
                at our sole discretion.
              </li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>5. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the
              Service at any time, without notice, for any violation of these
              Terms or for any other reason we deem appropriate.
            </p>
          </div>

          <div className="terms-section">
            <h2>6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Leikapui Studios shall not
              be liable for any indirect, incidental, or consequential damages
              arising from your use of the Service, including loss of data or
              interruption of access.
            </p>
          </div>

          <div className="terms-section">
            <h2>7. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of India. Any disputes arising under these Terms shall be
              subject to the exclusive jurisdiction of the courts in Aizawl,
              Mizoram, India.
            </p>
          </div>

          <div className="terms-section">
            <h2>8. Changes to the Terms</h2>
            <p>
              We may update these Terms from time to time. The updated version
              will be posted on this page with a revised "Last Updated" date.
              Your continued use of the Service after such changes constitutes
              acceptance of the new Terms.
            </p>
          </div>

          <div className="terms-section">
            <h2>9. Contact Us</h2>
            <p>
              For any questions or concerns regarding these Terms, please
              contact us at support@leikapuistudios.com.
            </p>
          </div>
        </Container>
      </div>
    </Fragment>
  );
});

TermsofUse.displayName = "TermsofUse";
export default TermsofUse;
