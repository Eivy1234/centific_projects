document.addEventListener("DOMContentLoaded", () => {
  // LANGUAGE TOGGLE
  const langButton = document.getElementById("lang-toggle");
  let currentLang = localStorage.getItem("lang") || "en";

  function applyLanguage(lang) {
    document.querySelectorAll("[data-en]").forEach((el) => {
      el.textContent = el.getAttribute(`data-${lang}`);
    });
    langButton.textContent = lang === "en" ? "Español" : "English";

    // Insert about section link dynamically
    const aboutLink = document.getElementById("about-link");
    if (aboutLink) {
      if (lang === "en") {
        aboutLink.innerHTML = `<a href="https://centific.com/company" target="_blank" rel="noopener noreferrer" class="about-link-button">Learn more about us on our official website</a>.`;
      } else {
        aboutLink.innerHTML = `<a href="https://centific.com/company" target="_blank" rel="noopener noreferrer" class="about-link-button">Conozca más sobre nosotros en nuestro sitio web oficial</a>.`;
      }
    }

  }

  applyLanguage(currentLang);

  langButton.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "es" : "en";
    localStorage.setItem("lang", currentLang);
    applyLanguage(currentLang);
  });

  // COPY BUTTON - if exists
  const copyBtn = document.getElementById("copy-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const link = document.getElementById("referral-link");
      link.select();
      document.execCommand("copy");
      document.getElementById("copy-message").textContent =
        currentLang === "es" ? "¡Enlace copiado!" : "Referral link copied!";
    });
  }
});

/*
const projects = [
  {
    title: "Project Cochera",
    shortDescription:
      "Quick 10-minute survey to help improve wellness programs.",
    fullDescription:
      "Participate in our Health & Lifestyle Survey. Share your habits to help us improve wellness programs in the community. Anonymous, takes about 10 minutes.",
    signupLink: "https://example.com/form1",
  },
  {
    title: "Project Casas",
    shortDescription: "15-minute online survey about your daily tech usage.",
    fullDescription:
      "Help us understand modern technology usage. This study involves an online survey of about 15 minutes, fully anonymous. Your input guides our research.",
    signupLink: "https://example.com/form2",
  },
  {
    title: "Project Space",
    shortDescription: "Share your thoughts on community programs.",
    fullDescription:
      "Your feedback matters! Share your thoughts on local community programs to help guide future improvements. Short, anonymous, and easy to complete.",
    signupLink: "https://example.com/form3",
  },
];
*/
