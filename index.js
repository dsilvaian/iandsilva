const company_list = document.getElementById("company_list");
const company_descriptions = document.getElementById("company_descriptions");
const company_highlight = document.getElementById(
    "experience__company-highlight"
);
const contact_section = document.getElementById("contact-section");
const social_links_white = document.getElementById("social-white");
const social_links_dark = document.getElementById("social-dark");


const navLinks = document.getElementById("nav-links");
const navButton = document.getElementById("nav-button");


const project_button_outlines = document.querySelectorAll('.portfolio__project__button--outlined');
const project_button_filleds = document.querySelectorAll('.portfolio__project__button--filled');

const contactForm = document.getElementById("contact-form");

const contactFormSubmitButton = document.getElementById("contact-form-submit-button");

const socialIconLine = document.querySelector(".social__line");

// contactForm.addEventListener("submit", (event) => {
//     event.preventDefault();

//     const formData = new FormData(contactForm);
//     const data = Object.fromEntries(formData.entries());

//     console.log(formData);
//     console.log(data);

//     // fetch("/", {
//     //     method: "POST",
//     //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     //     body: new URLSearchParams(formData).toString(),
//     //   })
//     //     .then(() => console.log("Form successfully submitted"))
//     //     .catch((error) => alert(error));

// });

project_button_outlines.forEach((button, index) => {


    if (button.parentElement.previousElementSibling == null) {
        return;
    }

    button.addEventListener('mouseenter', () => {
        button.parentElement.previousElementSibling.children[0].classList.toggle('portfolio__project__button--filled');
    });

    button.addEventListener('mouseleave', () => {
        button.parentElement.previousElementSibling.children[0].classList.toggle('portfolio__project__button--filled');
    });
});



// Function to update the height and Y position
function updateHighlightPosition() {
    const activeCompany = document.querySelector(
        ".experience__company--active"
    );
    const company_highlight_tab_height = activeCompany.offsetHeight;
    company_highlight.style.height = `${company_highlight_tab_height}px`;

    const [_, id] = activeCompany.id.split("-");
    const translateYValue = (parseInt(id) - 1) * company_highlight_tab_height;
    company_highlight.style.transform = `translateY(${translateYValue}px)`;
}

function resizeCompanyDescriptions() {


    if (window.innerWidth <= 48 * parseFloat(getComputedStyle(document.body).fontSize)) {
        return;
    }

    let maxHeight = 0;

    // Determine the maximum height
    for (const child of company_descriptions.children) {
        const childHeight = child.offsetHeight;
        if (childHeight > maxHeight) {
            maxHeight = childHeight;
        }
    }

    // Set the height of all children to the maximum height
    for (const child of company_descriptions.children) {
        child.style.height = `${maxHeight}px`;
    }
}


function updateColoredSectionHeight() {
    const contactColoredSection = document.querySelector(".contact__footer");
    const contactFormSection = document.querySelector(".contact__form");
  
    const contactFormSectionHeight = contactFormSection.offsetHeight;
    const bodyTop = document.body.getBoundingClientRect().top;
    const contactFormSectionTop = contactFormSection.getBoundingClientRect().top - bodyTop;
    const contactColoredSectionTop = contactColoredSection.getBoundingClientRect().top - bodyTop;

    const contactColoredSectionHeight = contactFormSectionHeight - ( contactColoredSectionTop - contactFormSectionTop) + 10 * parseFloat(getComputedStyle(document.documentElement).fontSize);

    contactColoredSection.style.height = contactColoredSectionHeight + "px" ;
}
  
  
  
  
// Set the initial height and Y position after the page and all its resources have loaded
window.onload = () => {
    updateHighlightPosition();
    resizeCompanyDescriptions();
    updateColoredSectionHeight();
};

// Update the height and Y position, and resize company_descriptions children when the window is resized
window.addEventListener("resize", () => {
    updateHighlightPosition();
    resizeCompanyDescriptions();
    updateColoredSectionHeight();
    
});

company_list.addEventListener("click", (event) => {
    if (!event.target.classList.contains("experience__company")) {
        return;
    }

    // Update the active class
    const previousActive = document.querySelector(
        ".experience__company--active"
    );
    if (previousActive) {
        previousActive.classList.remove("experience__company--active");
    }
    event.target.classList.add("experience__company--active");

    updateHighlightPosition();

    const [_, id] = event.target.id.split("-");

    for (let i = 0; i < company_descriptions.children.length; i++) {
        if (i == id - 1) {
            company_descriptions.children[i].classList.add(
                "experience__description--visible"
            );
            continue;
        }
        company_descriptions.children[i].classList.remove(
            "experience__description--visible"
        );
    }
});


const social_icons = document.querySelectorAll(".social__item .fa, .social__line");
let isIntersecting = false;
let last_known_scroll_position = 0;
let ticking = false;
const lastValidBackgrounds = new Map();
let firstObserverEvent = true;

const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
        
        isIntersecting = entry.isIntersecting;

        if (isIntersecting) {

            social_icons.forEach((icon) => {
                updateElementBackground(icon, "#000");
            });

        }
    });
}

const contactSectionObserver = new IntersectionObserver(
  observerCallback,
  {
    root: null,
    rootMargin: "0px",
    threshold: 0,
  }
);

contactSectionObserver.observe(contact_section);


function updateElementBackground(element, first_color) {
    let lastValidBackground = lastValidBackgrounds.get(element) || `linear-gradient(to bottom, ${first_color} 100%, #fff 0%)`;
    
    if (isIntersecting) {
      const socialLinksWhiteRect = element.getBoundingClientRect();
      const contactSectionRect = contact_section.getBoundingClientRect();
      const contactFooterRect = document.querySelector(".contact__footer").getBoundingClientRect().top;
      const overlapHeight = socialLinksWhiteRect.bottom - contactFooterRect;
  
      if (overlapHeight > 0) {
        const overlapPercentage = (overlapHeight / element.clientHeight) * 100;
        const clippedValue = Math.min(Math.max(100 - overlapPercentage, 0), 100);
        lastValidBackground = `linear-gradient(to bottom, ${first_color}  ${clippedValue}%, #fff ${clippedValue}%)`;
        element.style.background = lastValidBackground;
      } else {
        element.style.background = `linear-gradient(to bottom, ${first_color}  100%, #fff 0%)`;
      }
    } else {
      element.style.background = `linear-gradient(to bottom, ${first_color}  100%, #fff 0%)`;
      lastValidBackground = `linear-gradient(to bottom, ${first_color}  100%, #fff 0%)`;
    }
    lastValidBackgrounds.set(element, lastValidBackground);
  }
  

document.addEventListener("scroll", () => {
  last_known_scroll_position = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(() => {
      social_icons.forEach((icon) => {
        updateElementBackground(icon, "#000");
      });
      ticking = false;
    });

    ticking = true;
  }
});



navButton.addEventListener("click", () => {
    navButton.classList.toggle("nav__toggle--active");
    navLinks.classList.toggle("nav__links--active");
});

navLinks.addEventListener("click", (event) => {
    if (event.target.classList.contains("nav__link")) {
        navButton.classList.remove("nav__toggle--active");
        navLinks.classList.remove("nav__links--active");
    }
});


social_icons.forEach((icon) => {
    icon.addEventListener("mouseover", () => {
        updateElementBackground(icon, "#b0020b");
    });
    icon.addEventListener("mouseout", () => {
        updateElementBackground(icon, "#000");
    });
});

