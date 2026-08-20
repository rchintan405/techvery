document.addEventListener("DOMContentLoaded", function () {
  const forms = document.querySelectorAll("form");

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
      const formData = new FormData(form);
      const payload = {};
      const selectEls = form.querySelectorAll("select");
      selectEls.forEach(function (sel) {
        if (sel.name) {
          const selectedOption = sel.options[sel.selectedIndex];
          if (selectedOption) {
            const text = selectedOption.text.trim();
            const val = selectedOption.value.trim();
            if (val && val !== "First" && val !== "Second" && val !== "Third") {
              payload[sel.name] = val;
            } else if (text && !text.toLowerCase().includes("select")) {
              payload[sel.name] = text;
            }
          }
        }
      });

      formData.forEach(function (value, key) {
        if (!payload[key]) {
          payload[key] = value;
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
        if (submitBtn) {
          if (submitBtn.tagName === "INPUT") submitBtn.value = originalBtnValue;
          else submitBtn.innerText = originalBtnValue;
          submitBtn.disabled = false;
          submitBtn.removeAttribute("disabled");
        }
      }

      // Send form data to the Cloudflare Worker, which relays it to Resend's REST API
      const endpoint = "https://techvery-mail.rchintan405.workers.dev/";

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
        name: "Aliah Techvery",
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
});

