document.addEventListener("DOMContentLoaded", function () {
  const forms = document.querySelectorAll('form[action="https://api.web3forms.com/submit"]');

  forms.forEach(function (form) {
    // Ensure submit buttons are enabled and clickable
    const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.removeAttribute("disabled");
      submitBtn.classList.remove("w-form-loading");
      submitBtn.style.pointerEvents = "auto";
      submitBtn.style.cursor = "pointer";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const formWrapper = form.closest(".w-form") || form.parentElement;
      const doneMessage = formWrapper ? formWrapper.querySelector(".w-form-done") : null;
      const failMessage = formWrapper ? formWrapper.querySelector(".w-form-fail") : null;

      const originalBtnValue = submitBtn ? (submitBtn.value || submitBtn.innerText) : "";
      if (submitBtn) {
        if (submitBtn.tagName === "INPUT") submitBtn.value = submitBtn.getAttribute("data-wait") || "Please wait...";
        else submitBtn.innerText = submitBtn.getAttribute("data-wait") || "Please wait...";
        submitBtn.disabled = true;
      }

      if (doneMessage) doneMessage.style.display = "none";
      if (failMessage) failMessage.style.display = "none";

      const formData = new FormData(form);

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      })
      .then(async function (response) {
        const json = await response.json();
        if (response.status === 200 && json.success) {
          form.style.display = "none";
          if (doneMessage) doneMessage.style.display = "block";
        } else {
          console.error("Web3Forms submission failed:", json);
          if (failMessage) failMessage.style.display = "block";
        }
      })
      .catch(function (error) {
        console.error("Web3Forms submission error:", error);
        if (failMessage) failMessage.style.display = "block";
      })
      .finally(function () {
        if (submitBtn) {
          if (submitBtn.tagName === "INPUT") submitBtn.value = originalBtnValue;
          else submitBtn.innerText = originalBtnValue;
          submitBtn.disabled = false;
          submitBtn.removeAttribute("disabled");
        }
      });
    }, true);
  });
});
