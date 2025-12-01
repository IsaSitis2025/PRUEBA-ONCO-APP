import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { Provider } from "./components/ui/provider"
import 'sweetalert2/dist/sweetalert2.min.css'
import 'react-day-picker/dist/style.css';

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider>
            <App />
        </Provider>
    </React.StrictMode>
)
