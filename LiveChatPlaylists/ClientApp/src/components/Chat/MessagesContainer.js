import React, { useEffect, useRef } from 'react';

const NewMessage = ({ msg, idx }) => {
    const messageStyle = {
        color: `#${msg.color}`,
        fontWeight: 'bold',
        fontSize: '16px'
    }

    return (
        <li key={idx} className="new-message">{msg.message}
            <span style={messageStyle}>
                {' < ' + msg.user}
            </span>
        </li>
    )
}

const MessagesContainer = (messages) => {
    const messageRef = useRef();

    useEffect(() => {
        if(messageRef && messageRef.current) {
            const { scrollHeight, clientHeight } = messageRef.current;
            messageRef.current.scrollTo({left: 0, top: scrollHeight - clientHeight, behavior: 'smooth'});
        }
    }, [messages])

    return (
        <ul ref={messageRef} className='message-container'>
            {messages && Object.values(messages).map((msg, idx) => {
                return <NewMessage msg={msg} idx={idx} />
            })}
        </ul>
    )
}

export default MessagesContainer;