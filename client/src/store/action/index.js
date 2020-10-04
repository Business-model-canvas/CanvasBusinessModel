import axios from "axios";
import {SERVER_PORT} from "../../config";
import * as actionTypes from "./actiontypes";
import jwt_decode from "jwt-decode";
import setAuthToken from "../../utils/setAuthToken"

export const createCanvas = dispatch => () => {
	axios
	.post(`${SERVER_PORT}/apis/canvas/create/`)
	.then(res=>{
		dispatch({
			type: actionTypes.CREATE_CANVAS,
			payload: res.data
		})
	})
	.catch(err=> console.log(err))
}
export const signupUser = dispatch => async (postData) => {
        console.log("action call", postData)
        await axios
        .post(`${SERVER_PORT}/apis/registration/`, postData)
        .then(res=>{
            res.status === 201
	        ? dispatch({type: actionTypes.SIGNUP_SUCCESS, payload:res.data})
	        : Promise.reject(`Can"t communicate with REST API server (${res.statusText})`)
        })
        .catch(err=>console.log(err))

}
export const loginUser = dispatch => async (loginData) => {

        await axios
        .post(`${SERVER_PORT}/apis/login/`, loginData)
        .then(res=>{
            if (res.status === 200) {
                let token
                if (res.data.token) {
                    token = res.data.token
                } else if (res.data.key) {
                    token = res.data.key
                }
                localStorage.setItem("jwtToken", token)
                setAuthToken(token);
                const decoded = jwt_decode(token)
                dispatch(setCurrentUser(decoded))
            } else {
                Promise.reject(`Can"t communicate with REST API server (${res.statusText})`)
            }
        })
        .catch(err=> {
            console.log(err)
        })

}
export const setCurrentUser = decoded=> {
    return {
            type: actionTypes.SET_CURRENT_USER,
            payload: decoded
        }    
}
export const logoutUser = dispatch => () => {
    localStorage.removeItem("jwtToken");
    setAuthToken(false);
    dispatch(setCurrentUser({}));
}