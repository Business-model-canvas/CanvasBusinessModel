import * as actionTypes from "../action/actiontypes";

const initState = {
	canvas: []
}

export default function CanvasReducer(state=initState, action) {
	switch (action.type) {
		case actionTypes.CREATE_CANVAS:
			return state		
		default:
			return state;
	}
}