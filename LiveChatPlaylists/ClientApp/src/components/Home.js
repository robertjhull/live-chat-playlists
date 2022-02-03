import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import ChatContainer from './Chat/ChatContainer';
import VideoPlayer from './Player/VideoPlayer';

export const Home = () => {
    return (
        <Container>
            <Row>
                <Col xs="9">
                    <VideoPlayer />
                </Col>
                <Col xs="3">
                    <ChatContainer />
                </Col>
            </Row>
         </Container>
    )
}
