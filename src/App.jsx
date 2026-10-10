import { useState } from "react";
import collegeData from "./colleges.json";

import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
  Navigate,
} from "react-router-dom";

import "./App.css";

// NAVBAR
function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        Aspire<span>Colleges</span>
      </NavLink>

      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/colleges">Colleges</NavLink>
        <NavLink to="/reviews">Reviews</NavLink>

        <button
          className="logout-button"
          onClick={() => navigate("/login")}
        >
          Logout
        </button>
      </nav>
    </header>
  );
}

// HOME PAGE
function Home() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <p className="eyebrow">YOUR FUTURE STARTS HERE</p>

      <h1>Find the right college for your future.</h1>

      <p>
        Explore colleges, compare courses, and find options that fit your
        budget.
      </p>

      <button onClick={() => navigate("/colleges")}>
        Explore Colleges →
      </button>
    </section>
  );
}

// COLLEGES PAGE
function Colleges() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [course, setCourse] = useState("");
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");

  // Get unique college names from JSON
  const allCollegeNames = [
    ...new Set(collegeData.map((college) => college.name)),
  ];

  // Get unique locations from JSON
  const allLocations = [
    ...new Set(collegeData.map((college) => college.location)),
  ];

  // Get unique courses from JSON
  const allCourses = [
    ...new Set(collegeData.map((college) => college.course)),
  ];

  // Filter colleges using JSON data
  const filteredColleges = collegeData.filter((college) => {
    const matchesSearch = college.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesLocation =
      location === "" || college.location === location;

    const matchesCourse =
      course === "" || college.course === course;

    const matchesMinFee =
      minFee === "" || Number(college.fee) >= Number(minFee);

    const matchesMaxFee =
      maxFee === "" || Number(college.fee) <= Number(maxFee);

    return (
      matchesSearch &&
      matchesLocation &&
      matchesCourse &&
      matchesMinFee &&
      matchesMaxFee
    );
  });

  // Clear all filters
  function clearFilters() {
    setSearch("");
    setLocation("");
    setCourse("");
    setMinFee("");
    setMaxFee("");
  }

  return (
    <main className="dashboard">
      {/* PAGE HEADING */}
      <div className="page-heading">
        <div>
          <p className="eyebrow">COLLEGE DIRECTORY</p>

          <h1>Explore Colleges</h1>

          <p>Discover courses and compare college fees.</p>
        </div>

        <span className="result-count">
          {filteredColleges.length} colleges
        </span>
      </div>

      {/* FILTERS */}
      <section className="filters">
        {/* SEARCH */}
        <div className="filter-field search-field">
          <label htmlFor="search">Search college name</label>

          <input
            id="search"
            type="text"
            list="college-names"
            placeholder="Enter college name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <datalist id="college-names">
            {allCollegeNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>

        {/* LOCATION */}
        <div className="filter-field">
          <label htmlFor="location">Location</label>

          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">All locations</option>

            {allLocations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* COURSE */}
        <div className="filter-field">
          <label htmlFor="course">Course</label>

          <select
            id="course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          >
            <option value="">All courses</option>

            {allCourses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* MINIMUM FEE */}
        <div className="filter-field">
          <label htmlFor="minFee">Minimum fee (₹)</label>

          <input
            id="minFee"
            type="number"
            min="0"
            placeholder="e.g. 50000"
            value={minFee}
            onChange={(e) => setMinFee(e.target.value)}
          />
        </div>

        {/* MAXIMUM FEE */}
        <div className="filter-field">
          <label htmlFor="maxFee">Maximum fee (₹)</label>

          <input
            id="maxFee"
            type="number"
            min="0"
            placeholder="e.g. 150000"
            value={maxFee}
            onChange={(e) => setMaxFee(e.target.value)}
          />
        </div>

        {/* CLEAR FILTERS */}
        <button
          className="clear-button"
          onClick={clearFilters}
        >
          Clear filters
        </button>
      </section>

      {/* NO RESULTS */}
      {filteredColleges.length === 0 && (
        <p className="message">
          No colleges match your filters.
        </p>
      )}

      {/* COLLEGE CARDS */}
      {filteredColleges.length > 0 && (
        <section className="college-grid">
          {filteredColleges.map((college) => (
            <article
              className="college-card"
              key={college.id || college._id || college.name}
            >
              <div className="college-icon">🎓</div>

              <span className="course-tag">
                {college.course}
              </span>

              <h2>{college.name}</h2>

              <p className="location-text">
                📍 {college.location}
              </p>

              <div className="fee-row">
                <span>Annual fee</span>

                <strong>
                  ₹{Number(college.fee).toLocaleString("en-IN")}
                </strong>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

// REVIEWS PAGE
function Reviews() {
  return (
    <section className="placeholder">
      <h1>Reviews Page Coming Soon</h1>

      <p>
        We're working on this page. Please check back later.
      </p>
    </section>
  );
}

// LOGIN PAGE
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="login-submit-button"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

// MAIN APP
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/colleges" element={<Colleges />} />

        <Route path="/reviews" element={<Reviews />} />

        <Route
          path="/logout"
          element={<Navigate to="/login" replace />}
        />

        <Route path="/login" element={<Login />} />

        <Route path="*" element={<Home />} />
      </Routes>

      <footer className="footer">
        © 2026 Aspire Colleges · Find your next opportunity.
      </footer>
    </BrowserRouter>
  );
}