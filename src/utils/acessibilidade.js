// Ativa/desativa modo alto contraste
export function toggleHighContrast() {
  const active = document.body.classList.toggle("high-contrast");
  localStorage.setItem("high-contrast", active ? "true" : "false");
}

// Aumenta o tamanho da fonte geral
export function increaseFontSize() {
  const currentSize = parseFloat(localStorage.getItem("font-scale") || "1");
  const newSize = Math.min(currentSize + 0.1, 1.5);
  document.body.style.transform = `scale(${newSize})`;
  document.body.style.transformOrigin = "top left";
  localStorage.setItem("font-scale", newSize.toString());
}

// 🔽 Diminui o tamanho da fonte geral
export function decreaseFontSize() {
  const currentSize = parseFloat(localStorage.getItem("font-scale") || "1");
  const newSize = Math.max(currentSize - 0.1, 0.8);
  document.body.style.transform = `scale(${newSize})`;
  document.body.style.transformOrigin = "top left";
  localStorage.setItem("font-scale", newSize.toString());
}

// Simula leitor de tela com SpeechSynthesis (nativo do Chrome)
export function startScreenReader() {
  if (!window.speechSynthesis) {
    alert("Seu navegador não suporta leitura de tela.");
    return;
  }

  const text = document.body.innerText;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  utterance.rate = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

// Reaplica preferências ao carregar a página
export function applyAccessibilityPreferences() {
  if (localStorage.getItem("high-contrast") === "true") {
    document.body.classList.add("high-contrast");
  }

  const fontScale = parseFloat(localStorage.getItem("font-scale") || "1");
  document.body.style.transform = `scale(${fontScale})`;
  document.body.style.transformOrigin = "top left";
}
