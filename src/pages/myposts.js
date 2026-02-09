import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";
import "./myposts.css";
const API = process.env.REACT_APP_BACKEND_BASEURL;
const Myposts = () => {
  const [posts, setPosts] = useState([]);
  const { token, isloggedin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isloggedin) {
      navigate("/login");
      return;
    }

    const fetchMyPosts = async () => {
      try {
        const res = await fetch(`${API}/api/auth/view_my_posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch my posts");

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        alert("Error fetching my posts");
      }
    };

    fetchMyPosts();
  }, [token, isloggedin, navigate]);

  const handleDelete = async (postId) => {
    try {
      await fetch(`${API}/api/auth/myposts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts((prev) => prev.filter((p) => p._id !== postId));
      alert("Post deleted successfully");
    } catch (error) {
      alert("Delete failed");
    }
  };

  return (
    <div className="my-posts">
      <h1>My Interview Experiences</h1>

      <button
        className="create-post-btn"
        onClick={() => navigate("/dashboard")}
      >
        Create New Post
      </button>

      {posts.length === 0 ? (
        <p className="empty-text">You haven’t added any posts yet.</p>
      ) : (
        <div className="my-posts-grid">
          {posts.map((p) => (
            <div className="my-post-card" key={p._id}>
              {p.fullName && (
                <>
                  <div className="candidate-info">
                    <h3>
                      Company : {p.company_name}{" "}
                      <span className="role-text"> Role : {p.role}</span>
                    </h3>

                    <p>
                      <b>Name:</b> {p.fullName}
                    </p>
                    <p>
                      <b>Degree:</b> {p.degree}
                    </p>
                    <p>
                      <b>College Name:</b> {p.collegeName}
                    </p>
                    <p>
                      <b>Passout Year:</b> {p.passoutYear}
                    </p>
                    <p>
                      <b>Placed Year:</b> {p.placedYear}
                    </p>
                  </div>
                </>
              )}

              {p.source && (
                <p>
                  <b>Source:</b> {p.source}
                </p>
              )}

              {p.interviewMode && (
                <p>
                  <b>Interview Mode:</b> {p.interviewMode}
                </p>
              )}

              {p.difficulty && (
                <p>
                  <b>Difficulty:</b> {p.difficulty}
                </p>
              )}

              {p.topicsAsked && (
                <p>
                  <b>Topics Asked:</b> {p.topicsAsked}
                </p>
              )}

              {p.selectionProcedure && (
                <p>
                  <b>Selection Procedure (Old):</b> {p.selectionProcedure}
                </p>
              )}

              {p.codingDetails && (
                <p>
                  <b>Coding Details:</b> {p.codingDetails}
                </p>
              )}

              {p.preparation && (
                <p>
                  <b>Preparation:</b> {p.preparation}
                </p>
              )}

              {p.mistakes && (
                <p>
                  <b>Mistakes:</b> {p.mistakes}
                </p>
              )}

              {p.tips && (
                <p>
                  <b>Tips:</b> {p.tips}
                </p>
              )}

              {p.advice && (
                <p>
                  <b>Advice:</b> {p.advice}
                </p>
              )}
              {p.selectionRounds?.length > 0 && (
                <>
                  <h4>Structured Selection Rounds</h4>
                  {p.selectionRounds.map((round, index) => (
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
              {p.resources?.length > 0 && (
                <>
                  <h4>Resources</h4>
                  <div className="resources-container">
                    {p.resources.map((r, i) => (
                      <div key={i} className="resource-box">
                        Resource {i + 1}
                        <br />
                        {r.details}
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="post-actions">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit-posts/${p._id}`)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Myposts;
