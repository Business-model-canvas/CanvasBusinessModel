import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import Notifications, {notify} from 'react-notify-toast'; 
import axios from "axios";
import {SERVER_PORT} from "../config"
import styled from "styled-components";
import {connect} from "react-redux"
import {useParams} from "react-router-dom"

const EmailConfirm = () => {
  const [confirming, setConfirming] = React.useState(true)
  const {id} = useParams();
  console.log("id", id)
  React.useEffect(()=>{
    console.log("effect call")
      axios
    .post(`${SERVER_PORT}/apis/register/confirm/${id}`)
    .then(res=>{
      setConfirming(false)
      notify.show(res.data.msg)
    })
    .catch(err=> console.log(err))
  }, [])

  return (
    <>
          <Notifications />
          <ConfirmDiv>
            {confirming
              ? <span className="spinner-border spinner-border-sm"></span>

              : <div>
                <p>Your email is confirmed exactly.</p>
                <p>Go to <Link to= "/login">Log in.</Link></p>
                </div>
            }
          </ConfirmDiv>
    </>
    )
}
const ConfirmDiv = styled.div`

`
export default EmailConfirm;

