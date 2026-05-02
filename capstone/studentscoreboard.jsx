import { useState, useEffect, useRef } from "react";

const INITIAL_STUDENTS = [
  { id: 1, name: "Eleanor Voss",   score: 88 },
  { id: 2, name: "Marcus Tran",    score: 34 },
  { id: 3, name: "Priya Mehta",    score: 72 },
  { id: 4, name: "James Okafor",   score: 55 },
  { id: 5, name: "Sofia Reinholt", score: 19 },
  { id: 6, name: "Liam Nakamura",  score: 91 },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0a0c10;
    --surface:   #111418;
    --surface2:  #181c23;
    --border:    #252b36;
    --gold:      #f5c842;
    --gold-dim:  #b8942a;
    --pass:      #22c97a;
    --pass-bg:   rgba(34,201,122,0.1);
    --fail:      #f04f4f;
    --fail-bg:   rgba(240,79,79,0.1);
    --text:      #e8eaf0;
    --muted:     #5a6278;
    --accent:    #3d8ef5;
  }

  .sb-root {
    font-family: 'Outfit', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    padding: 0 0 60px;
  }

  /* ── HEADER ── */
  .sb-header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72px;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .sb-header-left { display: flex; align-items: center; gap: 14px; }
  .sb-logo {
    width: 38px; height: 38px;
    background: var(--gold);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px; color: #0a0c10;
    flex-shrink: 0;
  }
  .sb-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px;
    letter-spacing: 2px;
    color: var(--text);
  }
  .sb-term {
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-top: 2px;
  }
  .sb-pass-threshold {
    font-size: 12px;
    color: var(--muted);
    background: var(--surface2);
    border: 1px solid var(--border);
    padding: 6px 14px;
    border-radius: 20px;
  }
  .sb-pass-threshold span { color: var(--gold); font-weight: 600; }

  /* ── STATS ── */
  .sb-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--border);
    border-bottom: 1px solid var(--border);
  }
  .sb-stat {
    background: var(--surface);
    padding: 20px 28px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .sb-stat-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 36px;
    line-height: 1;
    color: var(--text);
  }
  .sb-stat-val.gold { color: var(--gold); }
  .sb-stat-val.pass { color: var(--pass); }
  .sb-stat-val.fail { color: var(--fail); }
  .sb-stat-lbl {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--muted);
    font-weight: 500;
  }

  /* ── MAIN ── */
  .sb-main {
    max-width: 900px;
    margin: 0 auto;
    padding: 36px 24px 0;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  /* ── TABLE CARD ── */
  .sb-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
  }
  .sb-card-header {
    padding: 18px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .sb-card-title {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--muted);
    font-weight: 600;
  }
  .sb-count-badge {
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--gold);
    font-size: 11px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 12px;
    letter-spacing: 0.5px;
  }

  /* ── TABLE ── */
  table { width: 100%; border-collapse: collapse; }
  thead tr { background: var(--surface2); }
  thead th {
    padding: 11px 16px;
    text-align: left;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--muted);
    font-weight: 600;
  }
  tbody tr {
    border-top: 1px solid var(--border);
    transition: background 0.15s;
  }
  tbody tr:hover { background: var(--surface2); }
  td { padding: 13px 16px; vertical-align: middle; }

  .rank-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    color: var(--muted);
    width: 32px;
    text-align: center;
    display: block;
  }
  .student-name-cell { font-weight: 500; font-size: 15px; }

  .score-pill {
    display: inline-block;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    min-width: 52px;
    text-align: center;
    letter-spacing: 1px;
  }
  .score-pill.high { color: var(--pass); }
  .score-pill.mid  { color: var(--gold); }
  .score-pill.low  { color: var(--fail); }

  /* Score bar */
  .score-bar-wrap {
    width: 100px;
    height: 4px;
    background: var(--border);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 4px;
  }
  .score-bar-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.4s cubic-bezier(.4,0,.2,1);
  }
  .score-bar-fill.high { background: var(--pass); }
  .score-bar-fill.mid  { background: var(--gold); }
  .score-bar-fill.low  { background: var(--fail); }

  /* Inline score input */
  .score-edit-input {
    width: 72px;
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: 7px;
    color: var(--text);
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding: 6px 10px;
    text-align: center;
    transition: border-color 0.2s, box-shadow 0.2s;
    -moz-appearance: textfield;
  }
  .score-edit-input::-webkit-inner-spin-button,
  .score-edit-input::-webkit-outer-spin-button { -webkit-appearance: none; }
  .score-edit-input:focus {
    outline: none;
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(245,200,66,0.15);
  }

  /* Status badge */
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .status-badge.pass { background: var(--pass-bg); color: var(--pass); border: 1px solid rgba(34,201,122,0.25); }
  .status-badge.fail { background: var(--fail-bg); color: var(--fail); border: 1px solid rgba(240,79,79,0.25); }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

  /* Delete btn */
  .delete-btn {
    background: none;
    border: none;
    color: var(--muted);
    cursor: pointer;
    padding: 5px;
    border-radius: 5px;
    font-size: 15px;
    transition: color 0.2s, background 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .delete-btn:hover { color: var(--fail); background: var(--fail-bg); }

  /* Empty state */
  .empty-state {
    padding: 56px 24px;
    text-align: center;
    color: var(--muted);
    font-size: 14px;
  }
  .empty-icon { font-size: 36px; display: block; margin-bottom: 12px; }

  /* ── ADD FORM CARD ── */
  .sb-form-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-top: 2px solid var(--gold);
    border-radius: 14px;
    overflow: hidden;
  }
  .sb-form-body {
    padding: 20px 24px;
    display: grid;
    grid-template-columns: 1fr 160px auto;
    gap: 14px;
    align-items: end;
  }
  .form-field { display: flex; flex-direction: column; gap: 6px; }
  .form-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--muted);
    font-weight: 600;
  }
  .form-input {
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    padding: 10px 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
    -moz-appearance: textfield;
  }
  .form-input::-webkit-inner-spin-button,
  .form-input::-webkit-outer-spin-button { -webkit-appearance: none; }
  .form-input::placeholder { color: var(--muted); }
  .form-input:focus {
    outline: none;
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(245,200,66,0.12);
  }
  .form-input.err { border-color: var(--fail); }

  .err-msg {
    font-size: 11px;
    color: var(--fail);
    margin-top: 2px;
  }

  .add-btn {
    background: var(--gold);
    color: #0a0c10;
    border: none;
    border-radius: 8px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 700;
    padding: 10px 22px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 7px;
    transition: background 0.2s, transform 0.15s;
    white-space: nowrap;
    height: 42px;
  }
  .add-btn:hover { background: var(--gold-dim); transform: translateY(-1px); }
  .add-btn:active { transform: translateY(0); }

  /* Success toast */
  .toast {
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: var(--pass);
    color: #fff;
    font-weight: 600;
    font-size: 13px;
    padding: 10px 22px;
    border-radius: 30px;
    opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
    pointer-events: none;
    z-index: 999;
  }
  .toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  /* Responsive */
  @media (max-width: 680px) {
    .sb-stats { grid-template-columns: repeat(2, 1fr); }
    .sb-form-body { grid-template-columns: 1fr; }
    .sb-header { padding: 0 16px; }
    .sb-main { padding: 20px 12px 0; }
    .score-bar-wrap { display: none; }
    .sb-title { font-size: 20px; }
  }
