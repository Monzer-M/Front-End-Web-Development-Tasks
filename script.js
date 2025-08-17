    // DOM elements
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');
    const mainContent = document.querySelector('.main-content');
    const overlay = document.createElement('div');

    // Create overlay element for mobile
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

// State management
let isSidebarOpen = true;
let isMobile = window.innerWidth <= 768;

// Initialize the component
function init() {
    // Set initial state based on screen size
    checkScreenSize();
    
    // Add event listeners
    toggleBtn.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', closeSidebar);
    window.addEventListener('resize', handleResize);
    
    // Add keyboard support
    document.addEventListener('keydown', handleKeydown);
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
}

// Toggle sidebar function
function toggleSidebar() {
    if (isSidebarOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

// Open sidebar
function openSidebar() {
    sidebar.classList.remove('collapsed');
    mainContent.classList.remove('expanded');
    isSidebarOpen = true;
    
    // Show overlay on mobile
    if (isMobile) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Update toggle button icon
    updateToggleIcon();
    
    // Trigger custom event
    dispatchSidebarEvent('sidebarOpen');
}

// Close sidebar
function closeSidebar() {
    sidebar.classList.add('collapsed');
    mainContent.classList.add('expanded');
    isSidebarOpen = false;
    
    // Hide overlay
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Update toggle button icon
    updateToggleIcon();
    
    // Trigger custom event
    dispatchSidebarEvent('sidebarClose');
}

// Update toggle button icon
function updateToggleIcon() {
    const icon = toggleBtn.querySelector('i');
    if (isSidebarOpen) {
        icon.className = 'fas fa-chevron-left';
    } else {
        icon.className = 'fas fa-chevron-right';
    }
}


// Handle window resize
function handleResize() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 768;
    
    // If switching from mobile to desktop or vice versa
    if (wasMobile !== isMobile) {
        checkScreenSize();
    }
}

// Check screen size and adjust sidebar behavior
function checkScreenSize() {
    if (isMobile) {
        // On mobile, start with sidebar closed
        closeSidebar();
    } else {
        // On desktop, start with sidebar open
        openSidebar();
        // Remove overlay if it exists
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Handle keyboard navigation
function handleKeydown(event) {
    // ESC key closes sidebar
    if (event.key === 'Escape' && isSidebarOpen) {
        closeSidebar();
    }
    
    // ESC toggles sidebar
    if (event.altKey && event.key === 'm' && !isSidebarOpen) {
        toggleSidebar();
    }  
    
}

// Dispatch custom events for sidebar state changes
function dispatchSidebarEvent(eventName) {
    const event = new CustomEvent(eventName, {
        detail: {
            isOpen: isSidebarOpen,
            isMobile: isMobile
        }
    });
    document.dispatchEvent(event);
}

// Add smooth animation for navigation links
function animateNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach((link, index) => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
        
        // Add click animation
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add CSS for ripple animation
function addRippleStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .nav-link {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
}

// Performance optimization: debounce resize handler
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to resize handler
const debouncedResize = debounce(handleResize, 250);
window.removeEventListener('resize', handleResize);
window.addEventListener('resize', debouncedResize);

// Accessibility improvements
function enhanceAccessibility() {
    // Add ARIA attributes
    sidebar.setAttribute('aria-label', 'Main navigation');
    toggleBtn.setAttribute('aria-expanded', isSidebarOpen);
    toggleBtn.setAttribute('aria-controls', 'sidebar');
    
    // Update ARIA attributes when sidebar state changes
    document.addEventListener('sidebarOpen', () => {
        toggleBtn.setAttribute('aria-expanded', 'true');
    });
    
    document.addEventListener('sidebarClose', () => {
        toggleBtn.setAttribute('aria-expanded', 'false');
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init();
    animateNavLinks();
    addRippleStyles();
    enhanceAccessibility();
    
    // Add a subtle loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Export functions for potential external use
window.SidebarAPI = {
    open: openSidebar,
    close: closeSidebar,
    toggle: toggleSidebar,
    isOpen: () => isSidebarOpen,
    isMobile: () => isMobile
};

