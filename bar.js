const MAX_VALUE = 1000;

let currentValue = MAX_VALUE;
let currentMode = "increase"; // "increase" | "decrease"

const currentValueEl = document.getElementById("currentValue");
const maxValueEl = document.getElementById("maxValue");
const statusBarFillEl = document.getElementById("statusBarFill");

const increaseBtn = document.getElementById("increaseBtn");
const decreaseBtn = document.getElementById("decreaseBtn");

const modalBackdrop = document.getElementById("modalBackdrop");
const valueInput = document.getElementById("valueInput");
const errorText = document.getElementById("errorText");
const confirmBtn = document.getElementById("confirmBtn");

maxValueEl.textContent = String(MAX_VALUE);

function updateUI() {
  currentValueEl.textContent = String(currentValue);

  const ratio = Math.max(0, Math.min(1, currentValue / MAX_VALUE || 0));
  statusBarFillEl.style.transform = `scaleX(${ratio})`;

  statusBarFillEl.classList.remove("low", "empty");
  if (ratio === 0) {
    statusBarFillEl.classList.add("empty");
  } else if (ratio <= 0.25) {
    statusBarFillEl.classList.add("low");
  }

  increaseBtn.disabled = currentValue >= MAX_VALUE;
  decreaseBtn.disabled = currentValue <= 0;
}

function openModal(mode) {
  currentMode = mode;
  resetModalState();
  modalBackdrop.classList.remove("hidden");
  setTimeout(() => {
    valueInput.focus();
    valueInput.select();
  }, 0);
}

function closeModal() {
  modalBackdrop.classList.add("hidden");
}

function resetModalState() {
  valueInput.value = "";
  valueInput.classList.remove("error");
  errorText.textContent = "";
  errorText.classList.add("hidden");
}

function showError(message) {
  errorText.textContent = message;
  errorText.classList.remove("hidden");
  valueInput.classList.add("error");
}

function parseAndApplyValue() {
  const raw = valueInput.value.trim();
  valueInput.classList.remove("error");
  errorText.classList.add("hidden");

  if (raw === "") {
    showError("Введите число.");
    return;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    showError("Введите целое число.");
    return;
  }

  if (parsed < 0) {
    showError("Число не может быть отрицательным.");
    return;
  }

  let nextValue =
    currentMode === "increase"
      ? currentValue + parsed
      : currentValue - parsed;

  if (nextValue > MAX_VALUE) nextValue = MAX_VALUE;
  if (nextValue < 0) nextValue = 0;

  currentValue = nextValue;
  updateUI();
  closeModal();
}

increaseBtn.addEventListener("click", () => openModal("increase"));
decreaseBtn.addEventListener("click", () => openModal("decrease"));

confirmBtn.addEventListener("click", () => {
  parseAndApplyValue();
});

modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) {
    closeModal();
  }
});

valueInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    parseAndApplyValue();
  } else if (event.key === "Escape") {
    event.preventDefault();
    closeModal();
  }
});

updateUI();

