import React, { useState } from "react";

const API_BASE = "https://delta-production-4386.up.railway.app";

export default function App() {
  const [problem, setProblem] = useState("");
  const [goal, setGoal] = useState("");
  const [pain, setPain] = useState("");
  const [today, setToday] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const [chosenAction, setChosenAction] = useState("");
  const [resultScore, setResultScore] = useState(8);
  const [wouldRepeat, setWouldRepeat] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");

  async function handlePredict() {
    setLoading(true);
    setSaveMessage("");
    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          problem,
          goal,
          pain,
          today
        })
      });

      const data = await res.json();
      setResponse(data);
      if (data.actions && data.actions.length > 0) {
        setChosenAction(data.actions[0]);
      }
    } catch (error) {
      setResponse({ error: "Erro ao conectar com a API." });
    }
    setLoading(false);
  }

  async function handleSaveResult() {
    if (!response || !chosenAction) return;

    try {
      const res = await fetch(`${API_BASE}/result`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          problem,
          category: response.category || "geral",
          chosen_action: chosenAction,
          result_score: Number(resultScore),
          would_repeat: Boolean(wouldRepeat)
        })
      });

      const data = await res.json();
      if (data.ok) {
        setSaveMessage("Resultado salvo com sucesso.");
      } else {
        setSaveMessage("Falha ao salvar.");
      }
    } catch (error) {
      setSaveMessage("Erro ao salvar resultado.");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Motor de Ação</h1>
        <p style={styles.subtitle}>Converse com seu motor pela web</p>

        <div style={styles.card}>
          <label style={styles.label}>Problema</label>
          <textarea style={styles.input} value={problem} onChange={(e) => setProblem(e.target.value)} />

          <label style={styles.label}>Objetivo</label>
          <textarea style={styles.input} value={goal} onChange={(e) => setGoal(e.target.value)} />

          <label style={styles.label}>Trava</label>
          <textarea style={styles.input} value={pain} onChange={(e) => setPain(e.target.value)} />

          <label style={styles.label}>Passo hoje</label>
          <textarea style={styles.input} value={today} onChange={(e) => setToday(e.target.value)} />

          <button style={styles.button} onClick={handlePredict} disabled={loading}>
            {loading ? "Analisando..." : "Enviar"}
          </button>
        </div>

        {response && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Resposta</h2>

            {response.error ? (
              <p>{response.error}</p>
            ) : (
              <>
                <p><strong>Categoria:</strong> {response.category}</p>
                <p><strong>Confiança:</strong> {response.confidence}</p>

                <div>
                  <strong>Ações:</strong>
                  <ol>
                    {(response.actions || []).map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ol>
                </div>

                <label style={styles.label}>Ação escolhida</label>
                <input
                  style={styles.textInput}
                  value={chosenAction}
                  onChange={(e) => setChosenAction(e.target.value)}
                />

                <label style={styles.label}>Nota (0 a 10)</label>
                <input
                  style={styles.textInput}
                  type="number"
                  value={resultScore}
                  onChange={(e) => setResultScore(e.target.value)}
                />

                <label style={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    checked={wouldRepeat}
                    onChange={(e) => setWouldRepeat(e.target.checked)}
                  />
                  Repetiria essa ação
                </label>

                <button style={styles.buttonSecondary} onClick={handleSaveResult}>
                  Salvar resultado
                </button>

                {saveMessage && <p style={styles.saveMessage}>{saveMessage}</p>}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f4f5",
    padding: "20px",
    fontFamily: "Arial, sans-serif"
  },
  container: {
    maxWidth: "700px",
    margin: "0 auto"
  },
  title: {
    fontSize: "32px",
    marginBottom: "6px"
  },
  subtitle: {
    color: "#555",
    marginBottom: "20px"
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
  },
  sectionTitle: {
    marginBottom: "12px"
  },
  label: {
    display: "block",
    marginTop: "12px",
    marginBottom: "6px",
    fontWeight: "bold"
  },
  input: {
    width: "100%",
    minHeight: "70px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    padding: "10px",
    fontSize: "14px",
    boxSizing: "border-box"
  },
  textInput: {
    width: "100%",
    borderRadius: "10px",
    border: "1px solid #ccc",
    padding: "10px",
    fontSize: "14px",
    boxSizing: "border-box"
  },
  button: {
    marginTop: "16px",
    width: "100%",
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "12px",
    fontSize: "16px"
  },
  buttonSecondary: {
    marginTop: "16px",
    width: "100%",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "12px",
    fontSize: "16px"
  },
  checkboxRow: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    marginTop: "12px"
  },
  saveMessage: {
    marginTop: "12px",
    color: "green"
  }
};
