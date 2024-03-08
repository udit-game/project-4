import './App.css';
import Login from "./pages/login";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Navbar from "./components/navbar";
import Signup from "./pages/signup";
import LandingPage from "./pages/landing";
import {useAuth} from "./Context/Context";
import health from "./images/health.png";

function App() {
  const { user, checktoken, setUser } = useAuth();
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  if (user===null) {
    checktoken(token);
  }

  return (
<Router>
    <div className="App">
      <img className="plusSign" src={health}/>
      <Navbar />
      <Routes>
        <Route exact path="/" element={isAuthenticated && user ? <LandingPage /> : <Login />} />
        <Route exact path="/login" element={isAuthenticated && user ?<Login /> : <Login />} />
        <Route exact path="/signup" element={isAuthenticated && user ?<Signup /> : <Signup />} />
      </Routes>
    </div>
</Router>
  );
}

export default App;
