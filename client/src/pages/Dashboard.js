import React, {useState, useEffect} from "react";
import styled from "styled-components";
import AddIcon from '@material-ui/icons/Add';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SimpleModal from "../components/Modal";
import {connect} from "react-redux";
import {AddBtn} from "../elements/Modal"
import {logoutUser, readCanvas, setCurCanvas} from "../store/action"



const Dashboard = ({socket, auth, canvas, history, logoutUser, readCanvas, setCurCanvas}) => {
	const [open, setOpen] = useState(false);

	useEffect(()=>{
		// console.log('canvas = ', canvas);
		// var socket = io(`${SERVER_PORT}`);
		socket.emit('sendMessage', 'Message');
		socket.on('refresh', (data)=>{
			readCanvas();
		})
		console.log('socket emit');
	}, []);

	const handleClick = e => {
		setOpen(true)
	}
	const handleLogout = e => {
		e.preventDefault()
		logoutUser()
	}
	return (
		<>
			<WelcomeMsg>Welcome {auth.user.username}!</WelcomeMsg>
			{
				// console.log('canvas = ', canvas)
				canvas.canvas.map(item => {
					return (<p key={item.id}>
						<a onClick={()=>{
							console.log('clicked = ', item);
							setCurCanvas(item.id);
							history.push(`/canvas${item.type}/${item.name}`);
						}} >
							{item.name}
						</a>
					</p>);
				})
			}
			<AddBtn className="btn btn-primary" onClick={handleClick}><AddIcon /> Add new</AddBtn>
			<AddBtn className="btn btn-danger" onClick={handleLogout}><ExitToAppIcon /> Log out</AddBtn>
			<SimpleModal open={open} setOpen={setOpen} history={history} />
		</>
		)
}


const mapStateToProps = (state, ownProps) => ({
	auth: state.auth,
	canvas: state.canvas,
	history: ownProps.history,
	socket: state.canvas.socket
})
const mapDispatchToProps = dispatch => ({
  logoutUser: logoutUser(dispatch),
  readCanvas: readCanvas(dispatch),
  setCurCanvas: setCurCanvas(dispatch)
})
const WelcomeMsg = styled.h1`
`
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);