// Copy code script -------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const clipboardButtons = document.querySelectorAll(".js-clipboard-copy");

  clipboardButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const textToCopy = button.getAttribute("value");
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          console.log("Text copied to clipboard");
          button
            .querySelector(".js-clipboard-check-icon")
            .classList.remove("d-none");
          button
            .querySelector(".js-clipboard-copy-icon")
            .classList.add("d-none");
          setTimeout(() => {
            button
              .querySelector(".js-clipboard-check-icon")
              .classList.add("d-none");
            button
              .querySelector(".js-clipboard-copy-icon")
              .classList.remove("d-none");
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    });
  });
});

// Contents popup code -------------------------------------------------------------------------

const popup = document.getElementById("popup");
const popupBtn = document.getElementById("popupBtn");
const closeBtn = document.getElementById("closeBtn");

// Show the popup when the button is clicked
popupBtn.addEventListener("click", function () {
  popup.style.display = "block";
});

// Hide the popup when the close button is clicked
closeBtn.addEventListener("click", function () {
  popup.style.display = "none";
});

// Hide the popup when any area of the popup (including its content) is clicked
popup.addEventListener("click", function () {
  popup.style.display = "none";
});

