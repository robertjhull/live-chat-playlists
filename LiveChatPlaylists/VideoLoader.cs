using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LiveChatPlaylists
{
    public class VideoLoader
    {
        private int _APIcalls;
        private string _prefix;
        private string _APIkey;

        public VideoLoader()
        {
            _APIcalls = 0;
            _prefix = "https://www.youtube.com/embed/";
            _APIkey = "secret"; // replace with ENV variable
        }
    }
}
