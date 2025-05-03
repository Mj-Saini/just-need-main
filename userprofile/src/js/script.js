document.addEventListener("DOMContentLoaded", () => {
  // Password Update
  const passwordForm = document.getElementById("passwordForm");
  const newPassword = document.getElementById("newPassword");
  const confirmPassword = document.getElementById("confirmPassword");
  const passwordStrength = document.getElementById("passwordStrength");

  passwordForm.addEventListener("input", () => {
    const pass = newPassword.value;
    const strength =
      pass.length >= 6 ? (pass.length >= 10 ? "strong" : "medium") : "weak";
    passwordStrength.className = `password-strength ${strength}`;
    passwordStrength.textContent = `Strength: ${
      strength.charAt(0).toUpperCase() + strength.slice(1)
    }`;

    const match = pass === confirmPassword.value;
    confirmPassword.setCustomValidity(match ? "" : "Passwords do not match");
  });

  passwordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (newPassword.value.length < 6)
      alert("Password must be at least 6 characters");
    else if (newPassword.value !== confirmPassword.value)
      alert("Passwords do not match");
    else alert("Password updated successfully");
  });

  // Basic Details Update
  const detailsForm = document.getElementById("detailsForm");
  const profileImage = document.getElementById("profileImage");
  const imagePreview = document.getElementById("imagePreview");

  const previewImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  };

  detailsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Details updated successfully");
  });

  // Deactivate Account
  const deactivateBtn = document.getElementById("deactivateBtn");
  const deactivateModal = document.getElementById("deactivateModal");
  const confirmInput = document.getElementById("confirmInput");
  const confirmDeactivate = document.getElementById("confirmDeactivate");
  const cancelDeactivate = document.getElementById("cancelDeactivate");
  const deactivateMessage = document.getElementById("deactivateMessage");

  deactivateBtn.addEventListener("click", () => {
    deactivateModal.classList.add("active");
    confirmInput.focus();
  });

  confirmInput.addEventListener("input", () => {
    confirmDeactivate.disabled = confirmInput.value !== "deactivate";
  });

  confirmDeactivate.addEventListener("click", () => {
    deactivateMessage.textContent =
      "Account deactivation confirmed. Please contact support.";
    deactivateMessage.className = "modal-message active";
    setTimeout(() => {
      deactivateModal.classList.remove("active");
    }, 2000);
  });

  cancelDeactivate.addEventListener("click", () => {
    deactivateModal.classList.remove("active");
    confirmInput.value = "";
    confirmDeactivate.disabled = true;
    deactivateMessage.textContent = "";
  });

  // Keyboard accessibility for modal
  deactivateModal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") deactivateModal.classList.remove("active");
  });
});
  