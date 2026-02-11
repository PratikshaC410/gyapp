import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./auth";
import "./post.css";
import { toast } from "react-toastify";

const API = process.env.REACT_APP_BACKEND_BASEURL;

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [companySearch, setCompanySearch] = useState("");

  const { token, isloggedin } = useAuth();
  const navigate = useNavigate();
  const { postId } = useParams();

  useEffect(() => {
    if (!isloggedin) {
      navigate("/login");
      return;
    }

    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API}/api/auth/view_posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        toast("Error fetching posts");
      }
    };

    fetchPosts();
  }, [token, isloggedin, navigate]);

  useEffect(() => {
    if (postId && posts.length > 0) {
      const found = posts.find((p) => p._id === postId);
      if (found) {
        setSelectedPost(found);
        document.body.classList.add("modal-open");
      }
    }
  }, [postId, posts]);

  useEffect(() => {
    return () => {
      document.body.classList.remove("modal-open");
      setSelectedPost(null);
    };
  }, []);

  const openModal = (post) => {
    setSelectedPost(post);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setSelectedPost(null);
    document.body.classList.remove("modal-open");
  };

  const filteredPosts = posts.filter((p) =>
    p.company_name?.toLowerCase().includes(companySearch.toLowerCase()),
  );

  return (
    <>
      <div className="posts-div page-content">
        <h1>All Interview Experiences</h1>

        <input
          type="text"
          placeholder="Search by company name..."
          value={companySearch}
          onChange={(e) => setCompanySearch(e.target.value)}
          className="company-search"
        />

        {filteredPosts.length === 0 ? (
          <p className="empty-text">No posts found.</p>
        ) : (
          <div className="posts-grid">
            {filteredPosts.map((p) => (
              <div className="post-card" key={p._id}>
                <div className="post-header">
                  <h2>Company: {p.company_name}</h2>
                </div>

                {p.fullName && (
                  <p className="candidate-preview">
                    <b>Name :</b>{" "}
                    <span className="field-value">{p.fullName}</span> —{" "}
                    <span className="field-value">{p.degree}</span>
                  </p>
                )}

                <h4 className="meta-heading">Interview Details</h4>

                <div className="post-meta">
                  {p.interviewMode && (
                    <span>
                      Interview Mode:{" "}
                      <span className="field-value">{p.interviewMode}</span>
                    </span>
                  )}
                  {p.difficulty && (
                    <span>
                      Difficulty Level:{" "}
                      <span className="field-value">{p.difficulty}</span>
                    </span>
                  )}
                  {p.source && (
                    <span>
                      Source: <span className="field-value">{p.source}</span>
                    </span>
                  )}
                </div>

                {p.topicsAsked && (
                  <p>
                    <b>Topics Asked:</b>{" "}
                    <span className="field-value">{p.topicsAsked}</span>
                  </p>
                )}

                <button className="view-btn" onClick={() => openModal(p)}>
                  View More
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔥 Modal Section */}
      {selectedPost && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Company: {selectedPost.company_name}</h2>
            <h3>Role: {selectedPost.role}</h3>

            {selectedPost.fullName && (
              <div className="candidate-info">
                <h3>
                  <b>Name:</b>{" "}
                  <span className="field-value">{selectedPost.fullName}</span>
                </h3>

                <p>
                  <b>Degree:</b>{" "}
                  <span className="field-value">{selectedPost.degree}</span>
                </p>

                <p>
                  <b>College Name:</b>{" "}
                  <span className="field-value">
                    {selectedPost.collegeName}
                  </span>
                </p>

                <p>
                  <b>Passout Year:</b>{" "}
                  <span className="field-value">
                    {selectedPost.passoutYear}
                  </span>{" "}
                  | <b>Placed Year:</b>{" "}
                  <span className="field-value">{selectedPost.placedYear}</span>
                </p>
              </div>
            )}

            {selectedPost.interviewMode && (
              <p>
                <b>Interview Mode:</b>{" "}
                <span className="field-value">
                  {selectedPost.interviewMode}
                </span>
              </p>
            )}

            {selectedPost.difficulty && (
              <p>
                <b>Difficulty Level:</b>{" "}
                <span className="field-value">{selectedPost.difficulty}</span>
              </p>
            )}

            {selectedPost.source && (
              <p>
                <b>Source:</b>{" "}
                <span className="field-value">{selectedPost.source}</span>
              </p>
            )}

            {selectedPost.topicsAsked && (
              <p>
                <b>Topics Asked:</b>{" "}
                <span className="field-value">{selectedPost.topicsAsked}</span>
              </p>
            )}

            {selectedPost.selectionProcedure && (
              <p>
                <b>Selection Procedure:</b>{" "}
                <span className="field-value">
                  {selectedPost.selectionProcedure}
                </span>
              </p>
            )}

            {selectedPost.codingDetails && (
              <p>
                <b>Coding Details:</b>{" "}
                <span className="field-value">
                  {selectedPost.codingDetails}
                </span>
              </p>
            )}

            {selectedPost.preparation && (
              <p>
                <b>Preparation:</b>{" "}
                <span className="field-value">{selectedPost.preparation}</span>
              </p>
            )}

            {selectedPost.mistakes && (
              <p>
                <b>Mistakes:</b>{" "}
                <span className="field-value">{selectedPost.mistakes}</span>
              </p>
            )}

            {selectedPost.advice && (
              <p>
                <b>Advice:</b>{" "}
                <span className="field-value">{selectedPost.advice}</span>
              </p>
            )}

            {selectedPost.tips && (
              <p>
                <b>Tips:</b>{" "}
                <span className="field-value">{selectedPost.tips}</span>
              </p>
            )}

            {selectedPost.selectionRounds?.length > 0 && (
              <>
                <h4>Selection Rounds</h4>
                {selectedPost.selectionRounds.map((round, index) => (
                  <div key={index} className="round-box">
                    <p>
                      <b>Round {index + 1}:</b> {round.roundType} (
                      {round.roundMode})
                    </p>
                    <p>{round.description}</p>
                  </div>
                ))}
              </>
            )}

            {selectedPost.resources?.length > 0 && (
              <>
                <h4>Resources</h4>
                <div className="resources-container">
                  {selectedPost.resources.map((r, i) => (
                    <div key={i} className="resource-box">
                      Resource {i + 1}
                      <br />
                      {r.details}
                    </div>
                  ))}
                </div>
              </>
            )}

            <button className="close-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Posts;
