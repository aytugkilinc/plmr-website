(() => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    const mobile = window.matchMedia('(max-width: 1180px)');
    const closeMenu = (restoreFocus = false) => {
      body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (restoreFocus) toggle.focus();
    };
    toggle.addEventListener('click', () => {
      if (body.classList.contains('menu-open')) {
        closeMenu(true);
        return;
      }
      if (!mobile.matches) return;
      body.classList.add('menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      menu.querySelector('a')?.focus();
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && body.classList.contains('menu-open')) {
        event.preventDefault();
        closeMenu(true);
      }
    });
    document.addEventListener('click', event => {
      if (body.classList.contains('menu-open') && header && !header.contains(event.target)) closeMenu();
    });
    document.addEventListener('focusin', event => {
      if (body.classList.contains('menu-open') && header && !header.contains(event.target)) closeMenu();
    });
    mobile.addEventListener('change', event => {
      if (!event.matches) closeMenu();
    });
    window.addEventListener('pageshow', () => closeMenu());
  }

  document.querySelectorAll('[data-year]').forEach(element => {
    element.textContent = new Date().getFullYear();
  });

  const brief = document.querySelector('[data-project-brief]');
  const copyButton = document.querySelector('[data-copy-brief]');
  const copyStatus = document.querySelector('[data-copy-status]');
  if (brief && copyButton && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    copyButton.hidden = false;
    copyButton.addEventListener('click', async () => {
      if (copyButton.disabled) return;
      copyButton.disabled = true;
      try {
        await navigator.clipboard.writeText(brief.value);
        if (copyStatus) copyStatus.textContent = 'Brief copied. Paste it into your email and add your details. Send it from your email service.';
      } catch {
        brief.focus();
        brief.select();
        if (copyStatus) copyStatus.textContent = 'Automatic copying is unavailable. The brief is selected; copy it manually or use Download Brief.';
      } finally {
        copyButton.disabled = false;
      }
    });
  }

  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  // Only map known service routes to values also accepted by the Worker.
  const inquiryRoutes = {
    engineering: 'Engineering / Technical Review',
    drawings: 'Drawing & Coordination',
    sourcing: 'Technical Sourcing',
    components: 'Outdoor System / Component',
    software: 'PLMR Software / Implementation',
    collaboration: 'Technical Collaboration'
  };
  const requestedSupport = new URLSearchParams(window.location.search).get('support');
  const helpSelect = form.querySelector('[name="helpType"]');
  if (helpSelect && Object.hasOwn(inquiryRoutes, requestedSupport)) {
    helpSelect.value = inquiryRoutes[requestedSupport];
  }

  const submitButton = form.querySelector('[data-contact-submit]');
  const status = form.querySelector('[data-contact-status]');
  const fallback = form.querySelector('[data-contact-fallback]');
  const fallbackLink = form.querySelector('[data-contact-email-fallback]');
  const imageInput = form.querySelector('[data-project-images]');
  const imageSummary = form.querySelector('[data-image-summary]');
  const MAX_IMAGE_COUNT = 5;
  const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

  const setStatus = (message, kind = '') => {
    if (!status) return;
    status.textContent = message;
    status.classList.remove('success', 'error');
    if (kind) status.classList.add(kind);
  };

  const selectedImages = () => Array.from(imageInput?.files || []);
  const validateImages = () => {
    const files = selectedImages();
    const total = files.reduce((sum, file) => sum + file.size, 0);
    if (files.length > MAX_IMAGE_COUNT) return `Choose no more than ${MAX_IMAGE_COUNT} images.`;
    if (total > MAX_IMAGE_BYTES) return 'The selected images are over the 4 MB total limit. Reduce them or share a project-file link instead.';
    const invalid = files.find(file => file.type && !file.type.startsWith('image/'));
    if (invalid) return `${invalid.name} is not recognized as an image.`;
    return '';
  };

  const updateImageSummary = () => {
    if (!imageSummary) return;
    const files = selectedImages();
    if (!files.length) {
      imageSummary.textContent = 'No images selected.';
      return;
    }
    const total = files.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024);
    imageSummary.textContent = `${files.length} image${files.length === 1 ? '' : 's'} selected · ${total.toFixed(2)} MB total`;
  };

  const value = name => String(new FormData(form).get(name) || '').trim();
  const buildEmailFallback = () => {
    const files = selectedImages();
    const lines = [
      'PLMR PROJECT ENQUIRY',
      '',
      `Name: ${value('name')}`,
      `Email: ${value('email')}`,
      `Company: ${value('company')}`,
      `Country: ${value('country')}`,
      `Type of support: ${value('helpType')}`,
      `Project location: ${value('projectLocation')}`,
      `Target timeline: ${value('timeline')}`,
      '',
      'Project file link(s):',
      value('fileLinks') || '(none provided)',
      '',
      'Message / requirement:',
      value('message'),
      '',
      files.length ? `Selected image filenames (attach these manually before sending): ${files.map(file => file.name).join(', ')}` : 'Selected images: none',
      '',
      'This email draft was prepared by the PLMR contact page because direct form delivery was unavailable.'
    ];
    const subjectPart = value('projectLocation') || value('company') || value('country') || 'project enquiry';
    const subject = `PLMR project enquiry - ${subjectPart}`.slice(0, 120);
    return `mailto:aytugkilinc@plmrsolutions.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  };

  const showFallback = message => {
    setStatus(message, 'error');
    if (fallbackLink) fallbackLink.href = buildEmailFallback();
    if (fallback) fallback.hidden = false;
  };

  imageInput?.addEventListener('change', () => {
    updateImageSummary();
    const error = validateImages();
    if (error) setStatus(error, 'error');
    else if (status?.classList.contains('error')) setStatus('');
  });
  updateImageSummary();

  if (submitButton) submitButton.disabled = false;

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (fallback) fallback.hidden = true;
    setStatus('');

    const imageError = validateImages();
    if (imageError) {
      setStatus(imageError, 'error');
      imageInput?.focus();
      return;
    }

    if (!form.reportValidity()) return;
    if (!submitButton || submitButton.disabled) return;

    submitButton.disabled = true;
    const originalLabel = submitButton.textContent;
    submitButton.textContent = 'Sending…';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      const contentType = response.headers.get('content-type') || '';
      const result = contentType.includes('application/json') ? await response.json() : null;

      if (response.ok && result?.success === true) {
        form.reset();
        updateImageSummary();
        setStatus('Project details sent. PLMR has received your enquiry.', 'success');
        return;
      }

      if (result?.code === 'ATTACHMENTS_TOO_LARGE' || response.status === 413) {
        setStatus('The selected images are too large for direct delivery. Reduce them or share them using the project-file link field. Nothing was sent.', 'error');
        return;
      }

      if (result?.code === 'INVALID_LINK') {
        setStatus('One of the project links is not a valid http/https link. Check the link field and try again. Nothing was sent.', 'error');
        return;
      }

      showFallback('Direct form delivery is not available right now. Nothing was sent. Your details are still here; you can continue with the prepared email draft.');
    } catch {
      showFallback('The connection to the form service failed. Nothing was sent. Your details are still here; you can continue with the prepared email draft.');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalLabel;
    }
  });
})();

