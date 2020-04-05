/**
 * @prettier
 */

import * as React from "react";
import "./ExpiredEmailConfirmationPage.scss";
import { Link } from "react-router-dom";
import { REQUEST_RESET_PASSWORD } from "../../routing/uiroutes";
import useTabTitle from "../../routing/useTabTitle";

interface ExpiredEmailConfirmationPageProps {}

const ExpiredEmailConfirmationPage: React.FC<ExpiredEmailConfirmationPageProps> = (
  props: ExpiredEmailConfirmationPageProps
) => {
  useTabTitle("Expired Email Confirmation");

  return (
    <div className="expiredEmailConfirmationPage">
      <span>This email confirmation is no longer valid.</span>
      <Link to={REQUEST_RESET_PASSWORD}> Click here</Link>
      <span> to reset your password.</span>
    </div>
  );
};

export default ExpiredEmailConfirmationPage;
