import CustomerRoutes from "./routes/CustomerRoutes";
import AuthProvider from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <CustomerRoutes />
    </AuthProvider>
  );
}

export default App;
