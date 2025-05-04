//toggle menu
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.side-menu');
    const navLinks = document.querySelector('.nav-links');
    
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function(event) {
      event.stopPropagation();
      navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideNav = navLinks.contains(event.target);
      const isClickOnHamburger = hamburger.contains(event.target);
      
      if (navLinks.classList.contains('active') && !isClickInsideNav && !isClickOnHamburger) {
        navLinks.classList.remove('active');
      }
    });
    
    // Close menu on window resize
    window.addEventListener('resize', function() {
      if (window.innerWidth > 992 && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
      }
    });
});

// ------------------------------------
// Active Link Highlighting
// ------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".nav-links a");
    const currentPath = window.location.hash; 
    
    // Set initial active link based on current URL
    links.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });

    // Update active link on click
    links.forEach(link => {
        link.addEventListener("click", function () {
            links.forEach(l => l.classList.remove("active"));
            this.classList.add("active");
            localStorage.setItem("activeLink", this.getAttribute("href"));
        });
    });

    // Restore active link from localStorage if available
    const storedActiveLink = localStorage.getItem("activeLink");
    if (storedActiveLink) {
        links.forEach(link => {
            if (link.getAttribute("href") === storedActiveLink) {
                link.classList.add("active");
            }
        });
    }
});


// ------------------------------------
// Typewriter Effect for Name
// ------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const name = "Hello, I'm AbdulRahman Khawaga";
    const typedNameElement = document.getElementById("typewriter");
    let index = 0;

    function typeWriter() {
      if (index < name.length) {
          typedNameElement.textContent += name.charAt(index);
          index++;
          setTimeout(typeWriter, 150);
      }
    }
    
    typeWriter();
});

// ------------------------------------
// Scroll to Top Button with Progress Indicator
// ------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const scrollBtn = document.getElementById("scrollBtn");
    const progressPath = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    
    // Create the SVG progress circle
    progressPath.setAttribute('class', 'scroll-progress');
    progressPath.setAttribute('width', '100%');
    progressPath.setAttribute('height', '100%');
    progressPath.setAttribute('viewBox', '0 0 100 100');
    progressPath.innerHTML = '<path d="M50,10 a40,40 0 0,1 0,80 a40,40 0 0,1 0,-80" />';
    
    scrollBtn.appendChild(progressPath);
    
    const path = progressPath.querySelector('path');
    const pathLength = path.getTotalLength();
    
    // Set up the path properties
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;
    
    // Listen for scroll events
    window.addEventListener('scroll', throttle(function() {
        // Calculate scroll progress
        const scrollPercentage = calculateScrollPercentage();
        
        // Update the path's offset based on scroll
        const drawLength = pathLength * scrollPercentage;
        path.style.strokeDashoffset = pathLength - drawLength;
        
        // Show/hide button based on scroll position
        if (window.scrollY >= 500) {
            scrollBtn.classList.add("visible");
        } else {
            scrollBtn.classList.remove("visible");
        }
    }, 10));

    // Calculate how far scrolled down the page
    function calculateScrollPercentage() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        return scrollTop / scrollHeight;
    }
    
    // Throttle function to limit how often a function runs
    function throttle(callback, limit) {
        let waiting = false;
        return function() {
            if (!waiting) {
                callback.apply(this, arguments);
                waiting = true;
                setTimeout(function() {
                    waiting = false;
                }, limit);
            }
        };
    }

    // Smooth scroll with easing
    scrollBtn.addEventListener('click', function() {
        // Calculate distance to scroll
        const startPosition = window.pageYOffset;
        const duration = 800; // ms
        let startTime = null;
        
        // Easing function
        function easeInOutCubic(t) {
            return t < 0.5 
                ? 4 * t * t * t 
                : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }
        
        function scrollAnimation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easeProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition * (1 - easeProgress));
            
            if (elapsedTime < duration) {
                requestAnimationFrame(scrollAnimation);
            }
        }
        
        requestAnimationFrame(scrollAnimation);
    });

    // Add hover effect
    scrollBtn.addEventListener('mouseenter', function() {
        path.style.transition = 'stroke-dashoffset 0.3s ease';
    });
    
    scrollBtn.addEventListener('mouseleave', function() {
        path.style.transition = 'none';
    });
});

// ------------------------------------
// Initial Page Load Behavior
// ------------------------------------
window.addEventListener('load', function () {
    setTimeout(function () {
        window.scrollTo(0, 0);
    }, 0);
});

