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

  // Service Accordion Interactive Click-Only Handler
  const serviceCards = document.querySelectorAll(".home-1-service-card");
  serviceCards.forEach(function (card) {
    card.addEventListener("click", function () {
      const parent = card.parentElement;
      if (parent) {
        parent.querySelectorAll(".home-1-service-card").forEach(function (c) {
          c.classList.remove("active");
        });
      }
      card.classList.add("active");
    });
  });

  // Guarantee Auto-play for local footer videos across all browsers and file:// protocols
  function initFooterVideos() {
    const footerVideos = document.querySelectorAll(".footer-custom-video");
    footerVideos.forEach(function (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("autoplay", "");
      video.setAttribute("loop", "");
      
      const tryPlay = function () {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(function (err) {
            console.log("Autoplay retry queued:", err);
          });
        }
      };

      tryPlay();
      video.addEventListener("loadedmetadata", tryPlay);
      video.addEventListener("canplay", tryPlay);

      const forcePlay = function () {
        tryPlay();
      };

      document.addEventListener("click", forcePlay, { once: true });
      document.addEventListener("touchstart", forcePlay, { once: true });
      document.addEventListener("scroll", forcePlay, { once: true });
      document.addEventListener("mousemove", forcePlay, { once: true });
    });
  }

  initFooterVideos();
  window.addEventListener("load", initFooterVideos);
});

