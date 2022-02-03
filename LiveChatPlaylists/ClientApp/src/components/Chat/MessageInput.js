import React, { useState } from "react";
import { Col, Row } from "reactstrap";

const MessageInput = ({ sendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(message);
        setMessage('');
    }

    return (
        <div className="message-input">
            <Row>
                <Col xs='8'>
                    <input
                        type="text"
                        value={message}
                        onChange={e => setMessage(e.target.value)} />
                </Col>
                <Col xs={{ size: 3, offset: 1 }}>
                    <button onClick={handleSubmit}>Send</button>
                </Col>
            </Row>
        </div>
    )
}

export default MessageInput;