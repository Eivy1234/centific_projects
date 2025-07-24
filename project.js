document.addEventListener("DOMContentLoaded", () => {
  let currentLang = localStorage.getItem("lang") || "en";
  const langButton = document.getElementById("lang-toggle");
  const ADMIN_PASSWORD = "admin123"; // Use this password to access admin mode

  function applyLanguage(lang) {
    document.querySelectorAll("[data-en]").forEach((el) => {
      el.textContent = el.getAttribute(`data-${lang}`) || el.textContent;
    });
    if (langButton) {
      langButton.textContent = lang === "en" ? "Español" : "English";
    }
    const aboutLink = document.getElementById("about-link");
    if (aboutLink) {
      if (lang === "en") {
        aboutLink.innerHTML = `<a href="https://centific.com/company" target="_blank" rel="noopener noreferrer" class="about-link-button">Learn more about us on our official website</a>.`;
      } else {
        aboutLink.innerHTML = `<a href="https://centific.com/company" target="_blank" rel="noopener noreferrer" class="about-link-button">Conozca más sobre nosotros en nuestro sitio web oficial</a>.`;
      }
    }
    const commentInput = document.getElementById("comment-input");
    if (commentInput) {
      commentInput.placeholder = lang === "en" ? "Your comment" : "Tu comentario";
    }
    const commentName = document.getElementById("comment-name");
    if (commentName) {
      commentName.placeholder = lang === "en" ? "Your name" : "Tu nombre";
    }
    const adminCommentBtn = document.getElementById("admin-comment-btn");
    if (adminCommentBtn) {
      adminCommentBtn.textContent = lang === "en" ? "Admin Mode" : "Modo Admin";
    }
  }

  applyLanguage(currentLang);

  if (langButton) {
    langButton.addEventListener("click", () => {
      currentLang = currentLang === "es" ? "en" : "es";
      localStorage.setItem("lang", currentLang);
      applyLanguage(currentLang);
      loadComments(); // Refresh comments to update language
    });
  }

  const feedbackForm = document.querySelector('.feedback-form form');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', function() {
      setTimeout(function() {
        const message = document.createElement('p');
        message.textContent = currentLang === 'es' ? '¡Gracias por tus comentarios!' : 'Thank you for your feedback!';
        message.style.color = 'var(--accentPrimary)';
        document.querySelector('.feedback-form').appendChild(message);
        setTimeout(() => message.remove(), 3000);
      }, 1000);
    });
  }

  const copyBtn = document.getElementById("copy-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const link = document.getElementById("referral-link");
      if (link) {
        link.select();
        document.execCommand("copy");
        document.getElementById("copy-message").textContent = currentLang === "es" ? "¡Enlace copiado!" : "Referral link copied!";
      }
    });
  }

  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach((question) => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const icon = question.querySelector('.faq-icon');
      if (answer.style.display === 'block') {
        answer.style.display = 'none';
        icon.textContent = '+';
      } else {
        answer.style.display = 'block';
        icon.textContent = '-';
      }
    });
  });

  // Comment and Rating System
  const commentInput = document.getElementById("comment-input");
  const commentName = document.getElementById("comment-name");
  const submitCommentBtn = document.getElementById("submit-comment");
  const commentList = document.getElementById("comment-list");
  const stars = document.querySelectorAll(".star");
  const adminCommentBtn = document.getElementById("admin-comment-btn");
  let selectedRating = 0;
  const commentsPerPage = 5;
  let currentPage = 1;

  // Clear placeholder on focus for comment input and name input
  if (commentInput) {
    commentInput.addEventListener("focus", () => {
      commentInput.value = ""; // Clear value on focus
      commentInput.placeholder = "";
    });
    commentInput.addEventListener("blur", () => {
      if (!commentInput.value.trim()) {
        commentInput.placeholder = currentLang === "en" ? "Your comment" : "Tu comentario";
      }
    });
  }
  if (commentName) {
    commentName.addEventListener("focus", () => {
      commentName.value = ""; // Clear value on focus
      commentName.placeholder = "";
    });
    commentName.addEventListener("blur", () => {
      if (!commentName.value.trim()) {
        commentName.placeholder = currentLang === "en" ? "Your name" : "Tu nombre";
      }
    });
  }

  // Generate unique ID for comments
  function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Format date and time
  function formatDateTime(date) {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleString(currentLang === "en" ? "en-US" : "es-ES", options);
  }

  stars.forEach(star => {
    star.addEventListener("click", () => {
      selectedRating = parseInt(star.getAttribute("data-value"));
      stars.forEach(s => {
        s.classList.remove("selected");
        if (parseInt(s.getAttribute("data-value")) <= selectedRating) {
          s.classList.add("selected");
        }
      });
    });
    star.addEventListener("mouseover", () => {
      const value = parseInt(star.getAttribute("data-value"));
      stars.forEach(s => {
        s.classList.remove("hovered");
        if (parseInt(s.getAttribute("data-value")) <= value) {
          s.classList.add("hovered");
        }
      });
    });
    star.addEventListener("mouseout", () => {
      stars.forEach(s => s.classList.remove("hovered"));
    });
  });

  function loadComments() {
    const comments = JSON.parse(localStorage.getItem("comments") || "[]");
    commentList.innerHTML = "";
    const start = (currentPage - 1) * commentsPerPage;
    const end = start + commentsPerPage;
    const displayedComments = comments.slice(start, end);

    displayedComments.forEach(comment => {
      const commentItem = document.createElement("div");
      commentItem.classList.add("comment-item");
      commentItem.setAttribute("data-id", comment.id);
      const meta = document.createElement("div");
      meta.classList.add("comment-meta");
      meta.textContent = `${comment.name} - ${comment.timestamp}`;
      const ratingDisplay = document.createElement("div");
      ratingDisplay.classList.add("rating-display");
      ratingDisplay.innerHTML = "★".repeat(comment.rating);
      const commentText = document.createElement("p");
      commentText.textContent = comment.text;
      commentItem.appendChild(meta);
      commentItem.appendChild(ratingDisplay);
      commentItem.appendChild(commentText);
      commentList.appendChild(commentItem);
    });

    const showMoreBtn = document.getElementById("show-more-comments");
    if (showMoreBtn) {
      showMoreBtn.remove();
    }
    if (comments.length > end) {
      const showMore = document.createElement("button");
      showMore.id = "show-more-comments";
      showMore.textContent = currentLang === "en" ? "Show More" : "Mostrar Más";
      commentList.appendChild(showMore);
      showMore.addEventListener("click", () => {
        currentPage++;
        loadComments();
      });
    }
  }

  if (submitCommentBtn) {
    submitCommentBtn.addEventListener("click", () => {
      if (commentInput.value.trim() && commentName.value.trim() && selectedRating > 0) {
        const comments = JSON.parse(localStorage.getItem("comments") || "[]");
        comments.unshift({
          id: generateId(),
          name: commentName.value.trim(),
          text: commentInput.value.trim(),
          rating: selectedRating,
          timestamp: formatDateTime(new Date())
        });
        localStorage.setItem("comments", JSON.stringify(comments));
        commentInput.value = "";
        commentName.value = "";
        selectedRating = 0;
        stars.forEach(star => star.classList.remove("selected"));
        currentPage = 1; // Reset to first page
        loadComments();
      }
    });
  }

  // Admin Comment Management with debounced click
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function showAdminComments() {
    const password = prompt(currentLang === "en" ? "Enter admin password (use 'admin123'):" : "Ingrese la contraseña de administrador (use 'admin123'):");
    if (password !== ADMIN_PASSWORD) {
      alert(currentLang === "en" ? "Incorrect password!" : "¡Contraseña incorrecta!");
      return;
    }

    let adminSection = document.getElementById("admin-comment-section");
    if (adminSection) {
      adminSection.style.display = "block";
    } else {
      adminSection = document.createElement("section");
      adminSection.id = "admin-comment-section";
      adminSection.innerHTML = `
        <h2>${currentLang === "en" ? "Manage Comments" : "Gestionar Comentarios"}</h2>
        <div id="admin-comment-list"></div>
      `;
      document.querySelector("main").appendChild(adminSection);
    }

    const adminCommentList = document.getElementById("admin-comment-list");
    const comments = JSON.parse(localStorage.getItem("comments") || "[]");
    adminCommentList.innerHTML = "";
    comments.forEach(comment => {
      const commentItem = document.createElement("div");
      commentItem.classList.add("comment-item");
      commentItem.setAttribute("data-id", comment.id);
      const meta = document.createElement("div");
      meta.classList.add("comment-meta");
      meta.textContent = `${comment.name} - ${comment.timestamp}`;
      const ratingDisplay = document.createElement("div");
      ratingDisplay.classList.add("rating-display");
      ratingDisplay.innerHTML = "★".repeat(comment.rating);
      const commentText = document.createElement("p");
      commentText.textContent = comment.text;
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-comment");
      deleteBtn.textContent = currentLang === "en" ? "Delete" : "Eliminar";
      deleteBtn.addEventListener("click", () => {
        const updatedComments = comments.filter(c => c.id !== comment.id);
        localStorage.setItem("comments", JSON.stringify(updatedComments));
        loadComments();
        showAdminComments();
      });
      commentItem.appendChild(meta);
      commentItem.appendChild(ratingDisplay);
      commentItem.appendChild(commentText);
      commentItem.appendChild(deleteBtn);
      adminCommentList.appendChild(commentItem);
    });
  }

  if (adminCommentBtn) {
    // Clear any existing listeners and add a debounced handler
    adminCommentBtn.removeEventListener("click", showAdminComments);
    const debouncedShowAdmin = debounce(showAdminComments, 200);
    adminCommentBtn.addEventListener("click", debouncedShowAdmin);
  }

  loadComments();
});