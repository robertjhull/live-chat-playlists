using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LiveChatPlaylists.Hubs
{
    public class ChatHub : Hub
    {
        private readonly string _botUser;
        private readonly IDictionary<string, UserConnection> _connections;
        private readonly List<string> _rooms;
        public ChatHub(IDictionary<string, UserConnection> connections, List<string> rooms)
        {
            _botUser = "Bot";
            _connections = connections;
            _rooms = rooms;
        }

        public async Task JoinRoom(UserConnection userConnection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room);
            _connections[Context.ConnectionId] = userConnection;
            await Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", _botUser, $"{userConnection.User} has joined {userConnection.Room}");

            await SendConnectedUsers(userConnection.Room);
        }


        public async Task SendMessage(string message)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                await Clients.Group(userConnection.Room)
                    .SendAsync("ReceiveMessage", userConnection.User, message);
            }
        }

        public async Task SendGlobalMessage(string message)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                await Clients.All
                    .SendAsync("ReceiveMessage", userConnection.User, message);
            }
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                _connections.Remove(Context.ConnectionId);
                Clients.Group(userConnection.Room)
                    .SendAsync("ReceiveMessage", _botUser, $"{userConnection.User} has left");

                SendConnectedUsers(userConnection.Room);
            }
            return base.OnDisconnectedAsync(exception);
        }

        public Task GetConnectedRooms()
        {
            var rooms = _connections.Values.Select(c => c.Room).Distinct().ToList();
            return Clients.All.SendAsync("RoomsOpen", rooms);
        }

        public Task SendConnectedUsers(string room)
        {
            var users = _connections.Values
                .Where(c => c.Room == room)
                .Select(c => c.User);
            return Clients.Group(room).SendAsync("UsersInRoom", users);
        }
    }
}
