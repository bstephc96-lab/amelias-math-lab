body {
  font-family: Arial, sans-serif;
  background: #eef6ff;
  margin: 0;
  padding: 20px;
}

.app {
  max-width: 700px;
  margin: auto;
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

h1 { text-align: center; color: #2563eb; }

.mode-buttons {
  display: grid;
  grid-template-columns: repeat(2,1fr);
  gap: 10px;
  margin-bottom: 20px;
}

button {
  padding: 12px;
  font-size: 16px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: #3b82f6;
  color: white;
}

button:hover { opacity: 0.9; }

#instruction {
  font-size: 18px;
  font-weight: bold;
  margin: 15px 0;
  text-align: center;
}

/* COLUMN MATH GRID */
.math-grid {
  font-family: "Courier New", monospace;
  font-size: 28px;
  text-align: right;
  line-height: 1.5;
}

.carry-row {
  color: red;
  height: 30px;
}

.active {
  background: #fff7a3;
}

input.math-input {
  width: 40px;
  text-align: center;
  font-size: 24px;
}
