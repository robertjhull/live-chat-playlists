using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace LiveChatPlaylists
{
    public class PlaylistController
    {
        private YTLoader _loader;
        private Dictionary<string, Playlist> _playlists;

        public PlaylistController()
        {
            _loader = new YTLoader();
            _playlists = new Dictionary<string, Playlist>();
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
                List<string> keywords = _playlists[playlistName].Keywords;
                List<Video> videos = await _loader.Search(keywords);
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
