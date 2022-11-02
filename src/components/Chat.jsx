import Cam from './../img/3994416_camcorder_camera_movie_record_video camera_icon.png';
import Add from './../img/211872_person_add_icon.png';
import More from './../img/8723195_more_dots_icon.png';
import Messages from './Messages';
import Input from './Input';
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';

const Chat = () => {
    const {data} = useContext(ChatContext); // потомучто с таким названием передали значение из <ChatContext.Provider value={{ data: state, dispatch }}>

    return (
        <div className="chat">
            <div className="chatInfo">
                <span>{data.user?.displayName}</span>
                <div className="chatIcons">
                    <img src={Cam} alt="" />
                    <img src={Add} alt="" />
                    <img src={More} alt="" />
                </div>
            </div>
            <Messages/>
            <Input/>
        </div>
    )
}
export default Chat;