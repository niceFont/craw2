import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [token, setToken] = React.useState(null)
  const [username, setUsername] = React.useState("")
  React.useEffect(() => {
    const ws = new WebSocket("wss://localhost:8000?key=528fad72-6335-413a-bc49-0674f3801a99")
    ws.addEventListener("open", () => {
      console.log("connection established");
      ws.send(JSON.stringify({type: "authenticate", payload: null}))
    })


    ws.addEventListener("message", (message) => {
      const {payload} = JSON.parse(message.data)
      setToken(payload.token)
      setUsername(payload.username)
    })
  }, [])
  return (
    <div className="App">
      <canvas></canvas>
    </div>
  );
}

export default App;
