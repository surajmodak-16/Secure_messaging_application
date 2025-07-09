import React, { useState, useEffect } from 'react';

function App() {
  const [phase, setPhase] = useState('register');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [socket, setSocket] = useState(null);
  const [chat, setChat] = useState([]);

  const register = async () => {
    const res1 = await fetch("https://localhost:3000/opaque/register-init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const init = await res1.json();
    const res2 = await fetch("https://localhost:3000/opaque/register-finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, record: init.record })
    });
    const done = await res2.json();
    if (done.success) {
      alert("Registered successfully");
      setPhase("login");
    }
  };

  const login = async () => {
    const res1 = await fetch("https://localhost:3000/opaque/login-init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const init = await res1.json();
    const res2 = await fetch("https://localhost:3000/opaque/login-finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, record: init.record })
    });
    const done = await res2.json();
    if (done.success) {
      alert("Login successful");
      setPhase("chat");
      const ws = new WebSocket("wss://localhost:3000");
      ws.onmessage = (event) => setChat(prev => [...prev, event.data]);
      setSocket(ws);
    }
  };

  const send = () => {
    if (socket && msg) {
      socket.send(JSON.stringify({ from: username, message: msg }));
      setChat(prev => [...prev, "You: " + msg]);
      setMsg('');
    }
  };

  const inputStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    width: "100%",
    marginBottom: "10px",
    fontSize: "14px"
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "5px"
  };

  const containerStyle = {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#fefefe"
  };

  const chatBubble = (text, i) => (
    <div key={i} style={{
      padding: "8px 12px",
      margin: "5px 0",
      backgroundColor: text.startsWith("You:") ? "#d1e7ff" : "#f1f1f1",
      borderRadius: "12px",
      alignSelf: text.startsWith("You:") ? "flex-end" : "flex-start",
      maxWidth: "80%"
    }}>{text}</div>
  );

  return (
    <div style={containerStyle}>
      {phase !== "chat" && (
        <>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            {phase === "register" ? "Register" : "Login"}
          </h2>
          <input style={inputStyle} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input style={inputStyle} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          {phase === "register" ? (
            <button style={buttonStyle} onClick={register}>Register</button>
          ) : (
            <button style={buttonStyle} onClick={login}>Login</button>
          )}
          <p style={{ marginTop: "15px", textAlign: "center" }}>
            {phase === "register" ? (
              <span onClick={() => setPhase("login")} style={{ color: "#007bff", cursor: "pointer" }}>Already have an account? Login</span>
            ) : (
              <span onClick={() => setPhase("register")} style={{ color: "#007bff", cursor: "pointer" }}>Don't have an account? Register</span>
            )}
          </p>
        </>
      )}
      {phase === "chat" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", height: "300px", overflowY: "auto", marginBottom: "10px", background: "#fafafa", padding: "10px", borderRadius: "8px" }}>
            {chat.map((c, i) => chatBubble(c, i))}
          </div>
          <input style={inputStyle} placeholder="Type a message..." value={msg} onChange={e => setMsg(e.target.value)} />
          <button style={buttonStyle} onClick={send}>Send</button>
        </>
      )}
    </div>
  );
}

export default App;
