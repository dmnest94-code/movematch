(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const config = window.MOVEMATCH_CONFIG || {};
  $('#year').textContent = String(new Date().getFullYear());
  const phone = $('[data-contact="phone"]');
  const email = $('[data-contact="email"]');
  if (config.phoneDisplay && /^\+?[\d ()-]{7,22}$/.test(config.phoneE164 || '')) {
    phone.textContent = config.phoneDisplay;
    phone.href = 'tel:' + config.phoneE164.replace(/[^+\d]/g, '');
    phone.hidden = false;
  }
  if (config.email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(config.email)) {
    email.textContent = config.email;
    email.href = 'mailto:' + config.email;
    email.hidden = false;
  }
  const modal = $('#modal');
  const wizard = $('.wizard');
  const form = $('#move-form');
  const stepEls = $$('.wizard-step', form);
  const nextBtn = $('#wizard-next');
  const submitBtn = $('#wizard-submit');
  const backBtn = $('#wizard-back');
  const status = $('#form-status');
  const progressFill = $('#progress-fill');
  const progressText = $('#progress-text');
  const moveType = () => $('input[name="move_type"]:checked', form)?.value || '';
  let currentStep = 1;
  let lastFocus = null;
  const utm = new URLSearchParams(location.search);
  $('#lead-source').value = utm.get('utm_source') || utm.get('source') || 'website';
  $('#lead-campaign').value = utm.get('utm_campaign') || 'organic';
  // No fixed rates or guaranteed crew sizes are calculated: these are intake categories.
  function resolveStyle() {
    if (moveType() === 'Office / Commercial') {
      return { style: 'Office / Commercial', consultation: 'On-site estimate only', reason: 'We will contact you to arrange an in-person walkthrough. No remote-only office estimates.' };
    }
    const p = $('input[name="priority"]:checked', form)?.value || '';
    const special = $('[name="special_items"]', form)?.value || '';
    let style = p === 'Budget / streamlined' ? 'Essential' : p === 'Premium / specialty' ? 'White Glove' : 'Protected';
    if (/Artwork|Piano|Several special/i.test(special)) style = 'White Glove';
    return {
      style,
      consultation: 'Review and confirm consultation',
      reason: style === 'Essential' ? 'A streamlined starting point. We will review the details before any quote.' :
        style === 'White Glove' ? 'A specialty-care starting point. Scope, provider and handling requirements need review.' :
        'A care-focused starting point. Protection options and scope will be reviewed.'
    };
  }
  function updateFlow() {
    const isOffice = moveType() === 'Office / Commercial';
    $$('[data-only]', form).forEach(group => {
      const enabled = group.dataset.only === (isOffice ? 'office' : 'residential');
      group.hidden = !enabled;
      $$('input,select,textarea', group).forEach(field => { field.disabled = !enabled; });
    });
    $('#step3-title').textContent = isOffice ? 'Let’s arrange a visit.' : 'What matters most?';
    $('#step3-intro').textContent = isOffice ? 'All office relocations start with an on-site estimate.' : 'Choose your priority, then add any special details.';
    const result = resolveStyle();
    $('#result-style').textContent = isOffice ? 'On-site office estimate' : result.style + ' move';
    $('#result-copy').textContent = result.reason;
    $('#final-intro').textContent = isOffice ? 'Share your information so we can follow up about an on-site walkthrough request.' : 'Share your information so we can review the moving details.';
    $('#recommended-style').value = result.style;
    $('#consultation-type').value = result.consultation;
  }
  function showStep(n) {
    currentStep = Math.min(4, Math.max(1, n));
    stepEls.forEach(step => { step.classList.toggle('active', Number(step.dataset.step) === currentStep); });
    updateFlow();
    progressFill.style.width = (currentStep * 25) + '%';
    progressText.textContent = `Step ${currentStep} of 4`;
    backBtn.hidden = currentStep === 1;
    nextBtn.hidden = currentStep === 4;
    submitBtn.hidden = currentStep !== 4;
    status.textContent = '';
    wizard.scrollTop = 0;
    const heading = $('.wizard-step.active h2', form);
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
  }
  function validateStep(number) {
    const step = stepEls[number - 1];
    const requiredInputs = $$('input[required],select[required],textarea[required]', step).filter(el => !el.disabled);
    const checkedNames = new Set();
    for (const field of requiredInputs) {
      if (field.type === 'radio') {
        if (checkedNames.has(field.name)) continue;
        checkedNames.add(field.name);
        if (!$(`input[name="${field.name}"]:checked`, form)) {
          status.textContent = 'Please choose an option to continue.';
          field.focus(); return false;
        }
      } else if (field.type === 'checkbox') {
        if (!field.checked) { status.textContent = 'Please confirm the checkbox to continue.'; field.focus(); return false; }
      } else if (!field.validity.valid || !field.value.trim()) {
        status.textContent = 'Please check the highlighted field.';
        field.reportValidity(); field.focus(); return false;
      }
    }
    status.textContent = '';
    return true;
  }
  const dateLocal = () => {
    // Local date rather than UTC to avoid disabling today for Pacific Time users.
    const d = new Date();
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
  };
  $$('input[type="date"]', form).forEach(el => { el.min = dateLocal(); });
  function openPlanner(type = 'residential', plan = '') {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    const radio = $(`input[name="move_type"][value="${type === 'office' ? 'Office / Commercial' : 'Residential'}"]`, form);
    radio.checked = true;
    if (plan) {
      const mapping = { Essential: 'Budget / streamlined', Protected: 'Extra care', 'White Glove': 'Premium / specialty' };
      const v = mapping[plan];
      const priority = $$('input[name="priority"]', form).find(x => x.value === v);
      if (priority) priority.checked = true;
    }
    showStep(type === 'office' || plan ? 2 : 1);
  }
  function closePlanner() {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastFocus?.focus) lastFocus.focus();
  }
  $$('[data-start]').forEach(el => el.addEventListener('click', () => openPlanner(el.dataset.start)));
  $$('[data-plan]').forEach(el => el.addEventListener('click', () => openPlanner('residential', el.dataset.plan)));
  $('#close-modal').addEventListener('click', closePlanner);
  modal.addEventListener('click', e => { if (e.target === modal) closePlanner(); });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') { closePlanner(); return; }
    if (e.key !== 'Tab') return;
    const focusables = $$('button:not([disabled]):not([hidden]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),a[href]', wizard)
      .filter(el => el.getClientRects().length > 0);
    if (!focusables.length) return;
    const first = focusables[0], last = focusables.at(-1);
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  $$('input[name="move_type"]', form).forEach(el => el.addEventListener('change', updateFlow));
  $$('input[name="priority"],select[name="special_items"]', form).forEach(el => el.addEventListener('change', updateFlow));
  backBtn.addEventListener('click', () => showStep(currentStep - 1));
  nextBtn.addEventListener('click', () => { if (validateStep(currentStep)) showStep(currentStep + 1); });
  form.addEventListener('submit', async e => {
    e.preventDefault();
    updateFlow();
    for (let n = 1; n <= 4; n++) {
      if (!validateStep(n)) { showStep(n); validateStep(n); return; }
    }
    // Static local previews cannot collect real leads: only a deployed Netlify site can.
    if (location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname)) {
      status.textContent = 'Preview only. Publish on Netlify before testing a real inquiry.';
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    status.textContent = '';
    try {
      // Preserve v0.3 Netlify/Zapier field names. The existing SMS automation
      // reads `customer-name`, `phone` and `move-type` from form submissions.
      // These are compatibility aliases; the v4 fields remain authoritative.
      form.querySelector('#legacy-customer-name').value = form.elements.namedItem('customer_name').value.trim();
      form.querySelector('#legacy-phone').value = form.elements.namedItem('customer_phone').value.trim();
      const isOffice = form.elements.namedItem('move_type').value === 'Office / Commercial';
      form.querySelector('#legacy-move-type').value = isOffice
        ? 'Office / Commercial Space'
        : form.elements.namedItem('home_size').value;
      const data = new FormData(form);
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      location.assign('/success.html');
    } catch (err) {
      status.textContent = 'Request not sent. Please retry or contact us using the links in the footer.';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send request ↗';
    }
  });
})();
