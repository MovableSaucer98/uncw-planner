import { useState } from "react";
import axios from "axios";

function App() {
  const [programId, setProgramId] = useState("BS-CS-2025");
  const [earnedCredits, setEarnedCredits] = useState(15);
  const [completed, setCompleted] = useState(["ENG 101"]);
  const [target, setTarget] = useState(15);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_BASE;

  const requestPlan = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/plan`, {
        program_id: programId,
        earned_credits: Number(earnedCredits),
        completed_courses: completed,
        target_credits_per_term: Number(target),
        terms_to_plan: 6
      });
      setPlan(res.data.plan);
    } catch {
      alert("Oops! Could not get a plan. Is the backend running and is VITE_API_BASE set?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>UNCW Planner (MVP)</h1>
      <p>This React app calls your FastAPI backend on Render.</p>

      <div style={{ display: "grid", gap: 12 }}>
        <label>Program ID
          <input value={programId} onChange={e => setProgramId(e.target.value)} />
        </label>

        <label>Earned Credits
          <input
            type="number"
            value={earnedCredits}
            onChange={e => setEarnedCredits(e.target.value)}
          />
        </label>

        <label>Target Credits/Term
          <input
            type="number"
            value={target}
            onChange={e => setTarget(e.target.value)}
          />
        </label>

        <label>Completed Courses (comma-separated)
          <input
            value={completed.join(", ")}
            onChange={e =>
              setCompleted(
                e.target.value
                  .split(",")
                  .map(s => s.trim())
                  .filter(Boolean)
              )
            }
          />
        </label>

        <button onClick={requestPlan} disabled={loading}>
          {loading ? "Planning..." : "Create Plan"}
        </button>
      </div>

      {plan && (
        <div style={{ marginTop: 24 }}>
          <h2>Your Multi-Term Plan</h2>
          {plan.map((t, idx) => (
            <div key={idx} style={{ padding: 12, border: "1px solid #ddd", marginBottom: 12 }}>
              <strong>Term {t.term_index} — {t.credits} credits</strong>
              <ul>
                {t.planned_courses.map((c, i) => (
                  <li key={i}>
                    {c.course_id} — {c.risk.toUpperCase()} risk (P={c.offer_probability})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;