import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "./auth";
import "./home.css";
const API = process.env.REACT_APP_BACKEND_BASEURL;
const Home = () => {
  const [posts, setPosts] = useState([]);
  const { isloggedin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicPosts = async () => {
      try {
        const res = await fetch(`${API}/api/auth/public_posts`);
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch public posts");
      }
    };

    fetchPublicPosts();
  }, []);

  const handleReadMore = (postId) => {
    if (!isloggedin) {
      navigate("/login");
    } else {
      navigate(`/posts/${postId}`);
    }
  };
  const handleHome = () => {
    document.body.classList.remove("modal-open");
    navigate("/");
  };

  return (
    <div className="home-div">
      <div className="home-text">
        <h1>Welcome to GYAN</h1>
        <p>
          Explore interview experiences, placement tips, and resources to help
          you succeed in your career.
        </p>
      </div>

      <div className="home-posts">
        {posts.length === 0 ? (
          <p>No posts available</p>
        ) : (
          posts.map((post) => (
            <div className="post-card" key={post._id}>
              <h3>{post.company_name}</h3>

              {post.fullName && (
                <p>
                  <b>Name:</b> {post.fullName}
                </p>
              )}

              {post.passoutYear && post.placedYear && (
                <p>
                  <b>Passout year :</b> {post.passoutYear} |{" "}
                  <b>Placed Year :</b> {post.placedYear}
                </p>
              )}
              <button onClick={() => handleReadMore(post._id)}>
                Read More
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
