import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./auth";
import "./dashboard.css";
const API = process.env.REACT_APP_BACKEND_BASEURL;
const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState({
    /* ===== NEW: Candidate Info ===== */
    fullName: "",
    collegeName: "",
    degree: "",
    passoutYear: "",
    placedYear: "",

    /* ===== OLD + NEW: Company Info ===== */
    company_name: "",
    role: "",
    source: "",

    /* ===== OLD FIELDS (DO NOT REMOVE) ===== */
    interviewMode: "",
    difficulty: "",
    topicsAsked: "",
    selectionProcedure: "", // OLD string version
    codingDetails: "",
    preparation: "",
    mistakes: "",
    advice: "",
    tips: "",

    /* ===== NEW: Structured Rounds ===== */
    selectionRounds: [{ roundType: "", roundMode: "", description: "" }],

    /* ===== NEW: Resources ===== */
    resources: [""],
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API}/api/auth/myposts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch post");

        const data = await res.json();

        setForm({
          ...form,
          ...data,
          selectionRounds:
            data.selectionRounds?.length > 0
              ? data.selectionRounds
              : form.selectionRounds,
          resources:
            data.resources?.length > 0 ? data.resources : form.resources,
        });
      } catch (error) {
        alert("Error loading post");
      }
    };

    fetchPost();
    // eslint-disable-next-line
  }, [postId, token]);

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ===== ROUNDS ===== */
  const handleRoundChange = (index, field, value) => {
    const updated = [...form.selectionRounds];
    updated[index][field] = value;
    setForm({ ...form, selectionRounds: updated });
  };

  const addRound = () => {
    setForm({
      ...form,
      selectionRounds: [
        ...form.selectionRounds,
        { roundType: "", roundMode: "", description: "" },
      ],
    });
  };

  const removeRound = (index) => {
    setForm({
      ...form,
      selectionRounds: form.selectionRounds.filter((_, i) => i !== index),
    });
  };

  /* ===== RESOURCES ===== */
  const handleResourceChange = (index, value) => {
    const updated = [...form.resources];
    updated[index] = value;
    setForm({ ...form, resources: updated });
  };

  const addResource = () => {
    setForm({ ...form, resources: [...form.resources, ""] });
  };

  const removeResource = (index) => {
    setForm({
      ...form,
      resources: form.resources.filter((_, i) => i !== index),
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/api/auth/myposts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Update failed");

      alert("Post updated successfully");
      navigate("/myposts");
    } catch (error) {
      alert("Error updating post");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="dashboard-div">
      <h1 className="dashboard-title">Edit Interview Experience</h1>

      <form className="dashboard-form" onSubmit={handleSubmit}>
        {/* ===== CANDIDATE INFO ===== */}
        <h3>Candidate Information</h3>
        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
        />
        <input
          name="collegeName"
          placeholder="College Name"
          value={form.collegeName}
          onChange={handleChange}
        />
        <input
          name="degree"
          placeholder="Degree / Department"
          value={form.degree}
          onChange={handleChange}
        />
        <input
          type="number"
          name="passoutYear"
          placeholder="Passout Year"
          value={form.passoutYear}
          onChange={handleChange}
        />
        <input
          type="number"
          name="placedYear"
          placeholder="Placed Year"
          value={form.placedYear}
          onChange={handleChange}
        />

        {/* ===== COMPANY ===== */}
        <h3>Company & Role</h3>
        <input
          name="company_name"
          placeholder="Company Name"
          value={form.company_name}
          onChange={handleChange}
          required
        />
        <input
          name="role"
          placeholder="Role"
          value={form.role}
          onChange={handleChange}
          required
        />
        <input
          name="source"
          placeholder="Source"
          value={form.source}
          onChange={handleChange}
        />

        {/* ===== OLD FIELDS ===== */}
        <h3>Interview Details (Old)</h3>
        <input
          name="interviewMode"
          placeholder="Interview Mode"
          value={form.interviewMode}
          onChange={handleChange}
        />
        <input
          name="difficulty"
          placeholder="Difficulty"
          value={form.difficulty}
          onChange={handleChange}
        />
        <textarea
          name="topicsAsked"
          placeholder="Topics Asked"
          value={form.topicsAsked}
          onChange={handleChange}
        />
        <textarea
          name="selectionProcedure"
          placeholder="Selection Procedure (Old)"
          value={form.selectionProcedure}
          onChange={handleChange}
        />
        <textarea
          name="codingDetails"
          placeholder="Coding Details"
          value={form.codingDetails}
          onChange={handleChange}
        />
        <textarea
          name="preparation"
          placeholder="Preparation"
          value={form.preparation}
          onChange={handleChange}
        />
        <textarea
          name="mistakes"
          placeholder="Mistakes"
          value={form.mistakes}
          onChange={handleChange}
        />
        <textarea
          name="tips"
          placeholder="Tips"
          value={form.tips}
          onChange={handleChange}
        />

        {/* ===== NEW STRUCTURED ROUNDS ===== */}
        <h3>Structured Selection Rounds</h3>
        {form.selectionRounds.map((round, index) => (
          <div key={index} className="dashboard-box">
            <input
              placeholder="Round Type"
              value={round.roundType}
              onChange={(e) =>
                handleRoundChange(index, "roundType", e.target.value)
              }
            />
            <select
              value={round.roundMode}
              onChange={(e) =>
                handleRoundChange(index, "roundMode", e.target.value)
              }
            >
              <option value="">Mode</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            <textarea
              placeholder="Description"
              value={round.description}
              onChange={(e) =>
                handleRoundChange(index, "description", e.target.value)
              }
            />
            {form.selectionRounds.length > 1 && (
              <button type="button" onClick={() => removeRound(index)}>
                Remove Round
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addRound}>
          + Add Round
        </button>

        {/* ===== RESOURCES ===== */}
        <h3>Resources</h3>
        {form.resources.map((r, index) => (
          <div key={index}>
            <input
              placeholder="Resource Link"
              value={r}
              onChange={(e) => handleResourceChange(index, e.target.value)}
            />
            {form.resources.length > 1 && (
              <button type="button" onClick={() => removeResource(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addResource}>
          + Add Resource
        </button>

        {/* ===== ADVICE ===== */}
        <h3>Advice</h3>
        <textarea
          name="advice"
          placeholder="Advice for candidates"
          value={form.advice}
          onChange={handleChange}
        />

        <button className="dashboard-btn" type="submit">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditPost;
