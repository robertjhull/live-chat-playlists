import React, { useEffect, useRef } from 'react';

const NewMessage = ({ msg, idx }) => {
    const botStyle = {
        color: 'grey',
        fontWeight: 'bold',
        fontSize: '16px'
    }

    const userStyle = {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: '16px'
    }

    const isBot = msg.user === 'Bot';

    return (
        <li key={idx} className="new-message">{msg.message}
            <span style={isBot ? botStyle : userStyle}>
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