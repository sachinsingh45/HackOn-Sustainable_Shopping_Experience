import React, { useEffect, useState, useRef, useCallback } from 'react';
import Avatar from 'react-avatar';
import { chatSocket } from '../services/socket';

const ChatRoom = ({ messages, setMessages,  groupId, groupName = 'Group Chat', userId, userName = 'Anonymous', className = '', onMessageSent, onMessageReceived, showAvatars = false, showTimestamps = true, }) => {

  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(chatSocket.connected);
  const [typingUsers, setTypingUsers] = useState([]);

  const inputRef = useRef(null);

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;

    const message = { content: input, groupId, senderId: userId, senderName: userName, timestamp: new Date().toISOString(), };

    chatSocket.emit('send-message', message);
    setInput('');

    if (onMessageSent) onMessageSent(message);
  }, [input, groupId, userId, userName, onMessageSent]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    chatSocket.emit('typing', { groupId, userId, userName });
  };

  useEffect(() => {

    if (chatSocket.connected) {
      chatSocket.emit('join-group', { groupId, userId });
    } else {
      chatSocket.on('connect', () => {
        chatSocket.emit('join-group', { groupId, userId });
      });
    }

    chatSocket.on('receive-message', (data) => {
      if (data?.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    });



    chatSocket.on('typing', ({ userName: typingUser }) => {
      if (typingUser && typingUser !== userName) {
        setTypingUsers((prev) => {
          const updated = new Set([...prev, typingUser]);
          return Array.from(updated);
        });

        setTimeout(() => {
          setTypingUsers((prev) => prev.filter(name => name !== typingUser));
        }, 2000);
      }
    });

    return () => {
      chatSocket.off('receive-message');
      chatSocket.off('typing');
    };
  }, [groupId, userId, userName, onMessageReceived]);


  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',  hour12: true, }).toUpperCase();
  };


  return (
    <div className={`flex flex-col h-full bg-gray-100 rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Header */}
      <header className="bg-green-600 text-white p-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {showAvatars && <Avatar name={groupName} size="36" round />}
            <h2 className="font-semibold">{groupName}</h2>
          </div>
          <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-300' : 'bg-red-500'}`} />
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-1 space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.senderId._id === userId ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs px-2 py-1 rounded-lg ${msg.senderId._id === userId ? 'bg-green-100 rounded-tr-none' : 'bg-white rounded-tl-none'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                {msg.senderId._id !== userId && (
                  <Avatar
                    name={msg.senderId.name}
                    size="30"
                    round
                  />
                )}

              </div>
              <div className="text-gray-800 text-xs">{msg.content}</div>
              {showTimestamps && (
                <div className="text-[10px] text-gray-500 text-right">
                  {formatTime(msg.sentAt)}
                </div>
              )}
            </div>
          </div>
        ))}

        {typingUsers.length > 0 && (
          <div className="text-xs italic text-gray-500">
            {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
          </div>
        )}
       
      </main>

      {/* Input */}
      <footer className="bg-white border-t px-3 py-2">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-full disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatRoom;
