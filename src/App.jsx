import "./app.css";
import { AuthProvider } from "./context/AuthContext";

function App({ children }) {
  return (
    <AuthProvider>
      <div className="App">{children}</div>
    </AuthProvider>
  );
}

export default App;
