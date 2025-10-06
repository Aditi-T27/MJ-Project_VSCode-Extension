import { useEffect, useState } from "react";
// const vscode = acquireVsCodeApi();
function App() {
    const [endpoints, setEndpoints] = useState([]);
    useEffect(() => {
        window.addEventListener("message", (event) => {
            const { type, data } = event.data;
            if (type === "endpoints") {
                setEndpoints(data);
            }
        });
    }, []);
    return (<div style={{ padding: "1rem" }}>
      <h2>Extracted Endpoints</h2>
      {endpoints.length === 0 ? (<p>No endpoints yet</p>) : (<ul>
          {endpoints.map((ep, i) => (<li key={i}>
              <b>{ep.method}</b> → {ep.endpoint}
            </li>))}
        </ul>)}
    </div>);
}
export default App;
//# sourceMappingURL=App.js.map