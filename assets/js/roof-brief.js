(() => {
  'use strict';
  const form = document.querySelector('[data-contact-form]');
  const fieldset = document.querySelector('#roof-project-preferences');
  if (!form || !fieldset) return;
  const option = fieldset.querySelector('[data-roof-option]');
  const message = form.querySelector('[name="message"]');
  const button = fieldset.querySelector('[data-add-roof-brief]');
  const status = fieldset.querySelector('[data-roof-brief-status]');
  let dirty = false;
  const requested = new URLSearchParams(window.location.search).get('product');
  if ([...option.options].some(item => item.value === requested)) {
    option.value = requested;
    const support = form.querySelector('[name="helpType"]');
    if (support && !support.value) support.value = 'Outdoor System / Component';
  }
  function brief() {
    const choice = option.value ? option.selectedOptions[0].textContent : 'To be discussed';
    const text = selector => fieldset.querySelector(selector).value.trim() || 'To be confirmed';
    return [
      '[PLMR ROOF PREFERENCES]',
      'Roof option: ' + choice,
      'Moving / fixed roof sections: ' + text('[data-roof-sections]'),
      'Dimensions and units: ' + text('[data-roof-dimensions]'),
      'Mounting condition: ' + text('[data-roof-mounting]'),
      'Side enclosure needs: ' + text('[data-roof-sides]'),
      'Configuration and interfaces: project review requested.',
      '[/PLMR ROOF PREFERENCES]'
    ].join('\n');
  }
  function addPreferences() {
    const previous = message.value.replace(/\[PLMR ROOF PREFERENCES\][\s\S]*?\[\/PLMR ROOF PREFERENCES\]\s*/g, '').trim();
    const next = brief() + (previous ? '\n\n' + previous : '');
    if (next.length > message.maxLength) {
      status.textContent = 'The combined message is too long. Shorten your message or preferences and try again.';
      return false;
    }
    message.value = next;
    message.dispatchEvent(new Event('input', {bubbles: true}));
    status.textContent = 'Roof preferences added to the message below. You can edit them before sending.';
    return true;
  }
  button.addEventListener('click', () => {
    if (addPreferences()) { dirty = false; message.focus(); }
  });
  // A product link creates an editable starting brief; it does not submit the enquiry.
  if (option.value && !message.value.trim()) addPreferences();
  fieldset.addEventListener('input', event => {
    if (event.target === button) return;
    dirty = true;
    status.textContent = 'Preferences changed. Add them to your message when you are ready.';
  });
  // Capture before the existing form handler, so later choices reach the same message/email flow.
  form.addEventListener('submit', event => {
    if (dirty && !addPreferences()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      message.focus();
    } else {
      dirty = false;
    }
  }, true);
})();
