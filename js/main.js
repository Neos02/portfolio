const contactForm = document.getElementById("contactForm");
const formLoading = document.getElementById("formLoading");
const formResult = document.getElementById("formResult");

window.addEventListener("load", updateScrollItems);
window.addEventListener("scroll", updateScrollItems);

function submitContact() {
  const formData = new FormData(contactForm);
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  contactForm.style.visibility = "hidden";
  formLoading.classList.remove("hidden");

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: json,
  })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        formLoading.classList.add("hidden");
        formResult.classList.remove("hidden");
      } else {
        formResult.innerHTML = json.message;
      }
    })
    .catch((error) => {
      console.log(error);
      formResult.innerHTML = "Something went wrong!";
    })
    .then(function () {
      contactForm.reset();
    });
}

function updateScrollItems() {
  const scrollUpdateItems = [
    ...document.getElementsByTagName("nav"),
    document.getElementById("scroll-indicator"),
  ];

  scrollUpdateItems.forEach((item) => {
    if (window.scrollY > 64) {
      item.classList.add("scrolled");
    } else {
      item.classList.remove("scrolled");
    }
  });
}

createParticleEventListeners("particle-btn");

const media448 = window.matchMedia("(max-width: 448px)");

media448.onchange = shortenName;

shortenName(media448);
hackerText(document.getElementById("name"));
