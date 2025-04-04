import React, { Fragment, memo } from "react";
import { Container } from "react-bootstrap";
import "./CancellationRefund.css";

const CancellationRefund = memo(() => {
  return (
    <Fragment>
      <div className="section-padding cancellation-refund">
        <Container>
          <div className="policy-header">
            <h1>Cancellation and Refund Policy</h1>
            <p className="last-updated">Last Updated: April 03, 2025</p>
            <p className="intro">
              At Leikapui Studios, we strive to provide the best streaming
              experience possible. This policy outlines our guidelines for
              cancellations and refunds.
            </p>
          </div>

          <div className="policy-section">
            <h2>1. Cancellation Policy</h2>
            <ul>
              <li>
                You can cancel your movie rental at any time before starting to
                watch the content.
              </li>
              <li>
                Once you start watching the content, cancellation is not
                possible for that specific rental.
              </li>
              <li>
                For technical issues preventing you from watching the content,
                please contact our support team immediately.
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>2. Refund Eligibility</h2>
            <p>Refunds may be issued in the following circumstances:</p>
            <ul>
              <li>
                Technical issues on our end that prevent you from accessing the
                content
              </li>
              <li>Double charging or billing errors</li>
              <li>Cancellation before starting to watch the content</li>
              <li>Service unavailability in your region after purchase</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>3. Refund Process</h2>
            <p>To request a refund:</p>
            <ol>
              <li>
                Contact our support team at support@leikapuistudios.com within 7
                days of the purchase
              </li>
              <li>Provide your order ID and reason for the refund request</li>
              <li>Include any relevant screenshots or error messages</li>
              <li>Our team will review your request within 48 hours</li>
            </ol>
          </div>

          <div className="policy-section">
            <h2>4. Refund Processing</h2>
            <ul>
              <li>
                Approved refunds will be processed within 5-7 business days
              </li>
              <li>
                Refunds will be issued to the original payment method used for
                the purchase
              </li>
              <li>
                Processing time may vary depending on your payment provider or
                bank
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>5. Non-Refundable Cases</h2>
            <p>Refunds will not be issued in the following cases:</p>
            <ul>
              <li>After you have started watching the content</li>
              <li>Network or device-related issues on your end</li>
              <li>Requests made after the 7-day window</li>
              <li>
                Content quality complaints unless there are verifiable technical
                issues
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>6. Contact Us</h2>
            <p>
              If you have any questions about our Cancellation and Refund
              Policy, please contact us at:
            </p>
            <ul>
              <li>Email: support@leikapuistudios.com</li>
              <li>Phone: +91 XXX XXX XXXX (Mon-Fri, 9:00 AM - 6:00 PM IST)</li>
            </ul>
          </div>
        </Container>
      </div>
    </Fragment>
  );
});

CancellationRefund.displayName = "CancellationRefund";
export default CancellationRefund;
