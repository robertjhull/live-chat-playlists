import React, { useState } from 'react';
import { Label, Table } from 'reactstrap';
import { Form, Col, FormGroup, Input, Button } from "reactstrap";

const Lobby = ({ rooms, joinRoom }) => {
    const [username, setUsername] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');

    const validateUsername = (username) => username.length >= 3;

    const handleUsername = (e) => {
        e.preventDefault();
        if (validateUsername(username)) {
            console.log(`${username} attempting to join ${selectedRoom}`);
            joinRoom(username, selectedRoom);
        }
    }

    return (
        <Form onSubmit={handleUsername}>
            <FormGroup row>
                <Label
                    for="username"
                    sm={2}
                >
                    Username
                </Label>
                <Col sm={10}>
                    <Input
                        id="usernameInput"
                        name="username"
                        placeholder="Enter a username"
                        type="text"
                        onChange={e => setUsername(e.target.value)}
                    />
                </Col>
            </FormGroup>
            <FormGroup>
                <Table dark>
                    <tbody>
                        {Object.values(rooms).map((room) => {
                            return (
                                <tr
                                    onClick={() => setSelectedRoom(room.name)}
                                    className={(selectedRoom === room.name ? 'row-btn selected' : 'row-btn')}>
                                    <td>{room.name}</td>
                                    <td>{room.keywords.map(keyword => {
                                        return <span className='tag'>{keyword}</span>
                                    })}</td>
                                    <td>{room.users}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </FormGroup>
            <FormGroup>
                <Button>Join Room</Button>
            </FormGroup>
        </Form>
    )
}

export default Lobby;