// ------------------------------------
// Blog Navigation and Pagination
// ------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const dots = document.querySelectorAll('.blog-dot');
  const cards = Array.from(document.querySelectorAll('.blog-card'));
  const blogGrid = document.querySelector('.blog-grid');
  
  // Determine number of cards per page based on screen width
  function getCardsPerPage() {
    if (window.innerWidth < 768) {
      return 1; // Mobile: 1 card per page
    } else if (window.innerWidth < 992) {
      return 2; // Tablet: 2 cards per page
    } else {
      return 3; // Desktop: 3 cards per page
    }
  }
  
  let currentPage = 0;
  let cardsPerPage = getCardsPerPage();
  let totalPages = Math.ceil(cards.length / cardsPerPage);
  
  // Add accessibility attributes
  nextBtn.setAttribute('aria-label', 'Next page');
  prevBtn.setAttribute('aria-label', 'Previous page');
  blogGrid.setAttribute('aria-live', 'polite');
  
  // Create pagination dots dynamically
  function createDots() {
    const dotsContainer = document.querySelector('.blog-dots');
    dotsContainer.innerHTML = ''; // Clear existing dots
    
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('span');
      dot.classList.add('blog-dot');
      dot.setAttribute('role', 'button');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', `Page ${i + 1}`);
      
      if (i === currentPage) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      }
      
      dot.addEventListener('click', function() {
        goToPage(i);
      });
      
      // Add keyboard support
      dot.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goToPage(i);
        }
      });
      
      dotsContainer.appendChild(dot);
    }
  }
  
  // Update the active pagination dot
  function updateDots() {
    const dots = document.querySelectorAll('.blog-dot');
    dots.forEach((dot, index) => {
      if (index < totalPages) {
        dot.style.display = 'block';
        if (index === currentPage) {
          dot.classList.add('active');
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.classList.remove('active');
          dot.setAttribute('aria-current', 'false');
        }
      } else {
        dot.style.display = 'none';
      }
    });
  }
  
  // Update visible blog cards with smooth transitions
  function updateCards() {
    const startIndex = currentPage * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    
    // Apply transition styles
    cards.forEach(card => {
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });
    
    // First hide all cards with fade out
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 300); // Match transition time
    });
    
    // After short delay, show the correct cards with fade in
    setTimeout(() => {
      cards.forEach((card, index) => {
        if (index >= startIndex && index < endIndex) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        }
      });
    }, 350);
  }
  
  // Go to specific page
  function goToPage(pageIndex) {
    currentPage = pageIndex;
    updateDots();
    updateCards();
  }
  
  // Initial setup
  function initialize() {
    createDots();
    updateCards();
    
    // Ensure the navigation buttons are visible/hidden correctly
    if (totalPages <= 1) {
      document.querySelector('.blog-navigation').style.display = 'none';
    } else {
      document.querySelector('.blog-navigation').style.display = 'flex';
    }
  }
  
  initialize();
  
  // Next button click
  nextBtn.addEventListener('click', function() {
    if (currentPage < totalPages - 1) {
      currentPage++;
    } else {
      currentPage = 0; // Wrap around to first page
    }
    updateDots();
    updateCards();
  });
  
  // Previous button click
  prevBtn.addEventListener('click', function() {
    if (currentPage > 0) {
      currentPage--;
    } else {
      currentPage = totalPages - 1; // Wrap around to last page
    }
    updateDots();
    updateCards();
  });
  
  // Add keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (document.querySelector('.blog').contains(e.target) || 
        document.querySelector('.blog-navigation').contains(e.target)) {
      if (e.key === 'ArrowRight') {
        nextBtn.click();
      } else if (e.key === 'ArrowLeft') {
        prevBtn.click();
      }
    }
  });
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      const newCardsPerPage = getCardsPerPage();
      if (newCardsPerPage !== cardsPerPage) {
        cardsPerPage = newCardsPerPage;
        totalPages = Math.ceil(cards.length / cardsPerPage);
        
        // Adjust current page if needed
        if (currentPage >= totalPages) {
          currentPage = totalPages - 1;
        }
        
        createDots(); // Recreate dots based on new total
        updateCards();
      }
    }, 200);
  });
  
  // Add swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  blogGrid.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  blogGrid.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const threshold = 50; // Minimum distance for swipe
    
    if (touchEndX < touchStartX - threshold) {
      // Swipe left (next)
      nextBtn.click();
    } else if (touchEndX > touchStartX + threshold) {
      // Swipe right (previous)
      prevBtn.click();
    }
  }
});
