import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import ChatContainer from './Chat/ChatContainer';
import VideoPlayer from './Player/VideoPlayer';

const Room = ({messages, sendMessage}) => {
    return (
        <Container>
            <Row>
                <Col xs="9">
                    <VideoPlayer />
                </Col>
                <Col xs="3">
                    <ChatContainer
                        messages={messages}
                        sendMessage={sendMessage}
                    />
                </Col>
            </Row>
         </Container>
    )
}

export default Room;