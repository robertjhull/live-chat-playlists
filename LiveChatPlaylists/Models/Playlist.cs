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

        public List<Video> Videos { get; set; }
        public Playlist(string name, List<string> keywords)
        {
            Name = name;
            Keywords = keywords;
            Videos = new List<Video>();
        }

        /// <summary>
        /// Concatenates a list of videos to the existing list.
        /// </summary>
        /// <param name="videos">A <c>List<T></c> of <c>Video</c> objects.</param>
        public void AddVideos(List<Video> videos)
        {
            Videos.Concat(videos);
        }
    }
}
