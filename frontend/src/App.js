import React, { useEffect, useState } from "react";
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
    return React.createElement(
      "div",
      { style: { padding: "1rem" } },
      React.createElement("h2", null, "Extracted Endpoints"),
      endpoints.length === 0
        ? React.createElement("p", null, "No endpoints yet")
        : React.createElement(
            "ul",
            null,
            endpoints.map((ep, i) =>
              React.createElement(
                "li",
                { key: i },
                React.createElement("b", null, ep.method),
                " → ",
                ep.endpoint
              )
            )
          )
    );
}
export default App;
//# sourceMappingURL=App.js.map