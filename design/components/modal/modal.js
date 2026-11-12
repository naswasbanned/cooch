/* modal.js - open/close native dialogs.
   Hooks: [data-modal-open="<dialog id>"], [data-modal-close] inside a dialog. Backdrop click closes. */
(function () {
  function initModalTriggers() {
    document.querySelectorAll("[data-modal-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dialog = document.getElementById(btn.getAttribute("data-modal-open"));
        if (dialog && typeof dialog.showModal === "function") dialog.showModal();
      });
    });

    document.querySelectorAll("dialog.modal").forEach(function (dialog) {
      dialog.addEventListener("click", function (e) {
        if (e.target === dialog || e.target.closest("[data-modal-close]")) dialog.close();
      });
    });
  }

  initModalTriggers();
})();
