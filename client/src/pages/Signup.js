import React from "react";
import isEmail from "validator/lib/isEmail";
import isEmpty from 'is-empty'
import {connect} from "react-redux";
import Notifications, {notify} from 'react-notify-toast';
import {CardHeader, CardForm, CardBody, Label, Input, Button, InnerContainer, Select, WarningSpan} from '../elements/Form'
import {ButtonLoader} from "../components/SpinnerLoader"
import styled from "styled-components"
import {CreateBtn} from "../elements/Modal";
import {signupUser} from "../store/action"


const Signup = ({signupUser}) => {
	const [signupParam, setSignupParam] = React.useState({})
	const [signupErrors, setSignupErrors] = React.useState({})
	const [btnFlag, setBtnFlag] = React.useState(false)
	// React.useEffect(()=>{
	// 	if (auth.isAuthenticated) {
	// 		history.push("/dashboard")
	// 	}
	// },[])
	const handleChange = e => {
	    setSignupParam({
	      ...signupParam,
	      [e.target.id]: e.target.value
	 	})
	}

    const handleClick = async e => {

	    if (!signupParam.username || isEmpty(signupParam.username)) {
	      setSignupErrors({
	        username: "The field is required"
	      })
	    }else if (!signupParam.email || isEmpty(signupParam.email)) {
	      setSignupErrors({
	        email: "The field is required"
	      })
	    } else if (signupParam.email && !isEmail(signupParam.email)) {
	      setSignupErrors({
	        email: "No Validate E-mail"
	      })
	    } else if (!signupParam.password1 || isEmpty(signupParam.password1)) {
	      setSignupErrors({
	        password1: "The field is required"
	      })
	    } else if (!signupParam.password2 || isEmpty(signupParam.password2)) {
	      setSignupErrors({
	        password2: "The field is required"
	      })
	    } else if (signupParam.password1 !== signupParam.password2) {
	      setSignupErrors({
	        password2: "No match"
	      })
	    } else {
	    	console.log("signupParam", signupParam)
	    	signupUser(signupParam)
	      // setBtnFlag(true)
	      // await signupUser(signupParam, signProfileData, setAlert, setSignupErrors, errVal, lang)
	      // setBtnFlag(false)
	    }
	}

	return (
		<SignUpWrapper>
              <CardForm>
                <CardHeader className="card-header">
                  Sign Up
                </CardHeader>
                <CardBody>
                    <Label>Username {signupErrors.username && (<WarningSpan>{signupErrors.username}</WarningSpan>)}</Label>
                    <Input type='text' id="username" className="form-control" onChange={handleChange} error={signupErrors.username && true}/>

                    <Label>E-mail {signupErrors.email && (<WarningSpan>{signupErrors.email}</WarningSpan>)}</Label>
                    <Input type='email' id="email" className="form-control" onChange={handleChange} error={signupErrors.email && true} />

                    <Label>Password {signupErrors.password1 && (<WarningSpan>{signupErrors.password1}</WarningSpan>)}</Label>
                    <Input type='password' id="password1" className="form-control" onChange={handleChange} error={signupErrors.password1 && true} />

                    <Label>Confirm Password {signupErrors.password2 && (<WarningSpan>{signupErrors.password2}</WarningSpan>)}</Label>
                    <Input type='password' id="password2" className="form-control" onChange={handleChange} error={signupErrors.password2 && true} />
                    <p><a href="/login">Click here</a> to Log In</p>
                  <center><CreateBtn type="submit" className="btn btn-success" onClick={handleClick}>{
                    btnFlag
                    ? <ButtonLoader />
                    : "Sign Up"
                  }</CreateBtn></center>

                </CardBody>
              </CardForm>
        </SignUpWrapper>
		)
  }

const SignUpWrapper = styled.div`
	max-width: 400px;
	margin: 3rem auto;
`

const mapDispatchToProps = dispatch => ({
  signupUser: signupUser(dispatch),
})
export default connect(null, mapDispatchToProps)(Signup);
