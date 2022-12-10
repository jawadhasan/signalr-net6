namespace SignalRBasicSetup.WebAPI
{
    public class PresenceTracker
    {
        private static readonly Dictionary<string, int> onlineUsers = new Dictionary<string, int>();

        private static readonly Dictionary<string, string> connectionNickMap = new Dictionary<string, string>();



        public Task<bool> NickNameAvailable(string userId)
        {
            bool available = false;

            lock (onlineUsers)
            {
                if (!onlineUsers.ContainsKey(userId))
                {
                    available = true;
                }
            }

            return Task.FromResult(available);
        }

        public Task SetupNickConnection(string connectionId, string userId)
        {
            lock (connectionNickMap)
            {
                if (!connectionNickMap.ContainsKey(connectionId))
                {
                    connectionNickMap.Add(connectionId, userId);
                }
            }
            return Task.FromResult(0);
        }

        public Task<ConnectionOpenedResult> ConnectionOpened(string userId)
        {
            var joined = false;
            lock (onlineUsers)
            {
                if (onlineUsers.ContainsKey(userId))
                {
                    onlineUsers[userId] += 1;
                }
                else
                {
                    onlineUsers.Add(userId, 1);
                    joined = true;
                }
            }
            return Task.FromResult(new ConnectionOpenedResult { UserJoined = joined });
        }


        

        public Task<ConnectionClosedResult> ConnectionClosed(string userId)
        {
            var left = false;
            lock (onlineUsers)
            {
                if (onlineUsers.ContainsKey(userId))
                {
                    onlineUsers[userId] -= 1;
                    if (onlineUsers[userId] <= 0)
                    {
                        onlineUsers.Remove(userId);
                        left = true;
                    }
                }
            }


            lock (connectionNickMap)
            {
                if (connectionNickMap.ContainsKey(userId))//connectionId
                {
                    //get corresponding user
                    var nick = connectionNickMap[userId];
                    onlineUsers.Remove(nick);
                    left = true;


                }
            }

            return Task.FromResult(new ConnectionClosedResult { UserLeft = left });
        }

        public Task<string[]> GetOnlineUsers()
        {
            lock (onlineUsers)
            {
                return Task.FromResult(onlineUsers.Keys.ToArray());
            }
        }
    }

    public class ConnectionOpenedResult
    {
        public bool UserJoined { get; set; }
    }

    public class ConnectionClosedResult
    {
        public bool UserLeft { get; set; }
    }
}
