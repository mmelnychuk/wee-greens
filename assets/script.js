/* Wee Greens — cottage-ink draft: small, dependency-free behaviour */

// Put the real inbox here once it exists, e.g. "hello@weegreens.co.uk".
// While it's blank the contact form shows a friendly "draft site, not sent" note.
const WEE_GREENS_EMAIL = "";

document.documentElement.classList.add("js");

// Mobile menu
const menuBtn = document.querySelector(".menu-btn");
const navList = document.querySelector("#nav-links");
if (menuBtn && navList) {
  menuBtn.addEventListener("click", () => {
    const open = navList.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "Close" : "Menu";
  });
}

// Gentle reveal on scroll
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

// Footer year
document.querySelectorAll("[data-year]").forEach((n) => (n.textContent = new Date().getFullYear()));

// Contact form: pre-tick a green from ?green=..., then mailto (if email set) or a preview note
const form = document.querySelector("#enquiry-form");
if (form) {
  const params = new URLSearchParams(location.search);
  const green = params.get("green");
  if (green) {
    form.querySelectorAll('input[name="greens"]').forEach((cb) => { if (cb.value === green) cb.checked = true; });
    const topic = form.querySelector("#topic");
    if (topic) topic.value = "Tray enquiry";
  }
  if (params.get("topic") === "list") {
    const topic = form.querySelector("#topic");
    if (topic) topic.value = "Let me know when you launch";
  }

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const status = form.querySelector("#form-status");
    status.classList.remove("err");
    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = "A wee bit missing — name, email and a message, please.";
      status.classList.add("show", "err");
      return;
    }
    const d = new FormData(form);
    const name = String(d.get("name") || "").trim();
    const first = name.split(/\s+/)[0];
    const greens = d.getAll("greens").join(", ") || "-";
    if (WEE_GREENS_EMAIL) {
      const subject = `Wee Greens: ${d.get("topic")} from ${name}`;
      const body = `Name: ${name}\nEmail: ${d.get("email")}\nWhereabouts: ${d.get("area") || "-"}\nAbout: ${d.get("topic")}\nGreens: ${greens}\n\n${d.get("message")}`;
      location.href = `mailto:${WEE_GREENS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = `Opening your email app… thank you, ${first}!`;
    } else {
      status.textContent = `Thank you, ${first}! This is a draft of the site, so nothing's been sent just yet. The real post-box is on its way.`;
    }
    status.classList.add("show");
    status.focus();
  });
}
