import React from 'react';
import Modal from '@material-ui/core/Modal';
import styled from "styled-components";
import isEmpty from 'is-empty';
import {createCanvas} from "../store/action";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {ModelContent, FromGroup, Label, Input, ErrSpan, Select, BtnSection, CancelBtn, CreateBtn, Option} from "../elements/Modal";

const SimpleModal = ({socket, open, setOpen, history, createCanvas}) => {
	const [formVal, setFormVal] = React.useState({
		name: "",
		type: ""
	});
	const [formErr, setFormErr] = React.useState({
		name: "",
		type: ""
	})

	const handleClose = () => {
		setOpen(false);
	}
	const handleChange = e => {
		setFormVal({
			...formVal,
			[e.target.id]: e.target.value
		})
	}
	const handleCreate = e => {
		console.log()
		if (!formVal.name || isEmpty(formVal.name)) {
	      setFormErr({
	        name: "Please input name."
	      })
	    } else if (!formVal.type || isEmpty(formVal.type)) {
	    	setFormErr({
	    		type:"Please select type."
	    	})
	    } else {
	    	console.log(formVal);
	    	console.log("---", history, typeof history)
			history.push(`/canvas${formVal.type}/${formVal.name}`)
			socket.emit('sendMessage', 'Message');
	    	createCanvas(formVal);
	    }
	}
	return (
		<>
		<Modal
	        open={open}	
	        onClose={handleClose}
	        aria-labelledby="simple-modal-title"
	        aria-describedby="simple-modal-description"
	      >
	    	<ModelContent>
	    	<FromGroup className="form-group">
	    		<Label>Name</Label>
	    		<Input className="form-control" id="name" onChange={handleChange}/>
	    		<ErrSpan>{formErr.name}</ErrSpan>
	    	</FromGroup>
	    	<FromGroup className="form-group">
	    		<Label>Type</Label>
	    		<Select className="form-control" id="type" onChange={handleChange}>
	    			<Option></Option>
	    			<Option value="type1">Business Model</Option>
	    		</Select>
	    		<ErrSpan>{formErr.type}</ErrSpan>
	    	</FromGroup>
	    	<BtnSection>
		    	<CancelBtn className="btn btn-default" onClick={handleClose}>Cancel</CancelBtn>
		    	<CreateBtn className="btn btn-primary" onClick={handleCreate}>Create</CreateBtn>
	    	</BtnSection>
	    	</ModelContent>
	    </Modal>
		</>
		)
}


SimpleModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  createCanvas: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
	open: ownProps.open,
	setOpen: ownProps.setOpen,
	history: ownProps.history,
	socket: state.canvas.socket
})
const mapDispatchToProps = dispatch=>({
	createCanvas: createCanvas(dispatch)
})
export default connect(mapStateToProps, mapDispatchToProps)(SimpleModal);