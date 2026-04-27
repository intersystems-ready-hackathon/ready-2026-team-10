import styles from './ResultPanel.module.css';

// Minimal markdown renderer: handles ##/### headings, **bold**, - list items, --- hr
function renderMarkdown(md) {
  const lines = md.split('\n');
  const elements = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('### ')) {
      elements.push(<h3 key={key++}>{inlineFormat(line.slice(4))}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={key++}>{inlineFormat(line.slice(3))}</h2>);
    } else if (line.startsWith('---')) {
      elements.push(<hr key={key++} />);
    } else if (line.startsWith('- ')) {
      elements.push(<li key={key++}>{inlineFormat(line.slice(2))}</li>);
    } else if (line.match(/^\d+\. /)) {
      elements.push(<li key={key++}>{inlineFormat(line.replace(/^\d+\. /, ''))}</li>);
    } else if (line.trim() === '') {
      elements.push(<br key={key++} />);
    } else {
      elements.push(<p key={key++}>{inlineFormat(line)}</p>);
    }
  }

  return elements;
}

function inlineFormat(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function ResultPanel({ markdown }) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelIcon}>🔍</span>
        <h3>Analysis Results</h3>
      </div>
      <div className={styles.content}>{renderMarkdown(markdown)}</div>
    </div>
  );
}
