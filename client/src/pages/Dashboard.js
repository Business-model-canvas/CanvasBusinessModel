import React from "react";
import styled from "styled-components";
import AddIcon from '@material-ui/icons/Add';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SimpleModal from "../components/Modal";
import {connect} from "react-redux";
import {AddBtn} from "../elements/Modal"
import {logoutUser} from "../store/action"


const Dashboard = ({auth, history, logoutUser}) => {
	const [open, setOpen] = React.useState(false);

	const handleClick = e => {
		setOpen(true)
	}
	const handleLogout = e => {
		e.preventDefault()
		logoutUser()
	}
	return (
		<>
			<WelcomeMsg>Welcom {auth.user.username}!</WelcomeMsg>
			<AddBtn className="btn btn-primary" onClick={handleClick}><AddIcon /> Add new</AddBtn>
			<AddBtn className="btn btn-danger" onClick={handleLogout}><ExitToAppIcon /> Log out</AddBtn>
			<SimpleModal open={open} setOpen={setOpen} history={history} />
		</>
		)
}


const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
	history: ownProps.history,
})
const mapDispatchToProps = dispatch => ({
  logoutUser: logoutUser(dispatch),
  
})
const WelcomeMsg = styled.h1`
`
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);