import React from "react";

import { Container, HeaderContainer, HeaderText } from "./styles.js";

const MyComponent = (props) => {
  return (
    <Container>
      <HeaderContainer>
        {props.icon}
        <HeaderText>{props.title}</HeaderText>
      </HeaderContainer>
      <div style={{ flex: 1, width: "100%", height: "100%" }}></div>
    </Container>
  );
};

export default MyComponent;
