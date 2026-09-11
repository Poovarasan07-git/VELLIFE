import "./App.css";

function App() {
  const letters = "VELLIFE".split("");

  return (
    <div className="splash-page">
      <div className="logo">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="logo-letter"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}

export default App;