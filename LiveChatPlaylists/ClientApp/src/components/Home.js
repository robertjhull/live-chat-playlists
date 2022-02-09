import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import Lobby from './Lobby';
import Room from './Room';
import { Container } from 'reactstrap';

export const Home = () => {
    const [connection, setConnection] = useState();
    const [loggedIn, setLoggedIn] = useState({
        user: '',
        color: ''
    });
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [messages, setMessages] = useState([]);
    const [video, setVideo] = useState({
        title: '',
        url: ''
    })

    const joinRoom = async (user, room) => {
        try {
            await connection.invoke("JoinRoom", { user, room })
                .then(res => {
                    setLoggedIn({ user: res.user, color: res.color.name })
                })
                .catch(err => console.log(err));
        } catch (e) {
            console.log(e)
        }
    }

    const getNextVideo = async () => {
        try {
            await connection.invoke("GetNewVideo");
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

    useEffect(() => {
        async function getRooms() {
            try {
                const connection = new HubConnectionBuilder()
                    .withUrl("https://localhost:44345/chat")
                    .configureLogging(LogLevel.Information)
                    .build();

                connection.on("RoomsOpen", (rooms) => {
                    setRooms(rooms);
                });

                connection.on("UsersInRoom", (users) => {
                    setUsers(users);
                })
    
                connection.on("ReceiveMessage", (user, color, message) => {
                    setMessages(messages => [...messages, {user, color, message}])
                })

                connection.on("ReceiveVideo", (video) => {
                    setVideo({ title: video.title, url: video.url });
                })
    
                connection.onclose(e => {
                    setConnection();
                    // setMessages([]);
                    // setUsers([]);
                })

                await connection.start();
                await connection.invoke("GetConnectedRooms");

                setConnection(connection);
            } catch (e) {
                console.log(e);
            }
        }
        getRooms();
    }, [])

    console.log(video);

    return (
        <Container>
            {
                loggedIn.user ? (
                    <Room
                        video={video}
                        getNextVideo={getNextVideo}
                        messages={messages}
                        sendMessage={sendMessage}
                        closeConnection={closeConnection}
                    />
                ) : (
                    <Lobby
                        rooms={rooms}
                        joinRoom={joinRoom}
                    />
                )
            }
        </Container>
    )
}
