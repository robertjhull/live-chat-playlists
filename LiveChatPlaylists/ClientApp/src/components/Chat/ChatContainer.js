import React, { useState } from "react";
import { Form, FormGroup, Input, Button } from "reactstrap";
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import MessagesContainer from "./MessagesContainer";
import MessageInput from "./MessageInput";

const validateUsername = (username) => username.length >= 3;

const ChatContainer = () => {
    const [username, setUsername] = useState('');

    const [connection, setConnection] = useState();
    const [loggedInUser, setLoggedInUser] = useState('');
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);

    const joinRoom = async (user, room) => {
        try {
            const connection = new HubConnectionBuilder()
                .withUrl("https://localhost:44345/chat")
                .configureLogging(LogLevel.Information)
                .build();

            connection.on("UsersInRoom", (users) => {
                setUsers(users);
            })

            connection.on("ReceiveMessage", (user, message) => {
                setMessages(messages => [...messages, {user, message}])
            })

            connection.onclose(e => {
                setConnection();
                // setMessages([]);
                // setUsers([]);
            })

            await connection.start();
            await connection.invoke("JoinRoom", { user, room })
                .then(user => setLoggedInUser(user))
                .catch(err => console.log(err));

            setConnection(connection);
        } catch (e) {
            console.log(e)
        }
    }

    const closeConnection = async () => {
        try {
            await connection.stop();
        } catch (e) {
            console.log(e);
        }
    }

    const sendMessage = async (message) => {
        try {
            await connection.invoke("SendMessage", message);
        } catch (e) {
            console.log(e)
        }
    }

    const handleUsername = (e) => {
        e.preventDefault();
        const room = 'test-room';
        if (validateUsername(username)) {
            console.log(`${username} attempting to join ${room}`);
            joinRoom(username, room);
        }
    }

    return loggedInUser ? (
        <div className='section'>
            <div className='chat-container'>
                <MessagesContainer {...messages} />
                <MessageInput sendMessage={sendMessage} />
            </div>
        </div>
    ) : (
        <Form onSubmit={handleUsername}>
            <FormGroup>
                <Input
                    id="usernameInput"
                    name="username"
                    placeholder="Enter a username to join chat"
                    type="text"
                    onChange={e => setUsername(e.target.value)}
                />
                <Button>Submit</Button>
            </FormGroup>
        </Form>
    );
}

export default ChatContainer;