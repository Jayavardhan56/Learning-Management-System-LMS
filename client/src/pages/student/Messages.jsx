import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { FaEnvelope, FaSearch, FaPaperPlane, FaUserCircle, FaCircle } from "react-icons/fa";
import { getAuthToken, getAuthUser } from "../../utils/auth";

const Messages = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const user = getAuthUser();
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchContacts = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/auth/contacts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setContacts(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchMessages = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`http://localhost:5000/api/auth/messages/${selectedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setMessages(data);
    } catch (err) { console.error(err); }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/auth/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: selectedUser.id,
          content: newMessage
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessages([...messages, data]);
        setNewMessage("");
      }
    } catch (err) { console.error(err); }
  };

  return (
    <DashboardLayout title="Messaging Hub">
      <div className="animate-fade-in" style={{ height: "calc(100vh - 120px)", display: "flex", background: "white", margin: "20px", borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>

        {}
        <div style={{ width: "350px", borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column" }}>
           <div style={{ padding: "25px", borderBottom: "1px solid #F1F5F9" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "15px" }}>Chats</h2>
              <div style={{ position: "relative" }}>
                 <FaSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                 <input type="text" placeholder="Search contacts..." style={{ width: "100%", padding: "10px 10px 10px 35px", borderRadius: "8px", border: "1px solid #E2E8F0", outline: "none", fontSize: "0.9rem" }} />
              </div>
           </div>
           <div style={{ flex: 1, overflow: "auto" }}>
              {contacts.map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelectedUser(c)}
                  style={{
                    padding: "15px 25px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px",
                    background: selectedUser?.id === c.id ? "#F1F7FF" : "transparent",
                    borderLeft: selectedUser?.id === c.id ? "4px solid #3B82F6" : "4px solid transparent",
                    transition: "0.2s"
                  }}
                >
                   <div style={{ position: "relative" }}>
                      <FaUserCircle style={{ fontSize: "2.5rem", color: "#E2E8F0" }} />
                      <FaCircle style={{ position: "absolute", bottom: "2px", right: "2px", fontSize: "0.7rem", color: "#10B981", border: "2px solid white", borderRadius: "50%" }} />
                   </div>
                   <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: "#1E293B", fontSize: "0.95rem" }}>{c.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: 600 }}>{c.role.toUpperCase()} • {c.college_name}</div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {}
        {selectedUser ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#F8FAFC" }}>
             <div style={{ padding: "15px 30px", background: "white", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "15px" }}>
                <FaUserCircle style={{ fontSize: "2rem", color: "#E2E8F0" }} />
                <div>
                   <div style={{ fontWeight: 800, color: "#1E293B" }}>{selectedUser.name}</div>
                   <div style={{ fontSize: "0.7rem", color: "#10B981", fontWeight: 700 }}>Online</div>
                </div>
             </div>
             <div style={{ flex: 1, padding: "30px", overflow: "auto", display: "flex", flexDirection: "column", gap: "15px" }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ alignSelf: m.sender_id === user.id ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                     <div style={{
                        padding: "12px 18px", borderRadius: "18px", fontSize: "0.95rem", fontWeight: 600,
                        background: m.sender_id === user.id ? "#3B82F6" : "white",
                        color: m.sender_id === user.id ? "white" : "#1E293B",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        borderBottomRightRadius: m.sender_id === user.id ? "2px" : "18px",
                        borderBottomLeftRadius: m.sender_id === user.id ? "18px" : "2px",
                     }}>
                        {m.content}
                     </div>
                     <div style={{ fontSize: "0.65rem", color: "#94A3B8", marginTop: "5px", textAlign: m.sender_id === user.id ? "right" : "left" }}>
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
             </div>
             <form onSubmit={handleSendMessage} style={{ padding: "20px 30px", background: "white", borderTop: "1px solid #E2E8F0", display: "flex", gap: "15px" }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  style={{ flex: 1, padding: "12px 20px", borderRadius: "12px", border: "1px solid #E2E8F0", outline: "none", background: "#F8FAFC" }}
                />
                <button type="submit" style={{ background: "#3B82F6", color: "white", border: "none", width: "45px", height: "45px", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <FaPaperPlane />
                </button>
             </form>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F8FAFC" }}>
             <div style={{ textAlign: "center", maxWidth: "400px" }}>
                <div style={{ width: "80px", height: "80px", background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
                   <FaEnvelope style={{ fontSize: "2rem", color: "#3B82F6" }} />
                </div>
                <h2 style={{ color: "#1E293B", fontWeight: 800, marginBottom: "10px" }}>Your Inbox</h2>
                <p style={{ color: "#94A3B8", fontSize: "0.95rem" }}>Select a contact from the left to start a conversation with your instructors or managers.</p>
             </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Messages;
