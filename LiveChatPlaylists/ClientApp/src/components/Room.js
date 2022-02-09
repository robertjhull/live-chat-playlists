import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import ChatContainer from './Chat/ChatContainer';
import VideoPlayer from './Player/VideoPlayer';

const Room = ({ video, getNextVideo, messages, sendMessage, closeConnection }) => {
    return (
        <Container>
            <Row>
                <Col xs="9">
                    <VideoPlayer
                        video={video}
                        getNextVideo={getNextVideo}
                    />
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