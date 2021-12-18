import {
    GET_CHATS,
    AFTER_POST_MESSAGE
} from '../_actions/types';
 

export default function(state={},action){
    switch(action.type){
        case GET_CHATS:
            return {...state, chat: action.payload }
        
        case AFTER_POST_MESSAGE:
            return {...state, chat: state.chat.concat(action.payload) }
         
        default:
            return state;
    }
}