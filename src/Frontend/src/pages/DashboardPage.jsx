import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadAndAnalyze, ANALYSIS_TYPES } from '../api/analysisApi';
import ResultPanel from '../components/ResultPanel';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [result, setResult] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef(null);

  function handleFileChange(e) {
    addFiles(Array.from(e.target.files));
  }

  function addFiles(incoming) {
    const csvFiles = incoming.filter((f) => f.name.endsWith('.csv'));
    if (csvFiles.length === 0) return;
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      return [...prev, ...csvFiles.filter((f) => !existing.has(f.name))];
    });
  }

  function removeFile(name) {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  }

  function toggleType(id) {
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  const canRun = files.length > 0 && selectedTypes.length > 0 && status !== 'loading';

  async function handleAnalyze() {
    if (!canRun) return;
    setStatus('loading');
    setResult('');
    setErrorMsg('');
    try {
      const data = await uploadAndAnalyze(files, selectedTypes);
      setResult(data.result);
      setStatus('done');
    } catch (err) {
      setErrorMsg('Analysis failed. Please try again.');
      setStatus('error');
    }
  }

  function handleReset() {
    setFiles([]);
    setSelectedTypes([]);
    setStatus('idle');
    setResult('');
    setErrorMsg('');
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerIcon}>📊</span>
          <span className={styles.headerTitle}>AI Business Analysis</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.welcomeText}>Welcome, {user.username}</span>
          <button className={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.pageTitle}>
          <h2>Statements & Cash Flow Analysis</h2>
          <p>Upload your CSV financial files and let the AI detect business anomalies.</p>
        </div>

        <div className={styles.uploadSection}>
          {/* File drop zone */}
          <div
            className={`${styles.dropzone} ${isDragging ? styles.dragOver : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              multiple
              hidden
              onChange={handleFileChange}
            />
            <div className={styles.dropzoneContent}>
              <span className={styles.dropIcon}>📂</span>
              <p>Drag & drop CSV files here, or <strong>click to browse</strong></p>
              <span className={styles.dropHint}>Only .csv files are accepted</span>
            </div>
          </div>

          {files.length > 0 && (
            <ul className={styles.fileList}>
              {files.map((f) => (
                <li key={f.name} className={styles.fileItem}>
                  <span className={styles.fileIcon}>📄</span>
                  <span className={styles.fileName}>{f.name}</span>
                  <span className={styles.fileSize}>
                    ({(f.size / 1024).toFixed(1)} KB)
                  </span>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFile(f.name)}
                    title="Remove"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Analysis type selector */}
          <div className={styles.typesSection}>
            <p className={styles.typesLabel}>Select analysis types</p>
            <div className={styles.typesList}>
              {ANALYSIS_TYPES.map((type) => {
                const checked = selectedTypes.includes(type.id);
                return (
                  <label
                    key={type.id}
                    className={`${styles.typeCard} ${checked ? styles.typeCardChecked : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleType(type.id)}
                      className={styles.typeCheckbox}
                    />
                    <div className={styles.typeCardBody}>
                      <span className={styles.typeCardLabel}>{type.label}</span>
                      <span className={styles.typeCardDesc}>{type.description}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              className={styles.analyzeBtn}
              onClick={handleAnalyze}
              disabled={!canRun}
            >
              {status === 'loading' ? (
                <>
                  <span className={styles.spinner} />
                  Analyzing...
                </>
              ) : (
                'Run Analysis'
              )}
            </button>
            {(files.length > 0 || selectedTypes.length > 0 || status !== 'idle') && (
              <button className={styles.resetBtn} onClick={handleReset}>
                Reset
              </button>
            )}
          </div>

          {files.length > 0 && selectedTypes.length === 0 && status === 'idle' && (
            <p className={styles.hintText}>Select at least one analysis type to continue.</p>
          )}
        </div>

        {status === 'loading' && (
          <div className={styles.loadingBanner}>
            <span className={styles.spinnerLg} />
            <span>
              Running {selectedTypes.length} analysis{selectedTypes.length > 1 ? ' types' : ''}
              {' '}on {files.length} file{files.length > 1 ? 's' : ''}. This may take a moment...
            </span>
          </div>
        )}

        {status === 'error' && (
          <div className={styles.errorBanner}>{errorMsg}</div>
        )}

        {status === 'done' && <ResultPanel markdown={result} />}
      </main>
    </div>
  );
}
