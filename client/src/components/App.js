import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import ChatPage from "./views/ChatPage/ChatPage"

import NavBar from "./views/layout/NavBar/NavBar";
import Footer from "./views/layout/Footer/Footer";

//Auth함수 인자설명
//null   아무나 다 들어갈수 있는경로
//true   로그인상태인사람만 들어갈수 있는경로
//false  로그인상태인사람은 들어갈수 없는경로( ex 로그인, 회원가입경로)
//로그인상태,인지 아닌지는  서버의 User 디비에서 유저토큰이란 정보를 가지고있는데,
//로그인상태이면 DB의 유저 토큰정보가 null이 아닌 값이 들어가있어서 이 값을 리덕스 스토어에 받아와서 사용
//로그인상태가 아니면 DB의 유저 토큰정보가 null이여서 이 값을 리덕스 스토어에 받아와서 사용
function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/chat" component={Auth(ChatPage, true)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
