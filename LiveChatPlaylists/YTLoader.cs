using Google.Apis.Services;
using Google.Apis.YouTube.v3;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LiveChatPlaylists
{
    public class YTLoader
    {
        private int _quota;
        private Dictionary<string, QueryLog> _queryLog;
        private string _prefix;
        private string _apiKey;
        private YouTubeService _youTubeService;

        /// <summary>
        /// Creates instance of YTLoader class.
        /// </summary>
        public YTLoader()
        {
            _quota = 50;
            _prefix = "https://www.youtube.com/embed/";
            _apiKey = "AIzaSyCd7oXK3SIh5BBCC7-ggo4hvyizMWVgYPo"; // replace with ENV variable
            _queryLog = new Dictionary<string, QueryLog>();
        }

        private async Task<List<Video>> Query(string keywords, string nextPageToken = null, int maxResults = 50)
        {
            _youTubeService = new YouTubeService(new BaseClientService.Initializer()
            {
                ApiKey = _apiKey,
                ApplicationName = GetType().ToString()
            });

            var searchListRequest = _youTubeService.Search.List("snippet");

            // Sets the PageToken parameter if a token was provided.
            if (nextPageToken is not null)
            {
                searchListRequest.PageToken = nextPageToken;
            }

            searchListRequest.Q = keywords;
            searchListRequest.MaxResults = maxResults;
            searchListRequest.Type = "video";


            // Call the search.list method to retrieve results matching the specified query term.
            var searchListResponse = await searchListRequest.ExecuteAsync();

            // Add results to list of videos.
            List<Video> videos = new List<Video>();

            foreach (var searchResult in searchListResponse.Items)
            {
                Video newVideo = new Video(searchResult.Snippet.Title, _prefix + searchResult.Id.VideoId);
                videos.Add(newVideo);
            }

            System.Diagnostics.Debug.WriteLine(String.Format("Videos:\n{0}\n", string.Join("\n", videos)));

            // Log query and update page token if necessary.
            updateQueryLog(keywords, searchListResponse.NextPageToken);

            return videos;
        }

        /// <summary>
        /// Checks if loader is over YouTube API query quota.
        /// </summary>
        /// <returns>Boolean: true if the quota has been reached, false if under.</returns>
        private bool overQuota()
        {
            _queryLog = _queryLog.Where(query => query.Value.GetDate() == DateTime.Today).ToDictionary(q => q.Key, q => q.Value);
            return _queryLog.Count() >= _quota;
        }

        private void updateQueryLog(string keywords, string nextPageToken)
        {
            if (_queryLog.ContainsKey(keywords))
            {
                _queryLog[keywords].Update(nextPageToken);
            }
            else
            {
                _queryLog[keywords] = new QueryLog(nextPageToken);
            }
        }

        /// <summary>
        /// Calls a YouTube API query and logs to <c>_queryLog</c> if 
        /// the quota has not been reached.
        /// </summary>
        /// <param name="keywords">A list of keywords to use in the search.</param>
        /// <returns>Tuple containing boolean representing success and a <c>List<></c> of Videos</returns>
        public async Task<List<Video>> Search(List<string> keywordsList)
        {
            List<Video> foundVideos;

            if (overQuota())
            {
                return new List<Video>();
            }
            else
            {

                // Join keywords into query string.
                string keywords = String.Join("|", keywordsList);

                // Check query log to see if query has already been executed and a nextPageToken exists, otherwise execute normal query.
                if (_queryLog.ContainsKey(keywords))
                {
                    string pageToken = _queryLog[keywords].GetNextPageToken();
                    foundVideos = await Query(keywords, pageToken);
                }
                else
                {
                    foundVideos = await Query(keywords);
                }
                
                return foundVideos;
            }
        }
    }
}
