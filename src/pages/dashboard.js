import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";
import "./dashboard.css";
import { toast } from "react-toastify";
const API = process.env.REACT_APP_BACKEND_BASEURL;
const Dashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState({
    company_name: "",
    role: "",
    source: "",
    interviewMode: "",
    difficulty: "",
    topicsAsked: "",
    selectionProcedure: "",
    codingDetails: "",
    preparation: "",
    mistakes: "",
    advice: "",
    tips: "",

    fullName: "",
    collegeName: "",
    degree: "",
    passoutYear: "",
    placedYear: "",
    selectionRounds: [{ roundType: "", roundMode: "", description: "" }],
    resources: [""],
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const updateRound = (i, field, value) => {
    const rounds = [...form.selectionRounds];
    rounds[i][field] = value;
    setForm({ ...form, selectionRounds: rounds });
  };

  const addRound = () =>
    setForm({
      ...form,
      selectionRounds: [
        ...form.selectionRounds,
        { roundType: "", roundMode: "", description: "" },
      ],
    });

  const updateResource = (i, value) => {
    const res = [...form.resources];
    res[i] = value;
    setForm({ ...form, resources: res });
  };

  const addResource = () =>
    setForm({ ...form, resources: [...form.resources, ""] });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API}/api/auth/create_posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    toast("Post created");
    navigate("/myposts");
  };

  return (
    <form className="dashboard-form" onSubmit={handleSubmit}>
      <h2>Candidate Info</h2>
      <input name="fullName" placeholder="Full Name" onChange={handleChange} />
      <input
        name="collegeName"
        placeholder="College Name"
        onChange={handleChange}
      />
      <input
        name="degree"
        placeholder="Degree / Dept"
        onChange={handleChange}
      />
      <input
        name="passoutYear"
        placeholder="Passout Year"
        onChange={handleChange}
      />
      <input
        name="placedYear"
        placeholder="Placed Year"
        onChange={handleChange}
      />

      <h2>Company & Interview</h2>
      <input
        name="company_name"
        placeholder="Company"
        onChange={handleChange}
        required
      />
      <input name="role" placeholder="Role" onChange={handleChange} required />
      <input name="source" placeholder="Source" onChange={handleChange} />
      <select name="interviewMode" onChange={handleChange}>
        <option value="">Mode</option>
        <option>Online</option>
        <option>Offline</option>
        <option>Hybrid</option>
      </select>
      <select name="difficulty" onChange={handleChange}>
        <option value="">Difficulty</option>
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>

      <textarea
        name="topicsAsked"
        placeholder="Topics Asked"
        onChange={handleChange}
      />
      <textarea
        name="selectionProcedure"
        placeholder="Old Selection Procedure (Text)"
        onChange={handleChange}
      />
      <textarea
        name="codingDetails"
        placeholder="Coding Details"
        onChange={handleChange}
      />
      <textarea
        name="preparation"
        placeholder="Preparation"
        onChange={handleChange}
      />
      <textarea
        name="mistakes"
        placeholder="Mistakes"
        onChange={handleChange}
      />
      <textarea name="tips" placeholder="Tips" onChange={handleChange} />
      <textarea name="advice" placeholder="Advice" onChange={handleChange} />

      <h2>Selection Rounds</h2>
      {form.selectionRounds.map((r, i) => (
        <div key={i}>
          <input
            placeholder="Round Type"
            onChange={(e) => updateRound(i, "roundType", e.target.value)}
          />
          <select onChange={(e) => updateRound(i, "roundMode", e.target.value)}>
            <option value="">Mode</option>
            <option>Online</option>
            <option>Offline</option>
            <option>Hybrid</option>
          </select>
          <textarea
            placeholder="Description"
            onChange={(e) => updateRound(i, "description", e.target.value)}
          />
        </div>
      ))}
      <button type="button" onClick={addRound}>
        + Add Round
      </button>

      <h2>Resources</h2>
      {form.resources.map((r, i) => (
        <input
          key={i}
          placeholder="Resource DETAILS"
          onChange={(e) => updateResource(i, e.target.value)}
        />
      ))}
      <button type="button" onClick={addResource}>
        + Add Resource
      </button>

      <button type="submit">Submit</button>
    </form>
  );
};

export default Dashboard;
