const sections = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  },
  { threshold: 0.2 }
);

sections.forEach((section) => observer.observe(section));

const scrollButton = document.querySelector("[data-scroll]");
if (scrollButton) {
  scrollButton.addEventListener("click", () => {
    const target = document.querySelector(scrollButton.dataset.scroll);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

const range = document.getElementById("colorRange");
const vividPreview = document.getElementById("vividPreview");
if (range && vividPreview) {
  range.addEventListener("input", (event) => {
    const value = Number(event.target.value);
    vividPreview.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
  });
}

const form = document.querySelector(".contact-form");
const formMessage = document.getElementById("formMessage");
if (form && formMessage) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.textContent = "ההודעה נשלחה בהצלחה. נדבר ממש בקרוב!";
    form.reset();
  });
}
