using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;

namespace LiveChatPlaylists
{
    public interface IPlaylistController
    {
        void AddPlaylist(string name, List<string> keywords);
        Dictionary<string, Playlist> GetPlaylists();
        void UpdatePlaylist(string name, List<string> newKeywords);
        void RemovePlaylist(string name);
        Task<bool> RefreshVideos(string playlistName);
        Task<List<Video>> GetPlaylistVideos(string playlistName);
    }

    public class PlaylistController : IPlaylistController
    {
        private YTLoader _loader;
        private Dictionary<string, Playlist> _playlists;
        private readonly IHubContext<Hubs.ChatHub> _chatHub;

        public PlaylistController(IHubContext<Hubs.ChatHub> chatHub)
        {
            _loader = new YTLoader();
            _playlists = new Dictionary<string, Playlist>();
            _chatHub = chatHub;

            RunInitialSetup();
        }

        public void RunInitialSetup()
        {
            Playlist default_one;
            Playlist default_two;
            Playlist default_three;

            default_one = new Playlist("Classic Sports Highlights", new List<string> { "sw561", "highlights" });
            default_two = new Playlist("Souls", new List<string> { "From Software", "souls", "gameplay", "no commentary" });
            default_three = new Playlist("Random", new List<string> { "random", "bizarre", "fever dream" });

            _playlists.Add(default_one.Name, default_one);
            _playlists.Add(default_two.Name, default_two);
            _playlists.Add(default_three.Name, default_three);
        }

        public Dictionary<string, Playlist> GetPlaylists()
        {
            return _playlists;
        }

        public void AddPlaylist(string name, List<string> keywords)
        {
            Playlist newPlaylist = new Playlist(name, keywords);
            _playlists.Add(name, newPlaylist);
        }

        public void UpdatePlaylist(string name, List<string> newKeywords)
        {
            if (_playlists.ContainsKey(name))
            {
                _playlists[name] = new Playlist(name, newKeywords);
            }
            else
            {
                Debug.WriteLine($"Error: could not find playlist '{name}'."); // to delete
            }
        }

        public void RemovePlaylist(string name)
        {
            _playlists.Remove(name);
        }

        public async Task<bool> RefreshVideos(string playlistName)
        {
            if (_playlists.ContainsKey(playlistName))
            {
                List<string> keywords;
                List<Video> videos;

                keywords = _playlists[playlistName].Keywords;
                videos = await _loader.Search(keywords);
                _playlists[playlistName].AddVideos(videos);
                return true;
            }
            else
            {
                Debug.WriteLine($"Error: could not find playlist '{playlistName}'.");
                return false;
            }
        }

        public async Task<List<Video>> GetPlaylistVideos(string playlistName)
        {
            try
            {
                bool success = await RefreshVideos(playlistName);
                if (success)
                {
                    return _playlists[playlistName].Videos;
                }
                else return new List<Video>();
            }
            catch (Exception e)
            {
                Debug.WriteLine(e.Message);
                throw;
            }
        }

    }
}