`;

function getScoreClass(score) {
  const n = Number(score);
  if (n >= 70) return "high";
  if (n >= 40) return "mid";
  return "low";
}

export default function StudentScoreboard() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [form, setForm] = useState({ name: "", score: "" });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(false);
  const toastTimer = useRef(null);

  // Inject styles
  useEffect(() => {
    const tag = document.createElement("style");
    tag.textContent = css;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);

  // Stats
  const total   = students.length;
  const passing = students.filter(s => Number(s.score) >= 40).length;
  const failing = total - passing;
  const avg     = total
    ? Math.round(students.reduce((s, st) => s + (Number(st.score) || 0), 0) / total)
    : 0;

  // Update individual score
  const handleScoreChange = (id, val) => {
    setStudents(prev =>
      prev.map(s => s.id === id ? { ...s, score: val === "" ? "" : Number(val) } : s)
    );
  };

  // Delete
  const handleDelete = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  // Form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name required";
    if (form.score === "") errs.score = "Score required";
    else if (Number(form.score) < 0 || Number(form.score) > 100) errs.score = "0–100 only";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStudents(prev => [...prev, { id: Date.now(), name: form.name.trim(), score: Number(form.score) }]);
    setForm({ name: "", score: "" });
    setErrors({});
    clearTimeout(toastTimer.current);
    setToast(true);
    toastTimer.current = setTimeout(() => setToast(false), 2200);
  };

  return (
    <div className="sb-root">
      {/* Header */}
      <header className="sb-header">
        <div className="sb-header-left">
          <div className="sb-logo">SB</div>
          <div>
            <div className="sb-title">Scoreboard</div>
            <div className="sb-term">Spring Term · 2025</div>
          </div>
        </div>
        <div className="sb-pass-threshold">Pass threshold: <span>≥ 40 pts</span></div>
      </header>

      {/* Stats */}
      <div className="sb-stats">
        <div className="sb-stat">
          <span className="sb-stat-val gold">{total}</span>
          <span className="sb-stat-lbl">Students</span>
        </div>
        <div className="sb-stat">
          <span className="sb-stat-val pass">{passing}</span>
          <span className="sb-stat-lbl">Passing</span>
        </div>
        <div className="sb-stat">
          <span className="sb-stat-val fail">{failing}</span>
          <span className="sb-stat-lbl">Failing</span>
        </div>
        <div className="sb-stat">
          <span className="sb-stat-val">{avg}<span style={{fontSize:18,color:"var(--muted)"}}>pts</span></span>
          <span className="sb-stat-lbl">Class Average</span>
        </div>
      </div>

      <div className="sb-main">
        {/* Table */}
        <div className="sb-card">
          <div className="sb-card-header">
            <span className="sb-card-title">Class Roster</span>
            <span className="sb-count-badge">{total} enrolled</span>
          </div>
          {students.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              No students yet — add one below!
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th style={{width:44}}>#</th>
                  <th>Student</th>
                  <th>Score</th>
                  <th>Edit</th>
                  <th>Status</th>
                  <th style={{width:40}}></th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => {
                  const cls   = getScoreClass(s.score);
                  const isPassing = Number(s.score) >= 40;
                  return (
                    <tr key={s.id}>
                      <td><span className="rank-num">{i + 1}</span></td>
                      <td><span className="student-name-cell">{s.name}</span></td>
                      <td>
                        <span className={`score-pill ${cls}`}>
                          {s.score === "" ? "—" : s.score}
                        </span>
                        <div className="score-bar-wrap">
                          <div
                            className={`score-bar-fill ${cls}`}
                            style={{ width: `${Math.min(100, Math.max(0, Number(s.score) || 0))}%` }}
                          />
                        </div>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="score-edit-input"
                          value={s.score}
                          min={0} max={100}
                          onChange={e => handleScoreChange(s.id, e.target.value)}
                          aria-label={`Edit score for ${s.name}`}
                        />
                      </td>
                      <td>
                        <span className={`status-badge ${isPassing ? "pass" : "fail"}`}>
                          <span className="status-dot" />
                          {isPassing ? "Pass" : "Fail"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(s.id)}
                          aria-label={`Remove ${s.name}`}
                        >✕</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Add Form */}
        <div className="sb-form-card">
          <div className="sb-card-header">
            <span className="sb-card-title">Add New Student</span>
          </div>
          <div className="sb-form-body">
            <div className="form-field">
              <label className="form-label">Student Name</label>
              <input
                className={`form-input ${errors.name ? "err" : ""}`}
                type="text"
                name="name"
                placeholder="e.g. Jane Doe"
                value={form.name}
                onChange={handleFormChange}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                autoComplete="off"
              />
              {errors.name && <span className="err-msg">{errors.name}</span>}
            </div>
            <div className="form-field">
              <label className="form-label">Score (0–100)</label>
              <input
                className={`form-input ${errors.score ? "err" : ""}`}
                type="number"
                name="score"
                placeholder="e.g. 75"
                value={form.score}
                min={0} max={100}
                onChange={handleFormChange}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
              />
              {errors.score && <span className="err-msg">{errors.score}</span>}
            </div>
            <button className="add-btn" onClick={handleSubmit}>
              <span style={{fontSize:18,lineHeight:1}}>+</span> Add Student
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className={`toast ${toast ? "show" : ""}`}>✓ Student added!</div>
    </div>
  );
}