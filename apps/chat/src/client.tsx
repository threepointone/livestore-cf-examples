import "todomvc-app-css/index.css";

import { createRoot } from "react-dom/client";

import { App } from "./app";

createRoot(document.getElementById("app")!).render(<App />);

// ReactDOM.createRoot(document.getElementById('react-app')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )
