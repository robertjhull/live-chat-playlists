using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LiveChatPlaylists
{
    public class Video
    {
        public string Title { get; set; }
        public string Url { get; set; }
        public Video(string title, string url)
        {
            Title = title;
            Url = url;
        }
    }
}
