/*!
 * PureFlowCSS v1.0.0 (https://pureflowcss.com/)
 * Copyright 2025 The PureFlowCSS Authors
 * Licensed under MIT (https://github.com/ArdaBozan/PureFlowCSS/blob/main/LICENSE)
 */

document.addEventListener("DOMContentLoaded", () => {
    const modalButton = document.querySelector(".active-modal");
    const fullScreenModal = document.querySelector(".fullScreenModal");
    const modalContent = document.querySelector(".modalContent");
    const body = document.body;
  
    const openModal = () => {
      fullScreenModal.classList.add("show-fullScreenModal");
      modalContent.classList.add("show-modalContent");
      body.classList.add("noScrollBody");
    };
  
    const closeModal = () => {
      fullScreenModal.classList.remove("show-fullScreenModal");
      modalContent.classList.remove("show-modalContent");
      body.classList.remove("noScrollBody");
    };
  
    // Open modal on button click
    modalButton.addEventListener("click", openModal);
  
    // Close modal on clicking outside modalContent
    fullScreenModal.addEventListener("click", (e) => {
      if (!modalContent.contains(e.target)) {
        closeModal();
      }
    });
  });
  