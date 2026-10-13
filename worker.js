const CONTACT_TO = 'aytugkilinc@plmrsolutions.com';
const DEFAULT_FROM = 'website@plmr.solutions';
const MAX_IMAGE_COUNT = 5;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_REQUEST_BYTES = 5 * 1024 * 1024;
const ALLOWED_HELP = new Set([
  'Engineering / Technical Review',
  'Drawing & Coordination',
  'Technical Sourcing',
  'Outdoor System / Component',
  'PLMR Software / Implementation',
  'Technical Collaboration',
  'Aluminum / Building Materials',
  'Supplier Quality Control / Visit',
  'Not sure yet'
]);

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff'
  }
});

const clean = (value, max = 5000) => String(value ?? '').replace(/\u0000/g, '').trim().slice(0, max);
const escapeHtml = value => clean(value).replace(/[&<>"']/g, ch => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[ch]);
const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;

function parseLinks(raw) {
  const links = clean(raw, 2000).split(/\r?\n/).map(v => v.trim()).filter(Boolean);
  if (links.length > 8) throw new Error('INVALID_LINK');
  for (const link of links) {
    let parsed;
    try { parsed = new URL(link); } catch { throw new Error('INVALID_LINK'); }
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('INVALID_LINK');
  }
  return links;
}

function fileValues(form, name) {
  return form.getAll(name).filter(value => value && typeof value.arrayBuffer === 'function' && value.size > 0);
}

async function handleContact(request, env) {
  if (request.method !== 'POST') {
    return json({ success: false, code: 'METHOD_NOT_ALLOWED' }, 405);
  }

  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return json({ success: false, code: 'ORIGIN_REJECTED' }, 403);
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('multipart/form-data')) {
    return json({ success: false, code: 'UNSUPPORTED_MEDIA_TYPE' }, 415);
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength && contentLength > MAX_REQUEST_BYTES) {
    return json({ success: false, code: 'ATTACHMENTS_TOO_LARGE' }, 413);
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ success: false, code: 'INVALID_FORM' }, 400);
  }

  // Honeypot: appear successful to simple bots without sending anything.
  if (clean(form.get('website'), 200)) return json({ success: true, filtered: true });

  const name = clean(form.get('name'), 120);
  const email = clean(form.get('email'), 254);
  const company = clean(form.get('company'), 160);
  const country = clean(form.get('country'), 120);
  const helpType = clean(form.get('helpType'), 100);
  const projectLocation = clean(form.get('projectLocation'), 180);
  const timeline = clean(form.get('timeline'), 120);
  const message = clean(form.get('message'), 5000);
  const consent = clean(form.get('consent'), 10);

  if (!name || !validEmail(email) || !country || !ALLOWED_HELP.has(helpType) || !message || consent !== 'yes') {
    return json({ success: false, code: 'VALIDATION_ERROR' }, 400);
  }

  let links;
  try {
    links = parseLinks(form.get('fileLinks'));
  } catch {
    return json({ success: false, code: 'INVALID_LINK' }, 400);
  }

  const images = fileValues(form, 'images');
  if (images.length > MAX_IMAGE_COUNT) return json({ success: false, code: 'ATTACHMENTS_TOO_LARGE' }, 413);
  const totalImageBytes = images.reduce((sum, file) => sum + Number(file.size || 0), 0);
  if (totalImageBytes > MAX_IMAGE_BYTES) return json({ success: false, code: 'ATTACHMENTS_TOO_LARGE' }, 413);
  if (images.some(file => file.type && !file.type.startsWith('image/'))) {
    return json({ success: false, code: 'INVALID_ATTACHMENT' }, 400);
  }

  // Preview-safe behavior: without an Email binding, the front end will offer a mailto fallback.
  if (!env.EMAIL || typeof env.EMAIL.send !== 'function') {
    return json({ success: false, code: 'EMAIL_NOT_CONFIGURED', fallback: true }, 503);
  }

  const attachmentData = [];
  for (const file of images) {
    attachmentData.push({
      content: await file.arrayBuffer(),
      filename: clean(file.name, 180) || 'project-image',
      type: file.type || 'application/octet-stream',
      disposition: 'attachment'
    });
  }

  const linkText = links.length ? links.join('\n') : '(none provided)';
  const text = [
    'PLMR PROJECT ENQUIRY',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || '(not provided)'}`,
    `Country: ${country}`,
    `Type of support: ${helpType}`,
    `Project location: ${projectLocation || '(not provided)'}`,
    `Target timeline: ${timeline || '(not provided)'}`,
    '',
    'Project file link(s):',
    linkText,
    '',
    'Message / requirement:',
    message,
    '',
    `Reference images attached: ${images.length}`
  ].join('\n');

  const htmlLinks = links.length
    ? `<ul>${links.map(link => `<li><a href="${escapeHtml(link)}">${escapeHtml(link)}</a></li>`).join('')}</ul>`
    : '<p>(none provided)</p>';
  const html = `<!doctype html><html><body><h2>PLMR project enquiry</h2><table cellpadding="6" cellspacing="0" border="0"><tr><th align="left">Name</th><td>${escapeHtml(name)}</td></tr><tr><th align="left">Email</th><td>${escapeHtml(email)}</td></tr><tr><th align="left">Company</th><td>${escapeHtml(company || '(not provided)')}</td></tr><tr><th align="left">Country</th><td>${escapeHtml(country)}</td></tr><tr><th align="left">Type of support</th><td>${escapeHtml(helpType)}</td></tr><tr><th align="left">Project location</th><td>${escapeHtml(projectLocation || '(not provided)')}</td></tr><tr><th align="left">Target timeline</th><td>${escapeHtml(timeline || '(not provided)')}</td></tr></table><h3>Project file link(s)</h3>${htmlLinks}<h3>Message / requirement</h3><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p><p>Reference images attached: ${images.length}</p></body></html>`;

  const subjectPart = projectLocation || company || country || name;
  const subject = `PLMR project enquiry - ${subjectPart}`.slice(0, 140);
  const from = clean(env.CONTACT_FROM || DEFAULT_FROM, 254);

  try {
    const result = await env.EMAIL.send({
      to: CONTACT_TO,
      from,
      replyTo: email,
      subject,
      text,
      html,
      attachments: attachmentData
    });
    return json({ success: true, messageId: result?.messageId || null });
  } catch (error) {
    console.error('Contact email delivery failed', error?.code || '', error?.message || error);
    return json({ success: false, code: 'DELIVERY_FAILED', fallback: true }, 502);
  }
}

async function serveAsset(request, env) {
  const response = await env.ASSETS.fetch(request);
  if (response.status !== 404) return response;
  const notFound = await env.ASSETS.fetch(new Request(new URL('/404.html', request.url), request));
  return new Response(notFound.body, { status: 404, headers: notFound.headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact') return handleContact(request, env);
    return serveAsset(request, env);
  }
};

