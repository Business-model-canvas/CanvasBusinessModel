import * as actionTypes from "../action/actiontypes";
const isEmpty = require("is-empty");

const initState = {
	user: [],
	isAuthenticated: false,
	message: ''
}

export default function authReducer(state=initState, action) {
	switch (action.type) {
		case actionTypes.SIGNUP_SUCCESS:
			return state
		case actionTypes.SET_CURRENT_USER:

			return {
				...state,
				isAuthenticated: !isEmpty(action.payload),
				user: action.payload
			}
		default:
			return state;
	}
}