import axios from "axios";
import {SERVER_PORT} from "../../config";
import * as actionTypes from "./actiontypes";
import jwt_decode from "jwt-decode";
import setAuthToken from "../../utils/setAuthToken"

import store from '../index';

export const createCanvas = dispatch => (data) => {
	axios
	.post(`${SERVER_PORT}/apis/canvas/create/`, data)
	.then(res=>{
		dispatch({
			type: actionTypes.CREATE_CANVAS,
			payload: res.data
        })
        dispatch({
            type: actionTypes.SET_PLACEHOLDERS,
            payload: []
        })
	})
	.catch(err=> console.log(err))
}

export const readCanvas = dispatch => () => {
    axios
	.post(`${SERVER_PORT}/apis/canvas/read_all/`)
	.then(res=>{
        console.log('canvas = ', res.data);
		dispatch({
			type: actionTypes.READ_CANVAS,
			payload: res.data
        });
        dispatch({
            type: actionTypes.CUR_CANVAS_ID,
            payload: res.data[0].id
        })
	})
	.catch(err=> console.log(err))
}

export const readCurCanvasData = dispatch => (data) => {
    console.log('data = ', data);
    axios
    .post(`${SERVER_PORT}/apis/canvas/read_data`, data)
	.then(res=>{
        console.log('canvas data = ', res.data);
        res.data.forEach(item => {
            item.isEditing = false;
        })
        dispatch({
            type: actionTypes.CUR_CANVAS_ID,
            payload: data.id
        })
		dispatch({
			type: actionTypes.READ_PLACEHOLDER,
			payload: res.data
        });
	})
	.catch(err=> console.log(err))
}

export const setPlaceholders = dispatch => (data) => {
    const state = store.getState();
    axios
    .post(`${SERVER_PORT}/apis/canvas/update_data`, data)
    .then(res=>{
        dispatch({
            type: actionTypes.SET_PLACEHOLDERS,
            payload: res.data
        })
        state.canvas.socket.emit("reload_placeholders");
    })
    .catch(err=>console.log(err))
    
}

export const deletePlaceholder = dispatch => (data) => {
    axios
    .post(`${SERVER_PORT}/apis/canvas/delete_data`, data)
    .then(res=>{
        dispatch({
            type: actionTypes.SET_PLACEHOLDERS,
            payload: res.data
        })
    })
    .catch(err=>console.log(err))
}

export const setCurCanvas = dispatch => (data) => {
    console.log('set cur canvas id = ', data);
    dispatch({
        type: actionTypes.CUR_CANVAS_ID,
        payload: data
    })
}

export const createPlaceholder = dispatch => (data) => {
    console.log('*** canvas data = ', data);
    axios
	.post(`${SERVER_PORT}/apis/canvas/create_placeholder/`, data)
	.then(res=>{
		dispatch({
			type: actionTypes.CREATE_PLACEHOLDER,
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