import React from "react";
import MessagesContainer from "./MessagesContainer";
import MessageInput from "./MessageInput";


const ChatContainer = ({ messages, sendMessage }) => {
    return (
        <div className='section'>
            <div className='chat-container'>
                <MessagesContainer {...messages} />
                <MessageInput sendMessage={sendMessage} />
            </div>
        </div>
    )
}

export default ChatContainer;