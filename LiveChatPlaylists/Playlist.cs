using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LiveChatPlaylists
{
    public class Playlist
    {
        public string Name { get; set; }
        public List<string> Keywords { get; set; }
        private List<string> _videoIDs { get; set; }
        public Playlist(string name, List<string> keywords)
        {
            Name = name;
            Keywords = keywords;
        }
        public void AddVideosToPlaylist(List<string> videoIDs)
        {
            _videoIDs.Concat(videoIDs);
        }

        public void ResetVideosInPlaylist(List<string> videoIDs)
        {
            _videoIDs = videoIDs;
        }
    }
}
