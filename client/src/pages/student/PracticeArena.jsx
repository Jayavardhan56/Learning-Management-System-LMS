import { useState, useRef, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { FaCode, FaPlay, FaSyncAlt, FaDesktop, FaTerminal } from "react-icons/fa";

const PracticeArena = () => {
  const [activeMode, setActiveMode] = useState("coding");
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("print('Hello World')");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const [html, setHtml] = useState("<h1>Hello World</h1>");
  const [css, setCss] = useState("h1 { color: blue; }");
  const [js, setJs] = useState("console.log('Web Dev Run')");
  const [srcDoc, setSrcDoc] = useState("");

  const languageTemplates = {
    python: "print('Hello from Python!')",
    java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}',
    c: '#include <stdio.h>\n\nint main() {\n    printf("Hello from C!\\n");\n    return 0;\n}',
    cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!" << std::endl;\n    return 0;\n}'
  };

  useEffect(() => {
    if (activeMode === 'coding') {
      setCode(languageTemplates[language]);
    }
  }, [language, activeMode]);

  useEffect(() => {
    if (activeMode === 'web') {
      const timeout = setTimeout(() => {
        setSrcDoc(`
          <html>
            <body>${html}</body>
            <style>${css}</style>
            <script>${js}</script>
          </html>
        `);
      }, 250);
      return () => clearTimeout(timeout);
    }
  }, [html, css, js, activeMode]);

  const runCode = async () => {
    setLoading(true);
    setOutput("Running...");
    try {
      const languageIds = { python: 71, java: 62, c: 50, cpp: 54 };
      const res = await fetch("https://ce.judge0.com/submissions?base64_encoded=false&wait=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_code: code,
          language_id: languageIds[language],
          stdin: ""
        })
      });
      const data = await res.json();
      if (data.stdout) {
        setOutput(data.stdout);
      } else if (data.stderr || data.compile_output) {
        setOutput(data.stderr || data.compile_output);
      } else if (data.status?.description) {
        setOutput(`Status: ${data.status.description}`);
      } else {
        setOutput("No output");
      }
    } catch (err) {
      setOutput("Execution Error: Public compiler instance is currently unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Practice Arena">
      <div style={{ padding: "30px", background: "#f8fafc", minHeight: "100vh" }}>

        {}
        <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
           <button
             onClick={() => setActiveMode("coding")}
             style={{
               padding: "12px 25px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: 800,
               background: activeMode === "coding" ? "#3B82F6" : "white",
               color: activeMode === "coding" ? "white" : "#64748B",
               display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
             }}
           >
             <FaTerminal /> Coding Compilers
           </button>
           <button
             onClick={() => setActiveMode("web")}
             style={{
               padding: "12px 25px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: 800,
               background: activeMode === "web" ? "#10B981" : "white",
               color: activeMode === "web" ? "white" : "#64748B",
               display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
             }}
           >
             <FaDesktop /> Web Development
           </button>
        </div>

        {activeMode === "coding" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "25px", height: "700px" }}>
             <div style={{ background: "#1E293B", borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "15px 25px", background: "#0F172A", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <select
                     value={language}
                     onChange={(e) => setLanguage(e.target.value)}
                     style={{ background: "#334155", color: "white", border: "none", padding: "8px 15px", borderRadius: "8px", fontWeight: 700, outline: "none" }}
                   >
                     <option value="python">Python</option>
                     <option value="java">Java</option>
                     <option value="c">C</option>
                     <option value="cpp">C++</option>
                   </select>
                   <button
                     onClick={runCode}
                     disabled={loading}
                     style={{ background: "#3B82F6", color: "white", border: "none", padding: "8px 20px", borderRadius: "8px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                   >
                     <FaPlay /> {loading ? "Running..." : "Run Code"}
                   </button>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{
                    flex: 1, width: "100%", background: "transparent", color: "#F8FAFC",
                    padding: "25px", fontFamily: "'Fira Code', monospace", fontSize: "1rem",
                    border: "none", outline: "none", resize: "none"
                  }}
                />
             </div>
             <div style={{ background: "white", borderRadius: "20px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "15px 25px", borderBottom: "1px solid #F1F5F9", fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: "10px" }}>
                   <FaCode /> Console Output
                </div>
                <pre style={{ flex: 1, padding: "25px", color: "#334155", fontWeight: 600, overflow: "auto", margin: 0, fontSize: "0.95rem" }}>
                  {output || "Output will appear here..."}
                </pre>
             </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", height: "700px" }}>
             <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div style={{ flex: 1, background: "white", borderRadius: "15px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
                   <div style={{ padding: "10px 20px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", fontWeight: 800, fontSize: "0.8rem", color: "#10B981" }}>HTML</div>
                   <textarea value={html} onChange={(e) => setHtml(e.target.value)} style={{ width: "100%", height: "calc(100% - 35px)", border: "none", padding: "15px", outline: "none", fontFamily: "monospace" }} />
                </div>
                <div style={{ flex: 1, background: "white", borderRadius: "15px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
                   <div style={{ padding: "10px 20px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", fontWeight: 800, fontSize: "0.8rem", color: "#3B82F6" }}>CSS</div>
                   <textarea value={css} onChange={(e) => setCss(e.target.value)} style={{ width: "100%", height: "calc(100% - 35px)", border: "none", padding: "15px", outline: "none", fontFamily: "monospace" }} />
                </div>
                <div style={{ flex: 1, background: "white", borderRadius: "15px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
                   <div style={{ padding: "10px 20px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", fontWeight: 800, fontSize: "0.8rem", color: "#F59E0B" }}>JS</div>
                   <textarea value={js} onChange={(e) => setJs(e.target.value)} style={{ width: "100%", height: "calc(100% - 35px)", border: "none", padding: "15px", outline: "none", fontFamily: "monospace" }} />
                </div>
             </div>
             <div style={{ background: "white", borderRadius: "20px", border: "1px solid #E2E8F0", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "15px 25px", borderBottom: "1px solid #F1F5F9", fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: "10px" }}>
                   <FaDesktop /> Live Preview
                </div>
                <iframe
                  srcDoc={srcDoc}
                  title="output"
                  sandbox="allow-scripts"
                  frameBorder="0"
                  width="100%"
                  height="100%"
                />
             </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default PracticeArena;
