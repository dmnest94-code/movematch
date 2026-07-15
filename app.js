const builder = document.getElementById("builder");
const form = document.getElementById("moveForm");
const steps = [...document.querySelectorAll(".builder-step")];
const nextButton = document.getElementById("nextButton");
const backButton = document.getElementById("backButton");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const formError = document.getElementById("formError");
const panel = document.querySelector(".builder__panel");

let currentStep = 1;
const totalSteps = 6;

document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll(".js-open-builder").forEach(button => {
  button.addEventListener("click", () => {
    builder.classList.add("is-open");
    builder.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    showStep(1);
  });
});

document.getElementById("closeBuilder").addEventListener("click", closeBuilder);
builder.addEventListener("click", event => {
  if (event.target === builder) closeBuilder();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeBuilder();
});

function closeBuilder() {
  builder.classList.remove("is-open");
  builder.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}

function showStep(stepNumber) {
  currentStep = stepNumber;
  steps.forEach(step => step.classList.toggle("is-active", Number(step.dataset.step) === stepNumber));
  progressBar.style.width = `${(stepNumber / totalSteps) * 100}%`;
  progressText.textContent = `Step ${stepNumber} of ${totalSteps}`;
  backButton.style.visibility = stepNumber === 1 ? "hidden" : "visible";
  nextButton.textContent = stepNumber === totalSteps ? "Submit My Plan →" : "Continue →";
  formError.textContent = "";
  if (stepNumber === totalSteps) renderRecommendation();
  panel.scrollTop = 0;
}

function checkedValues(selector) {
  return [...document.querySelectorAll(`${selector}:checked`)].map(input => input.value);
}

function validateCurrentStep() {
  const step = steps.find(item => Number(item.dataset.step) === currentStep);
  const required = [...step.querySelectorAll("[required]")];

  if ([1, 2, 3].includes(currentStep)) {
    const groupName = required[0]?.name;
    if (!step.querySelector(`input[name="${groupName}"]:checked`)) {
      formError.textContent = "Please choose an option to continue.";
      return false;
    }
  }

  if ([5, 6].includes(currentStep)) {
    for (const input of required) {
      if (!input.value || !input.checkValidity()) {
        input.focus();
        formError.textContent = "Please complete the required fields.";
        return false;
      }
    }
  }

  return true;
}

function toggleConditional(toggleId, wrapId) {
  const toggle = document.getElementById(toggleId);
  const wrap = document.getElementById(wrapId);
  const input = wrap.querySelector("input");

  function update() {
    wrap.classList.toggle("is-visible", toggle.checked);
    input.required = toggle.checked;
    if (!toggle.checked) input.value = "";
  }

  toggle.addEventListener("change", update);
  update();
}

toggleConditional("otherSpecialToggle", "otherSpecialWrap");
toggleConditional("heavyItemToggle", "heavyItemWrap");
toggleConditional("otherHelpToggle", "otherHelpWrap");

function formValue(name) {
  return form.elements[name]?.value || "";
}

function buildData() {
  return {
    priority: formValue("priority"),
    moveType: formValue("move-type"),
    packing: formValue("packing"),
    specialItems: checkedValues("[data-special]"),
    additionalHelp: checkedValues("[data-additional]"),
    access: formValue("access")
  };
}

function renderRecommendation() {
  const data = buildData();
  const result = window.MoveMatchEngine.recommend(data);

  document.getElementById("resultStyle").textContent = result.style;
  document.getElementById("resultCrew").textContent = result.crew;
  document.getElementById("resultConsultation").textContent = result.consultation;
  document.getElementById("resultPacking").textContent = data.packing;
  document.getElementById("resultSpecialItems").textContent = data.specialItems.join(", ") || "None selected";
  document.getElementById("resultAdditionalHelp").textContent = data.additionalHelp.join(", ") || "None selected";
  document.getElementById("resultReason").textContent = result.reason;

  document.getElementById("specialItemsField").value = data.specialItems.join(", ") || "None selected";
  document.getElementById("additionalHelpField").value = data.additionalHelp.join(", ") || "None selected";
  document.getElementById("recommendedStyleField").value = result.style;
  document.getElementById("recommendedCrewField").value = result.crew;
  document.getElementById("recommendedConsultationField").value = result.consultation;
  document.getElementById("recommendationReasonField").value = result.reason;
}

nextButton.addEventListener("click", () => {
  if (!validateCurrentStep()) return;

  if (currentStep < totalSteps) {
    showStep(currentStep + 1);
    return;
  }

  renderRecommendation();
  nextButton.disabled = true;
  nextButton.textContent = "Sending…";
  form.submit();
});

backButton.addEventListener("click", () => {
  if (currentStep > 1) showStep(currentStep - 1);
});
