import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Link2, Copy, ExternalLink, Zap, Globe,
  CheckCircle2, AlertCircle, RefreshCw
} from "lucide-react";
import "./App.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/urls`,
  timeout: 10000
});

export default function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState("");

  async function fetchUrls() {
    setError("");
    try {
      const response = await api.get("/");
      setUrls(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Cannot reach the backend. Check that the API server is running."
      );
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    fetchUrls();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!originalUrl.trim()) {
      setError("Please enter a URL.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/", {
        originalUrl: originalUrl.trim()
      });
      setMessage("Your short link has been created.");
      setOriginalUrl("");
      await fetchUrls();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to create the short URL."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(shortUrl, id) {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(""), 1800);
    } catch {
      setError("Copy failed. Please copy the link manually.");
    }
  }

  return (
    <div className="app-shell">
      <header className="navbar">
        <a className="brand" href="/" aria-label="QuickLink home">
          <span className="brand-mark"><Link2 size={23} /></span>
          <span>QuickLink</span>
        </a>
        <span className="nav-caption">Simple URL Shortener</span>
      </header>

      <main className="content">
        <section className="hero">
          <div className="eyebrow"><Zap size={14} /> MAKE LINKS SIMPLER</div>
          <h1>Short links.<br /><span>Easy sharing.</span></h1>
          <p className="hero-copy">
            Paste a long URL and create a short link you can share anywhere.
          </p>

          <form className="shorten-form" onSubmit={handleSubmit}>
            <label className="url-input">
              <Globe size={20} />
              <input
                type="url"
                value={originalUrl}
                onChange={(event) => setOriginalUrl(event.target.value)}
                placeholder="https://example.com/your/very/long/link"
                aria-label="Original URL"
                required
              />
            </label>
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Shorten URL"}
              <Zap size={17} />
            </button>
          </form>

          {message && (
            <div className="notice success"><CheckCircle2 size={17} />{message}</div>
          )}
          {error && (
            <div className="notice error"><AlertCircle size={17} />{error}</div>
          )}
        </section>

        <section className="links-section">
          <div className="section-title">
            <div>
              <h2>Your links</h2>
              <p>Short links created with QuickLink.</p>
            </div>
            <div className="link-count">{urls.length} {urls.length === 1 ? "link" : "links"}</div>
          </div>

          <div className="links-card">
            <div className="table-heading">
              <span>ORIGINAL URL</span>
              <span>SHORT URL</span>
              <span>CLICKS</span>
              <span>ACTIONS</span>
            </div>

            {fetching ? (
              <div className="empty-state"><RefreshCw className="spin" />Loading links...</div>
            ) : urls.length === 0 ? (
              <div className="empty-state">
                <Link2 size={34} />
                <h3>No links yet</h3>
                <p>Create your first short link using the form above.</p>
              </div>
            ) : (
              urls.map((url) => (
                <div className="url-row" key={url.id}>
                  <div className="original-cell" title={url.originalUrl}>
                    <Globe size={16} />
                    <span>{url.originalUrl}</span>
                  </div>
                  <a className="short-cell" href={url.shortUrl} target="_blank" rel="noreferrer">
                    {url.shortUrl}
                  </a>
                  <span className="click-cell">{url.clicks}</span>
                  <div className="actions">
                    <button
                      type="button"
                      className="icon-button"
                      title="Copy short URL"
                      aria-label="Copy short URL"
                      onClick={() => handleCopy(url.shortUrl, url.id)}
                    >
                      {copiedId === url.id ? <CheckCircle2 size={17} /> : <Copy size={17} />}
                    </button>
                    <a
                      className="icon-button"
                      href={url.shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="Open short URL"
                      aria-label="Open short URL"
                    >
                      <ExternalLink size={17} />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <footer>Built with React, Node.js, Express.js and MongoDB</footer>
      </main>
    </div>
  );
}
