document.addEventListener("DOMContentLoaded", function () {
  const forms = document.querySelectorAll("form");

  forms.forEach(function (form) {
    // Force method to POST and action to javascript:void(0); to prevent GET redirects
    form.setAttribute("method", "POST");
    form.setAttribute("action", "javascript:void(0);");

    // Ensure submit buttons are enabled and clickable
    const submitBtn = form.querySelector('input[type="submit"], button[type="submit"], .contact-button, .cta-buuton');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.removeAttribute("disabled");
      submitBtn.classList.remove("w-form-loading");
      submitBtn.style.pointerEvents = "auto";
      submitBtn.style.cursor = "pointer";
    }

    let isSubmitting = false;

    function processSubmission(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (isSubmitting) return;

      // Check HTML5 input validity before submitting
      if (typeof form.checkValidity === "function" && !form.checkValidity()) {
        if (typeof form.reportValidity === "function") {
          form.reportValidity();
        }
        return;
      }

      isSubmitting = true;

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

      const payload = {
        page: window.location.pathname.split("/").pop() || "index.html",
        source: document.title || "Techvery Website"
      };

      // Extract all form inputs cleanly
      const allInputs = form.querySelectorAll("input, select, textarea");
      allInputs.forEach(function (input) {
        if (input.type === "submit" || input.type === "button" || input.type === "checkbox" || input.name === "botcheck") return;
        if (input.name && input.name.includes("turnstile")) return;

        const val = (input.value || "").trim();
        if (!val) return;

        const nameAttr = input.name || "";
        const placeholder = (input.getAttribute("placeholder") || "").toLowerCase();
        const idAttr = (input.id || "").toLowerCase();

        // 1. Full Name
        if (nameAttr === "CTA-Name" || placeholder.includes("full name") || idAttr === "cta-name" || nameAttr === "Full Name") {
          payload["Name"] = val;
        }
        // 2. Email
        else if (nameAttr.toLowerCase() === "email" || placeholder.includes("mail") || idAttr === "email") {
          payload["Email Address"] = val;
        }
        // 3. Company Name
        else if (placeholder.includes("company") || nameAttr === "Company Name" || (nameAttr === "name" && input.closest(".cta-form-field-wrapper"))) {
          payload["Company Name"] = val;
        }
        // 4. Phone
        else if (nameAttr === "Phone" || placeholder.includes("phone") || idAttr === "phone") {
          payload["Phone Number"] = val;
        }
        // 5. Budget (Select or input)
        else if (nameAttr === "Budget" || placeholder.includes("budget") || input.tagName === "SELECT") {
          if (input.tagName === "SELECT") {
            const selectedOption = input.options[input.selectedIndex];
            const optVal = selectedOption ? (selectedOption.value || selectedOption.text).trim() : "";
            if (optVal && !optVal.toLowerCase().includes("select")) {
              payload["Budget"] = optVal;
            }
          } else {
            payload["Budget"] = val;
          }
        }
        // 6. Message
        else if (nameAttr === "Message" || nameAttr === "field" || placeholder.includes("message") || input.tagName === "TEXTAREA") {
          payload["Message"] = val;
        }
        // 7. Fallback for any other valid field
        else {
          payload[nameAttr || input.id] = val;
        }
      });

      function handleSuccess() {
        form.style.display = "none";
        if (doneMessage) doneMessage.style.display = "block";
      }

      function handleFailure(err) {
        console.error("Email send error:", err);
        if (failMessage) failMessage.style.display = "block";
      }

      function resetBtn() {
        isSubmitting = false;
        if (submitBtn) {
          if (submitBtn.tagName === "INPUT") submitBtn.value = originalBtnValue;
          else submitBtn.innerText = originalBtnValue;
          submitBtn.disabled = false;
          submitBtn.removeAttribute("disabled");
        }
      }

      // Send form data to the Cloudflare Worker, which relays it to Resend's REST API
      // const endpoint = "http://localhost:4011/api/v1/techvery/contact";
      const endpoint = "https://kretossadminapi.kretosstechnology.com/api/v1/techvery/contact";

      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(async function (res) {
          const json = await res.json().catch(function () { return {}; });
          if (res.ok && json.success) {
            handleSuccess();
          } else {
            handleFailure(json);
          }
        })
        .catch(handleFailure)
        .finally(resetBtn);
    }

    form.addEventListener("submit", processSubmission, true);

    if (submitBtn) {
      submitBtn.addEventListener("click", function (e) {
        processSubmission(e);
      });
    }
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

  // Automatic Profile Card Rotation (Ankur Kavathiya <-> Aliah Techvery every 5 seconds)
  // Animation: Outgoing profile slides UP & fades out; Incoming profile enters from DOWN & slides up into position smoothly.
  function initProfileRotator() {
    const navProfileCards = document.querySelectorAll(".nav-profile-card, .hero-1-profile-card-wrapper");
    if (!navProfileCards.length) return;

    const profiles = [
      {
        name: "Ankur Kavathiya",
        title: "CEO",
        imageName: "ankursir.png"
      },
      {
        name: "Aliah Miranda",
        title: "CTO",
        imageName: "aliha.jpg"
      }
    ];

    // Preload both images immediately to ensure instantaneous swap with zero network delay
    ["ankursir.png", "aliha.jpg"].forEach(function (imgName) {
      const img1 = new Image();
      img1.src = "assets/images/" + imgName;
      const img2 = new Image();
      img2.src = "../assets/images/" + imgName;
    });

    let currentIndex = 0;

    navProfileCards.forEach(function (card) {
      card.style.transition = "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease";
      card.style.willChange = "transform, opacity";
      card.style.minWidth = "175px";
      card.style.boxSizing = "border-box";
    });

    setInterval(function () {
      currentIndex = (currentIndex + 1) % profiles.length;
      const nextProfile = profiles[currentIndex];

      navProfileCards.forEach(function (card) {
        // Step 1: Slide UP & fade OUT smoothly
        card.style.transition = "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease";
        card.style.transform = "translateY(-14px)";
        card.style.opacity = "0";

        setTimeout(function () {
          // Step 2: Update image & wait for decode while card is completely invisible (opacity: 0)
          const img = card.querySelector("img");

          const applyUpdatesAndReveal = function () {
            const nameEl = card.querySelector(".nav-profile-name, .hero-1-profile-text");
            if (nameEl) {
              nameEl.textContent = nextProfile.name;
            }

            const titleEl = card.querySelector(".nav-profile-title, .text-xsmall-medium, .hero-1-profile-subtitle");
            if (titleEl) {
              titleEl.textContent = nextProfile.title;
            }

            // Step 3: Move to bottom start position (+14px) instantly while hidden
            card.style.transition = "none";
            card.style.transform = "translateY(14px)";

            // Step 4: Force browser reflow so translateY(14px) takes effect before transition
            void card.offsetWidth;

            // Step 5: Animate back UP to normal position (0) & fade IN smoothly
            card.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease";
            card.style.transform = "translateY(0)";
            card.style.opacity = "1";
          };

          if (img) {
            const rawSrc = img.getAttribute("src") || img.src;
            if (rawSrc) {
              const newSrc = rawSrc.replace(/ankursir\.png|aliha\.jpg/g, nextProfile.imageName);
              img.setAttribute("src", newSrc);
              img.src = newSrc;
            }
            img.alt = nextProfile.name;

            // Wait for image decode to guarantee the browser NEVER paints the previous image frame during fade-in
            if (typeof img.decode === "function") {
              img.decode().then(applyUpdatesAndReveal).catch(applyUpdatesAndReveal);
            } else {
              applyUpdatesAndReveal();
            }
          } else {
            applyUpdatesAndReveal();
          }
        }, 360);
      });
    }, 5000);
  }

  initProfileRotator();

  // Intercept and disable clicks on the 4 right-side sub-service cards
  const subCards = document.querySelectorAll(
    ".service-1-holder, .service-1-card-holder, .service-card-content-wrapper, .service-solution-collectiuon-item, .service-solution-link-wrapper"
  );
  subCards.forEach(function (card) {
    card.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }, true);
  });
});

