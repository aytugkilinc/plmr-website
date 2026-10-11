(() => {
  'use strict';
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const support = form.querySelector('[name="helpType"]');
  const message = form.querySelector('[name="message"]');
  const status = form.querySelector('[data-contact-status]');
  const roofToggle = form.querySelector('[data-roof-toggle]');
  const groups = [...form.querySelectorAll('[data-support-details]')];
  const role = form.querySelector('[data-enquiry-role]');
  const stage = form.querySelector('[data-enquiry-stage]');
  if (!support || !message) return;

  const routes = {
    'Engineering / Technical Review': 'roof',
    'Drawing & Coordination': 'roof',
    'Outdoor System / Component': 'roof',
    'Not sure yet': 'roof',
    'Technical Sourcing': 'sourcing',
    'Aluminum / Building Materials': 'sourcing',
    'Supplier Quality Control / Visit': 'quality',
    'PLMR Software / Implementation': 'software',
    'Technical Collaboration': 'software'
  };
  const prompts = {
    roof: 'Describe the drawing, system or connection you need reviewed and the decision your team needs to make.',
    sourcing: 'Describe the product or material, destination and the supplier information you want to compare or clarify.',
    quality: 'Describe the order, current stage, target dispatch date and the items you want checked.',
    software: 'Describe your product family, current workflow and the outputs your team needs.'
  };
  const requestedRoof = new URLSearchParams(window.location.search).get('product');
  function updateGroups() {
    const active = routes[support.value];
    groups.forEach(group => {
      const enabled = group.dataset.supportDetails === active;
      if (group.dataset.supportDetails === 'roof' && roofToggle) {
        roofToggle.hidden = !enabled;
        group.disabled = !enabled;
        const selected = group.querySelector('[data-roof-option]')?.value;
        if (enabled && requestedRoof && selected === requestedRoof) roofToggle.open = true;
      } else {
        group.hidden = !enabled;
        group.disabled = !enabled;
      }
    });
    message.placeholder = prompts[active] || 'Describe the decision, technical issue or sourcing requirement and the output your team needs.';
  }
  const value = selector => form.querySelector(selector)?.value.trim() || '';
  function context() {
    const lines = [];
    if (role?.value) lines.push('Role: ' + role.value);
    if (stage?.value) lines.push('Project / order stage: ' + stage.value);
    const active = routes[support.value];
    const add = (label, selector) => { const input = value(selector); if (input) lines.push(label + ': ' + input); };
    if (active === 'quality') {
      add('Supplier / factory', '[data-quality-supplier]');
      add('Requested checks', '[data-quality-concern]');
    } else if (active === 'sourcing') {
      add('Product / material / supplier', '[data-sourcing-product]');
      add('Quantity / destination', '[data-sourcing-quantity]');
    } else if (active === 'software') {
      add('Product workflow', '[data-software-workflow]');
    }
    return lines.length ? '[PLMR ENQUIRY CONTEXT]\n' + lines.join('\n') + '\n[/PLMR ENQUIRY CONTEXT]' : '';
  }
  function mergeContext() {
    const previous = message.value.replace(/\[PLMR ENQUIRY CONTEXT\][\s\S]*?\[\/PLMR ENQUIRY CONTEXT\]\s*/g, '').trim();
    const addition = context();
    const next = addition ? addition + (previous ? '\n\n' + previous : '') : previous;
    if (next.length > message.maxLength) {
      if (status) {
        status.textContent = 'Your message and optional details exceed the message limit. Shorten them and try again. Nothing was sent.';
        status.classList.add('error');
      }
      return false;
    }
    message.value = next;
    return true;
  }
  support.addEventListener('change', updateGroups);
  form.addEventListener('reset', () => queueMicrotask(updateGroups));
  // Capture runs before the existing delivery handler and email fallback builder.
  form.addEventListener('submit', event => {
    if (!mergeContext()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      message.focus();
    }
  }, true);
  updateGroups();
})();
