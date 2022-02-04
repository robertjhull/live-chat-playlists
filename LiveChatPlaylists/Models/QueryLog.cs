using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LiveChatPlaylists
{
    public class QueryLog
    {
        private DateTime _executedAt;
        private string _nextPageToken;

        public QueryLog(string nextPageToken)
        {
            _nextPageToken = nextPageToken;
            _executedAt = new DateTime();
        }

        public void Update(string newToken)
        {
            _nextPageToken = newToken;
            _executedAt = new DateTime();
        }

        public DateTime GetDate()
        {
            return _executedAt.Date;
        }

        public string GetNextPageToken()
        {
            return _nextPageToken;
        }
    }
}
