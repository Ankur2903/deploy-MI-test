// utils/expressionUtils.js

export function evalToNumber(expr) {
  if (expr === "" || expr === null || expr === undefined) return null;

  try {
    const raw = Function("return " + expr)(); // evaluate simple math
    const n = Number(raw);
    return Number.isFinite(n) ? n.toFixed(2) : null;
  } catch {
    return null;
  }
}

export function handleExpressionKeyDown(e, setter, currentValue) {
  if (e.key !== "Enter") return;

  const res = evalToNumber(currentValue);
  if (res === null) {
    alert("Invalid expression or result is not a number");
    return;
  }

  setter(res); // store numeric result
}
