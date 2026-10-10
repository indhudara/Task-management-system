import { useEffect, useState } from "react";
import collegeData from './colleges.json';
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
  Navigate,
} from "react-router-dom";
import "./App.css";

const API_URL = "http://localhost:5000/api/colleges";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <NavLink to="/" className="brand">Aspire<span>Colleges</span></NavLink>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/colleges">Colleges</NavLink>
        <NavLink to="/reviews">Reviews</NavLink>
        <button className="logout-button" onClick={() => navigate("/login")}>Logout</button>
      </nav>
    </header>
  );
}

function Home() {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <p className="eyebrow">YOUR FUTURE STARTS HERE</p>
      <h1>Find the right college for your future.</h1>
      <p>Explore colleges, compare courses, and find options that fit your budget.</p>
      <button onClick={() => navigate("/colleges")}>Explore Colleges →</button>
    </section>
  );
}

function Colleges() {
  const [collegesList, setCollegesList] = useState([]);
  const [allCollegeNames, setAllCollegeNames] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [course, setCourse] = useState("");
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate names using the imported JSON file directly or via API fallback
  useEffect(() => {
    const names = [...new Set(collegeData.map((c) => c.name))];
    setAllCollegeNames(names);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchColleges() {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (location) params.set("location", location);
      if (course) params.set("course", course);
      if (minFee !== "") params.set("minFee", minFee);
      if (maxFee !== "") params.set("maxFee", maxFee);

      try {
        const response = await fetch(`${API_URL}?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load colleges");
        }
        setCollegesList(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to connect to the server.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    const timer = setTimeout(fetchColleges, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, location, course, minFee, maxFee]);

  return (
    <main className="dashboard">
      <div className="page-heading">
        <div>
          <p className="eyebrow">COLLEGE DIRECTORY</p>
          <h1>Explore Colleges</h1>
          <p>Discover courses and compare college fees.</p>
        </div>
        <span className="result-count">{collegesList.length} colleges</span>
      </div>

      <section className="filters">
        <div className="filter-field search-field">
          <label htmlFor="search">Search college name</label>
          <select
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          >
            <option value="">All colleges</option>
            {allCollegeNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="location">Location</label>
          <select id="location" value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">All locations</option>
            {["Hyderabad", "Bangalore", "Chennai", "Pune", "Vizag", "Delhi", "Mumbai"].map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="course">Course</label>
          <select id="course" value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="">All courses</option>
            {["Computer Science", "Electronics", "MBA", "MBBS", "Design", "Mechanical", "Fine Arts", "Law", "Diploma", "B.Ed"].map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="minFee">Minimum fee (₹)</label>
          <input
            id="minFee"
            type="number"
            placeholder="e.g. 50000"
            value={minFee}
            onChange={(e) => setMinFee(e.target.value)}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="maxFee">Maximum fee (₹)</label>
          <input
            id="maxFee"
            type="number"
            placeholder="e.g. 150000"
            value={maxFee}
            onChange={(e) => setMaxFee(e.target.value)}
          />
        </div>

        <button
          className="clear-button"
          onClick={() => { setSearch(""); setLocation(""); setCourse(""); setMinFee(""); setMaxFee(""); }}
        >
          Clear filters
        </button>
      </section>

      {loading && <p className="message">Loading colleges...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && collegesList.length === 0 && (
        <p className="message">No colleges match your filters.</p>
      )}

      {!loading && !error && collegesList.length > 0 && (
        <section className="college-grid">
          {collegesList.map((college) => (
            <article className="college-card" key={college._id || college.name}>
              <div className="college-icon">🎓</div>
              <span className="course-tag">{college.course}</span>
              <h2>{college.name}</h2>
              <p className="location-text">📍 {college.location}</p>
              <div className="fee-row">
                <span>Annual fee</span>
                <strong>₹{college.fee.toLocaleString("en-IN")}</strong>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

function Reviews() {
  return (
    <section className="placeholder">
      <h1>Reviews Page Coming Soon</h1>
      <p>We're working on this page. Please check back later.</p>
    </section>
  );
}

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLoginSubmit(e) {
    e.preventDefault();
    navigate("/colleges");
  }

  return (
    <div className="login-container">
      <div className="logout-notice">
        You have been logged out. Please sign in again.
      </div>
      
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Sign in to your Aspire Colleges account</p>
        
        <form onSubmit={handleLoginSubmit}>
          <div className="login-form-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-submit-button">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/colleges" element={<Colleges />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/logout" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <footer className="footer">© 2026 Aspire Colleges · Find your next opportunity.</footer>
    </BrowserRouter>
  );
}