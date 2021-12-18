import React from 'react';
import moment from 'moment';
import { Comment, Tooltip, Avatar} from 'antd';

function ChatCard(props){

    return(
        <div style ={{width: '100%'}}>
           <Comment
                author ={props.sender.name}
                avatar={
                    <Avatar
                        src={props.sender.image} 
                        />
                }
                content={
                    
                    props.message.substring(0, 7) === "uploads" ?
                    //content가 message Or video 라면  그 String의 0~8번째글자에 uploads/ 스트링이있기때문에
                    //단순 Text 정보와 (message Or video 정보를 구분할수있음)
                   
                        //video or image일때
                        props.message.substring(props.message.length - 3, props.message.length) === 'mp4' ?
                           //string뒤에서 3글자,즉 확장자 string을 이용해 동영상과 이미지를 구분하려함
                            
                                <video 
                                style={{maxWidth:'200px'}}
                                src ={`http://localhost:5000/${props.message}`} 
                                alt="video"
                                type="video/mp4" controls/>
                                :
                                <img 
                                style={{maxWidth:'200px'}}
                                src= {`http://localhost:5000/${props.message}`} 
                                alt="img"/>
                        
                        
                        :
                        //단순Text일때
                        <p>
                        {props.message}
                        </p>  
                    
                  
                }
                datetime={
                    <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                        <span>{moment().fromNow()}</span>
                    </Tooltip>
                }
            />
        </div>
    )
}
export default ChatCard;