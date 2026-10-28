/* Ghost Breach — navigation, accessible samples, and an honest local brief builder. */
(() => {
  'use strict';
  const EMAIL = 'ghostbreachh@gmail.com';
  const MAX_MAILTO_LENGTH = 1800;

  async function copyText(text, clipboard) {
    try {
      if (!clipboard || typeof clipboard.writeText !== 'function') return false;
      await clipboard.writeText(text);
      return true;
    } catch { return false; }
  }

  function buildBrief(values) {
    const clean = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, String(value).trim()]));
    const subject = `[Ghost Breach Inquiry] ${clean.service} — ${clean.name}`;
    const body = [
      `Name / Alias: ${clean.name}`, `Reply Email: ${clean.email}`,
      `Service: ${clean.service}`, `Timeline: ${clean.timeline || 'Flexible / Exploratory'}`,
      '', 'Project overview:', clean.message,
    ].join('\n');
    const text = `To: ${EMAIL}\nSubject: ${subject}\n\n${body}`;
    const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return { text, subject, body, mailto: mailto.length <= MAX_MAILTO_LENGTH ? mailto : null };
  }

  // Small pure helpers can also be exercised by Node without a browser runtime.
  if (typeof module !== 'undefined' && module.exports) module.exports = { copyText, buildBrief };
  if (typeof document === 'undefined') return;

  function init() {
    const byId = (id) => document.getElementById(id);
    if (byId('year')) byId('year').textContent = String(new Date().getFullYear());

    const menu = byId('menuToggle');
    const nav = byId('navLinks');
    function setMenu(open, restoreFocus = false) {
      if (!menu || !nav) return;
      nav.classList.toggle('open', open);
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      if (restoreFocus) menu.focus();
    }
    if (menu && nav) {
      menu.hidden = false;
      nav.classList.add('enhanced');
      menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
      nav.addEventListener('click', (event) => {
        if (event.target.closest('a')) setMenu(false);
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') setMenu(false, true);
      });
      document.addEventListener('pointerdown', (event) => {
        if (!nav.contains(event.target) && !menu.contains(event.target)) setMenu(false);
      });
      document.addEventListener('focusin', (event) => {
        if (!nav.contains(event.target) && !menu.contains(event.target)) setMenu(false);
      });
      window.matchMedia('(min-width: 901px)').addEventListener('change', () => setMenu(false));
    }

    const tabs = [...document.querySelectorAll('.deliv-tab')];
    function activateTab(tab, focus = false) {
      tabs.forEach((item) => {
        const selected = item === tab;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        const panel = byId(item.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      });
      if (focus) tab.focus();
    }
    if (tabs.length) {
      tabs[0].closest('[role="tablist"]').hidden = false;
      tabs.forEach((tab, index) => {
        const panel = byId(tab.getAttribute('aria-controls'));
        if (panel) {
          panel.setAttribute('role', 'tabpanel');
          panel.setAttribute('aria-labelledby', tab.id);
          panel.tabIndex = 0;
        }
        tab.addEventListener('click', () => activateTab(tab));
        tab.addEventListener('keydown', (event) => {
          const next = {
            ArrowRight: (index + 1) % tabs.length,
            ArrowLeft: (index - 1 + tabs.length) % tabs.length,
            Home: 0, End: tabs.length - 1,
          }[event.key];
          if (next !== undefined) {
            event.preventDefault();
            activateTab(tabs[next], true);
          }
        });
      });
      activateTab(tabs[0]);
    }
    document.querySelectorAll('[data-open-deliverable]').forEach((link) => {
      link.addEventListener('click', () => {
        const tab = tabs.find((item) => item.dataset.deliv === link.dataset.openDeliverable);
        if (tab) activateTab(tab);
      });
    });
    byId('printSamplesBtn')?.addEventListener('click', () => {
      document.body.classList.add('print-samples');
      window.print();
    });
    window.addEventListener('afterprint', () => document.body.classList.remove('print-samples'));

    // These are filters, not tabs: each is a normal toggle button in a named group.
    const filters = [...document.querySelectorAll('.stack-tab')];
    if (filters.length) {
      filters[0].parentElement.hidden = false;
      filters.forEach((button) => button.addEventListener('click', () => {
        const value = button.dataset.filter;
        filters.forEach((item) => {
          const active = item === button;
          item.classList.toggle('active', active);
          item.setAttribute('aria-pressed', String(active));
        });
        document.querySelectorAll('.stack-column').forEach((column) => {
          column.hidden = value !== 'all' && column.dataset.category !== value;
        });
        document.querySelector('.stack-pillars')?.classList.toggle('is-filtered', value !== 'all');
        if (byId('stackStatus')) byId('stackStatus').textContent = `Showing ${button.textContent.trim().toLowerCase()}.`;
      }));
    }

    const emailButton = byId('copyEmailBtn');
    const emailStatus = byId('copyEmailStatus');
    if (emailButton) {
      emailButton.hidden = false;
      emailButton.addEventListener('click', async () => {
        emailButton.disabled = true;
        const ok = await copyText(EMAIL, navigator.clipboard);
        if (emailStatus) emailStatus.textContent = ok ? 'Email address copied.' : 'Copy unavailable. Select the email address above and copy it manually.';
        emailButton.disabled = false;
      });
    }

    const form = byId('contactForm');
    if (!form) return;
    form.noValidate = true;
    byId('formControls').hidden = false;
    const fields = [...form.querySelectorAll('input, select, textarea')];
    const feedback = byId('formFeedback');
    const preview = byId('briefPreview');
    const textArea = byId('briefText');
    let currentBrief = null;

    function announce(message, error = false) {
      feedback.hidden = false;
      feedback.textContent = message;
      feedback.classList.toggle('is-error', error);
    }
    function validateField(field) {
      let message = '';
      if (field.required && !field.value.trim()) {
        message = { name: 'Enter your name or alias.', email: 'Enter your email address.', service: 'Choose a service.', message: 'Add a short project overview.' }[field.id] || 'Complete this field.';
      } else if (field.validity.typeMismatch) {
        message = 'Enter a valid email address, such as name@example.com.';
      } else if (!field.validity.valid || (field.maxLength > 0 && field.value.length > field.maxLength)) {
        message = 'Check this field and stay within the character limit.';
      }
      const error = byId(`${field.id}Error`);
      field.setAttribute('aria-invalid', String(Boolean(message)));
      if (error) { error.textContent = message; error.hidden = !message; }
      return !message;
    }
    function invalidateBrief() {
      currentBrief = null;
      preview.hidden = true;
      textArea.value = '';
      byId('emailDraftLink').removeAttribute('href');
      feedback.hidden = true;
    }
    fields.forEach((field) => {
      const changed = () => {
        invalidateBrief();
        if (field.getAttribute('aria-invalid') === 'true') validateField(field);
        if (byId('messageCount')) byId('messageCount').textContent = `${byId('message').value.length} / 5000`;
      };
      field.addEventListener('input', changed);
      field.addEventListener('change', changed);
    });

    document.querySelectorAll('[data-select-service]').forEach((link) => {
      link.addEventListener('click', () => {
        const service = byId('service');
        if ([...service.options].some((option) => option.value === link.dataset.selectService)) {
          service.value = link.dataset.selectService;
          invalidateBrief();
          validateField(service);
          announce(`Selected: ${service.value}. Add your details to prepare a brief.`);
        }
      });
    });

    function prepareBrief() {
      const invalid = fields.filter((field) => !validateField(field));
      if (invalid.length) {
        invalidateBrief();
        announce(`Please correct ${invalid.length === 1 ? 'the highlighted field' : `the ${invalid.length} highlighted fields`}.`, true);
        invalid[0].focus();
        return null;
      }
      currentBrief = buildBrief(Object.fromEntries(fields.map((field) => [field.name, field.value])));
      textArea.value = currentBrief.text;
      preview.hidden = false;
      const emailLink = byId('emailDraftLink');
      emailLink.hidden = !currentBrief.mailto;
      if (currentBrief.mailto) emailLink.href = currentBrief.mailto;
      byId('longBriefHint').hidden = Boolean(currentBrief.mailto);
      return currentBrief;
    }
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (prepareBrief()) {
        announce('Your brief is ready to review. Nothing has been sent.');
        byId('briefHeading').focus();
      }
    });
    byId('emailDraftLink').addEventListener('click', () => {
      announce('Email draft requested. If no app opens, copy or download the brief and use your webmail. This page cannot confirm delivery.');
    });
    byId('copyBriefBtn').addEventListener('click', async (event) => {
      const brief = currentBrief || prepareBrief();
      if (!brief) return;
      const button = event.currentTarget;
      button.disabled = true;
      const ok = await copyText(brief.text, navigator.clipboard);
      button.disabled = false;
      if (brief !== currentBrief) return; // Do not announce stale content after an edit.
      announce(ok ? 'Brief copied. Paste it into your email and send when ready.' : 'Copy unavailable. The brief is selected below; use your device’s Copy command.', !ok);
      if (!ok) { textArea.focus(); textArea.select(); }
    });
    byId('downloadBriefBtn').addEventListener('click', () => {
      const brief = currentBrief || prepareBrief();
      if (!brief) return;
      try {
        const url = URL.createObjectURL(new Blob([brief.text], { type: 'text/plain;charset=utf-8' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'ghost-breach-project-brief.txt';
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        announce('Download requested. Attach the text file to an email or paste its contents into webmail.');
      } catch {
        announce('Download unavailable. Select and copy the brief below.', true);
        textArea.focus(); textArea.select();
      }
    });

    // Keep advanced information compact on phones; user toggles are never overridden.
    if (window.matchMedia('(max-width: 600px)').matches) {
      document.querySelectorAll('details.mobile-collapsible').forEach((details) => { details.open = false; });
    }
    byId('intakeFields').disabled = false;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
