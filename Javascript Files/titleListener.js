// Mobil kontrolü fonksiyonu
function isTouchDevice() {
  return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
}

// Yalnızca touch olmayan cihazlarda çalışsın
if (!isTouchDevice()) {
  const tooltipState = new Map();
  
  document.addEventListener("mousemove", function(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    document.querySelectorAll("[data-title]").forEach((element) => {
      // Etkileşim durumunda pozisyon güncelleme yapma
      if (tooltipState.get(element) === 'active') return;
      
      const tooltipText = element.getAttribute("data-title");
      const tooltipWidth = tooltipText.length * 8 + 20;
      const tooltipHeight = 30;

      let newMouseX = mouseX;
      let newMouseY = mouseY;

      // Sağa taşmayı engelle
      if (mouseX + tooltipWidth > window.innerWidth - 10) {
        newMouseX = window.innerWidth - tooltipWidth - 10;
      } else if (mouseX < 10) {
        newMouseX = 10;
      }

      // Alta taşmayı engelle
      if (mouseY + tooltipHeight + 20 > window.innerHeight) {
        newMouseY = window.innerHeight - tooltipHeight - 20;
      }

      document.documentElement.style.setProperty("--mouse-x", newMouseX + "px");
      document.documentElement.style.setProperty("--mouse-y", newMouseY + "px");
    });
  });

  // Hover ve etkileşim yönetimi
  document.querySelectorAll("[data-title]").forEach((element) => {
    let hoverTimer;
    let interactionTimer;
    
    // Tooltip'i göster
    const showTooltip = () => {
      element.setAttribute("data-show-tooltip", "true");
      tooltipState.set(element, 'hover');
    };
    
    // Tooltip'i gizle
    const hideTooltip = () => {
      element.removeAttribute("data-show-tooltip");
      tooltipState.set(element, 'active');
      
      // 3 saniye sonra tekrar tooltip'e izin ver
      clearTimeout(interactionTimer);
      interactionTimer = setTimeout(() => {
        tooltipState.delete(element);
        
        // Eğer fare hala elementin üzerindeyse tooltip'i göster
        if (element.matches(':hover')) {
          hoverTimer = setTimeout(showTooltip, 800);
        }
      }, 800);
    };

    // Mouse ile etkileşim
    element.addEventListener("mouseenter", () => {
      if (!tooltipState.has(element)) {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(showTooltip, 800);
      }
    });
    
    element.addEventListener("mouseleave", () => {
      clearTimeout(hoverTimer);
      if (tooltipState.get(element) === 'hover') {
        element.removeAttribute("data-show-tooltip");
        tooltipState.delete(element);
      }
    });

    // Tıklama/klavye etkileşimi
    element.addEventListener("click", hideTooltip);
    element.addEventListener("focus", hideTooltip);
    element.addEventListener("keydown", hideTooltip);

    // Etkileşim sonu
    element.addEventListener("blur", () => {
      tooltipState.delete(element);
    });
    
    element.addEventListener("keyup", () => {
      tooltipState.delete(element);
    });
  });
}   