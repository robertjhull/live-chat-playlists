using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LiveChatPlaylists
{
    public class PlaylistManager
    {
        private IDictionary<string, Playlist> _playlists;

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
                System.Diagnostics.Debug.WriteLine($"Error: could not find playlist '{name}'."); // to delete
            }
        }

        public void RemovePlaylist(string name)
        {
            _playlists.Remove(name);
        }
    }
}
