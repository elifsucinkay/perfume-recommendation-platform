import { useState, useEffect } from "react";

export default function NoteChat({ noteId, user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  async function loadMessages() {
    const res = await fetch(
      `http://localhost/gradperfume-api/note_chat_fetch.php?note_id=${noteId}&user_id=${user.id}`
    );
    const json = await res.json();
    if (json.success) setMessages(json.messages);
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!text.trim()) return;

    await fetch("http://localhost/gradperfume-api/note_chat_send.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        note_id: noteId,
        user_id: user.id,
        message: text,
      }),
    });

    setText("");
    loadMessages();
  }

  useEffect(() => {
    loadMessages();
    const timer = setInterval(loadMessages, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow border border-pink-200">
      <div className="h-64 overflow-y-auto mb-4 pr-2">
        {messages.map((m) => (
          <div key={m.id} className="mb-3">
            <div className="flex items-center gap-2">
              <img
                src={m.profile_image || "https://i.imgur.com/3GvwNBf.png"}
                className="w-8 h-8 rounded-full"
              />
              <strong>{m.username}</strong>
            </div>
            <p className="ml-10 text-gray-700">{m.message}</p>
            <span className="ml-10 text-xs text-gray-400">{m.created_at}</span>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded-lg"
          placeholder="Write message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="px-4 py-2 bg-pink-600 text-white rounded-lg">
          Send
        </button>
      </form>
    </div>
  );
}
