using RandomColorGenerator;
using System.Drawing;

namespace LiveChatPlaylists
{
    public class UserConnection
    {
        public string User { get; set; }
        public string Room { get; set; }
        public Color Color { get; set; }

        public UserConnection()
        {
            this.Color = RandomColor.GetColor(ColorScheme.Random, Luminosity.Bright);
        }
    }
}
