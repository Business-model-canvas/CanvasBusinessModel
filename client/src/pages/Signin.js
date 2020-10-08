import React from "react";
import isEmpty from "is-empty";
import isEmail from "validator/lib/isEmail";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  CardHeader,
  CardForm,
  CardBody,
  Label,
  Input,
  Button,
  InnerContainer,
  WarningSpan,
} from "../elements/Form";
import { CreateBtn } from "../elements/Modal";
import { ButtonLoader } from "../components/SpinnerLoader";
import { loginUser } from "../store/action";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { setCurrentUser } from "../store/action";
import store from "../store";

const Signin = ({ auth, loginUser, history }) => {
  const [btnFlag, setBtnFlag] = React.useState(false);
  const [loginErrors, setLoginErrors] = React.useState({});
  const [loginParam, setLoginParam] = React.useState({});

  React.useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setAuthToken(token);
      const decoded = jwt_decode(token);
      store.dispatch(setCurrentUser(decoded));
      // props.history.push(`dashboard`);
    }
  }, []);
  React.useEffect(() => {
    if (auth.isAuthenticated) {
      history.push("dashboard");
    }
  }, [auth.isAuthenticated]);

  const handleChange = (e) => {
    setLoginParam({
      ...loginParam,
      [e.target.id]: e.target.value,
    });
  };

  const handleClick = async (e) => {
    if (!loginParam.username || isEmpty(loginParam.username)) {
      setLoginErrors({
        email: "The field is required",
      });
    } else if (!loginParam.password || isEmpty(loginParam.password)) {
      setLoginErrors({
        password: "The field is required",
      });
    } else if (loginParam.username && !isEmail(loginParam.username)) {
      setLoginErrors({
        email: "No Validate E-mail",
      });
    } else {
      console.log("loginParam", loginParam);
      loginUser(loginParam);
      // setBtnFlag(true)
      // await loginUser(loginParam, setAlert, setLoginErrors, lang, errVal, history, visit_url)
      // setBtnFlag(false)
    }
  };
  return (
    <SignInWrapper>
      <CardForm>
        <CardHeader className="card-header">Login</CardHeader>
        <CardBody>
          <Label>
            E-mail{" "}
            {loginErrors.email && (
              <WarningSpan>{loginErrors.email}</WarningSpan>
            )}
          </Label>
          <Input
            type="text"
            id="username"
            className="form-control"
            onChange={handleChange}
          />
          <Label>
            Password{" "}
            {loginErrors.password && (
              <WarningSpan>{loginErrors.password}</WarningSpan>
            )}
          </Label>
          <Input
            type="password"
            id="password"
            className="form-control"
            onChange={handleChange}
          />
          <p>
            <a href="/signup">Click here</a> to Sign Up
          </p>
          <center>
            <CreateBtn
              type="button"
              className="btn btn-success"
              onClick={handleClick}
            >
              {btnFlag ? <ButtonLoader /> : "Login"}
            </CreateBtn>
          </center>
          <a
            type="button"
            href="/auth/google/sign"
            className="btn btn-outline-dark btn-block"
          >
            Continue With Google
          </a>
        </CardBody>
      </CardForm>
    </SignInWrapper>
  );
};
const SignInWrapper = styled.div`
  max-width: 400px;
  margin: 3rem auto;
`;
const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
  history: ownProps.history,
});
const mapDispatchToProps = (dispatch) => ({
  loginUser: loginUser(dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Signin);
