//spin effect + refresh
const spinBtn = document.querySelector('[data-spin="btn"]');
const spinIcon = document.getElementById("spin_this");
if (spinBtn && spinIcon) {
  spinBtn.style.cursor = "pointer";
  spinBtn.addEventListener("click", () => {
    gsap.fromTo(spinIcon, { rotation: 0 },
    {
      rotation: -720,
      duration: 1,
      ease: "power2.inOut",
      transformOrigin: "50% 50%"
    });
    setTimeout(() => location.reload(), 1000);
  });
}
