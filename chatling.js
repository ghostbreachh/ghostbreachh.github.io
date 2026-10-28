/* Production-only, visitor-initiated Chatling embed. */
(() => {
  'use strict';
  const CHATBOT_ID = '9599441718';

  function init() {
    const button = document.getElementById('loadChatBtn');
    const status = document.getElementById('chatStatus');
    const container = document.querySelector('.production-chat');
    if (!button || !status || !container) return;

    container.hidden = false;
    button.hidden = false;
    button.setAttribute('aria-describedby', 'chatDisclosure chatStatus');

    button.addEventListener('click', () => {
      if (document.getElementById('chtl-script')) return;
      window.chtlConfig = { chatbotId: CHATBOT_ID };
      button.disabled = true;
      button.textContent = 'Loading chat…';
      status.textContent = 'Connecting to Chatling…';

      const script = document.createElement('script');
      script.async = true;
      script.id = 'chtl-script';
      script.type = 'text/javascript';
      script.dataset.id = CHATBOT_ID;
      script.src = 'https://chatling.ai/js/embed.js';
      script.onload = () => {
        button.textContent = 'Chat requested';
        status.textContent = 'Look for the chat launcher. If it does not appear, use email or prepare a brief below.';
      };
      script.onerror = () => {
        script.remove();
        button.disabled = false;
        button.textContent = 'Retry live chat';
        status.textContent = 'Chat could not load. Retry, email directly, or prepare a brief below.';
      };
      document.head.appendChild(script);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
