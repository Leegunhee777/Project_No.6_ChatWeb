import React, { useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import { Form, Icon, Input, Button, Row, Col, } from 'antd';
import io from "socket.io-client";
import  moment  from "moment";
import {getChats,afterPostMessage} from '../../../_actions/chat_actions';
import ChatCard from './Sections/ChatCard';
import Dropzone from 'react-dropzone';//npm i react-dropzone
import axios from 'axios';

const socket = io("http://localhost:5000");
//이설정을 해줘야 서버의 socket이랑 연결될수있음, 
//이설정해놓고 별도의 connection작성코드는필요없고, 바로 socket.on ,socket.emit 사용하면 서버와 통신가능함 

function ChatPage({user}) {
    const dispatch = useDispatch();//액션을 손쉽게 dispatch시킬수있음
    const chats = useSelector(state => state.chats) //chat이라는 리듀서의 state값에 손쉽게 접근가능

    const messagesEnd = useRef(null);
    const [chatMessagee, setchatMessagee] = useState("");

    useEffect(()=>{
        
        dispatch(getChats()); //getchats액션함수를 발동시켜서,서버에서 chatData를 가져와 chat리듀서에서의 state에 저장한다.
                                //스토어의 state값을 map을 이용해 렌더시킨다!!!.
        //처음들어갈때 axios로 서버에서 가지고 있는 채팅창 data를 가져온다.

        socket.on("Output Chat Message", messageFromBackEnd => {
            console.log('subscribe')
            console.log(messageFromBackEnd)
            dispatch(afterPostMessage(messageFromBackEnd));  //서버로부터의 data를 파라미터로 넣어준다.messageFromBackEnd안에는 내가 방금입력창에 입력한 메세지Or File관련정보가들어있다
                                                            //그럼 afterpostmessage()액션함수가 받아 chat리듀서에서의 스토어의 state에 방금입력한 값을 추가한다.
        })
    },[])


    useEffect(()=>{
        messagesEnd.current.scrollIntoView({behavior: 'smooth'}) //스크롤설정2.이걸해줘야 새롭게 추가되는 채팅 data에 맞춰 스크롤이 그에맞춰내려감
    },)


    

    
    const renderCards = () =>
    chats.chat
        && chats.chat.map((chat) => (
            <ChatCard key={chat._id}  {...chat} />
        ));
    
        
    const onDrop = (files) =>{
        let formData = new FormData;

        formData.append("file", files[0]);
        
        const config = { //파일데이터를 보낼때 필요
            header : { 'content-type ': 'multipart/form-data'}
        }

        axios.post('/api/chat/uploadfiles', formData, config)
        .then(response =>{
            if(response.data.success){
               
                let chatMessage = response.data.url; //파일에 대한 경로, String값을 넣어줌
                let userId =   user.userData._id
                let userName = user.userData.name;
                let userImage = user.userData.image;
                let nowTime = moment();
                let type = "VideoOrImage"


                socket.emit("Input Chat Message", {
                    chatMessage,
                    userId,
                    userName,
                    userImage,
                    nowTime,
                    type
                });
            }
        })
       
    }

    const handleSearchChange =(e) => {
        setchatMessagee(e.target.value);
    }


    const submitChatMessage = (e) => {
        e.preventDefault();
        
        let chatMessage = chatMessagee
        let userId =   user.userData._id
        let userName = user.userData.name;
        let userImage = user.userData.image;
        let nowTime = moment();
        let type = "Text"

        //연결된 소켓으로 Input Chat Message란 이름의 이벤트를 정보를 담아서 보낸다
        //서버에선 socket.on(Input Chat Messge....)으로 해당 이벤트의 emit()을 통해 보내진 데이터를 받을수있다.
        socket.emit("Input Chat Message", {
            chatMessage,
            userId,
            userName,
            userImage,
            nowTime,
            type
        });
    
        setchatMessagee("");
    }
    return (
        <React.Fragment>
        <div>
            <p style={{ fontSize: '2rem', textAlign: 'center' }}> Real Time Chat</p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="infinite-container" style={{ height: '500px', overflow:'scroll'}}> {/*스트롤 설정1 */} 
            {chats && renderCards()}
            가나다
                <div
                    ref={messagesEnd}
                    style={{ float: "left", clear: "both" }}
                />
            </div>

            <Row >
                <Form layout="inline" onSubmit={submitChatMessage}>
                    <Col span={18}>
                        <Input
                            id="message"
                            prefix={<Icon type="message" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Let's start talking"
                            type="text"
                            value={chatMessagee}
                            onChange={handleSearchChange}
                        />
                    </Col>
                    <Col span={2}>
                    <Dropzone onDrop={onDrop}>
                                    {({ getRootProps, getInputProps }) => (
                                        <section>
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <Button>
                                                    <Icon type="upload" />
                                                </Button>
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>
                    </Col>

                    <Col span={4}>
                        <Button type="primary" style={{ width: '100%' }} onClick={submitChatMessage}  htmlType="submit">
                            <Icon type="enter" />
                        </Button>
                    </Col>
                </Form>
            </Row>
        </div>
    </React.Fragment>
    )
  }
  
  export default ChatPage;