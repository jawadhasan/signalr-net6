namespace SignalRBasicSetup.WebAPI.Chat
{

    //We represent each user action(join, leave, message) by corresponding subclasses of Event,
    public enum EventType
    {
        JOIN,
        LEAVE,
        MESSAGE
    }
    public class ChatEvent
    {
        public DateTime Date { get; }
        public string User { get; }
        public EventType EventType { get; }
        public string Text { get; }
        public string DisplayDate { get; }

        public ChatEvent(string user, EventType eventType, string text = "")
        {
            this.Date = DateTime.Now;
            this.User = user;
            this.EventType = eventType;
            this.DisplayDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            this.Text = text;
        }
    }
    

    //ChatRoom-Model to store the posted messages
    public class ChatRoom
    {
        private static ChatRoom instance = null;
        public static int EVENT_STREAM_SIZE = 100;

        //is the stream of messages that are published in the room. limit applied [EVENT_STREAM_SIZE] if needed.
        private List<ChatEvent> _chatEvents = new List<ChatEvent>();

        public void AddEvent(ChatEvent chatEvent) {
            _chatEvents.Add(chatEvent);
        }

        // returns the list of messages that are published since the time pointed by passed index number, lastReceived.
        public IEnumerable<ChatEvent> ChatMessages(long lastReceived) // return eventStream.nextEvents(lastReceived);
        {
            return _chatEvents.Where(ce => ce.Date.Ticks >= lastReceived); //check
        }


        public IEnumerable<ChatEvent> GetChatHistory()
        {
            return _chatEvents.ToList();
        }

        public static ChatRoom GetInstance()
        {
            if (instance == null)
                instance = new ChatRoom();
            return instance;
        }
    }
}
