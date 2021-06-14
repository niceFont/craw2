import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  React.useEffect(() => {
    const ws = new WebSocket("wss://localhost:8000?key=528fad72-6335-413a-bc49-0674f3801a99")
    ws.addEventListener("open", () => {
      console.log("connection established");
      ws.send(JSON.stringify({type: "authenticate", payload: null}))
    })
    ws.addEventListener("message", (data) => {
      console.log(data)
    })
  })
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
