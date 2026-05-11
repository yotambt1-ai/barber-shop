import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import BookAppointment from "./pages/BookAppointment";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<BookAppointment />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        
        <Link to="/admin" className="fixed bottom-4 right-4 z-50 text-xs text-muted-foreground hover:text-primary transition-colors bg-card/80 px-3 py-1.5 rounded-full border shadow-sm backdrop-blur-sm">Admin View</Link>
      </div>
    </BrowserRouter>
  );
}

export default App;