document.addEventListener('DOMContentLoaded', function() {
    // Get all menu items for both desktop and mobile
    const desktopMenuItems = document.querySelectorAll('.menu__item');
    const mobileMenuItems = document.querySelectorAll('.menu-item');
    
    // Combine all triggers
    const allMenuTriggers = [...desktopMenuItems, ...mobileMenuItems];
    
    // Menu sections mapping (indices 0,1,2 for first 3, index 4 for 5th item)
    const menuSections = [
        '#shopify-section-sections--18072930287678__mega_menu_one_yKwezG',  // for 1st item (index 0)
        '#shopify-section-sections--18072930287678__mega_menu_two_jrbXrQ',  // for 2nd item (index 1)
        '#shopify-section-sections--18072930287678__mega_menu_three_7rMQgD', // for 3rd item (index 2)
        '#shopify-section-sections--18072930287678__mega_menu_four_GrgLqr'  // for 5th item (index 4)
    ];
    
    // Store original parent for each menu section (to restore on resize)
    const originalParents = new Map();
    menuSections.forEach(selector => {
        const menu = document.querySelector(selector);
        if (menu) {
            originalParents.set(selector, menu.parentNode);
        }
    });
    
    // Variables to track state
    let isAnyMenuOpen = false;
    let lastScrollTop = 0;
    let scrollTimeout;
    let activeMenuIndex = null;
    let isMobile = window.innerWidth <= 768;
    
    // Function to check if mobile and reposition menus accordingly
    function handleResponsiveLayout() {
        const wasMobile = isMobile;
        isMobile = window.innerWidth <= 768;
        
        if (isMobile !== wasMobile) {
            if (isMobile) {
                // Switching to mobile - move menus below triggers
                moveMenusToMobile();
            } else {
                // Switching to desktop - restore menus to original positions
                restoreMenusToDesktop();
                // Close any open menus
                closeAllMenus();
            }
        }
    }
    
    // Function to move menus below their triggers on mobile
    function moveMenusToMobile() {
        menuSections.forEach((selector, index) => {
            const menu = document.querySelector(selector);
            if (!menu) return;
            
            // Find corresponding trigger (for mobile, use mobile menu items)
            let trigger = null;
            if (index < 3) {
                // First 3 menus correspond to first 3 mobile items
                trigger = mobileMenuItems[index];
            } else if (index === 3) {
                // 4th menu corresponds to 5th mobile item (index 4)
                trigger = mobileMenuItems[4];
            }
            
            if (trigger) {
                // Insert menu right after the trigger in the DOM
                trigger.parentNode.insertBefore(menu, trigger.nextSibling);
                
                // Add mobile-specific class for styling
                menu.classList.add('mega-menu--mobile');
            }
        });
    }
    
    // Function to restore menus to original positions on desktop
    function restoreMenusToDesktop() {
        menuSections.forEach(selector => {
            const menu = document.querySelector(selector);
            const originalParent = originalParents.get(selector);
            
            if (menu && originalParent) {
                // Move back to original location
                originalParent.appendChild(menu);
                
                // Remove mobile-specific class
                menu.classList.remove('mega-menu--mobile');
            }
        });
    }
    
    // Function to update menu top position based on scroll
    function updateMenuTopPosition() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const menuElements = document.querySelectorAll('[id^="shopify-section-sections--18072930287678__mega_menu"]');
        
        menuElements.forEach(menu => {
            if (!isMobile) {
                // Desktop positioning
                if (scrollPosition > 70) {
                    menu.style.top = '140px';
                } else {
                    menu.style.top = '138px';
                }
                menu.style.position = 'absolute';
            } else {
                // Mobile positioning - will be handled by CSS
                menu.style.top = '';
                menu.style.position = 'relative';
            }
        });
    }
    
    // Function to close all menus
    function closeAllMenus() {
        document.querySelectorAll('[id^="shopify-section-sections--18072930287678__mega_menu"]').forEach(menu => {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            menu.style.display = 'none';
        });
        isAnyMenuOpen = false;
        activeMenuIndex = null;
        
        // Re-enable body scroll on mobile
        document.body.style.overflow = '';
    }
    
    // Function to open specific menu
    function openMenu(menuSelector, index) {
        // Close any open menus first
        closeAllMenus();
        
        const menu = document.querySelector(menuSelector);
        if (menu) {
            // Update position before showing
            updateMenuTopPosition();
            
            // Apply transition
            menu.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
            if (!isMobile) {
                menu.style.transition += ', top 0.2s ease';
            }
            
            menu.style.display = 'block'; // or 'flex' depending on your layout
            // Force reflow to ensure transition works
            menu.offsetHeight;
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            isAnyMenuOpen = true;
            activeMenuIndex = index;
            
            // On mobile, prevent body scroll and scroll to menu
            if (isMobile) {
                document.body.style.overflow = 'hidden';
                
                // Scroll to the menu with a small delay
                setTimeout(() => {
                    menu.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    }
    
    // Function to handle scroll
    function handleScroll() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Clear any pending timeout
        clearTimeout(scrollTimeout);
        
        // Update menu positions based on scroll (desktop only)
        if (!isMobile) {
            updateMenuTopPosition();
        }
        
        // Check if actually scrolling (not just the event firing)
        if (currentScrollTop !== lastScrollTop) {
            // User is actively scrolling
            if (isAnyMenuOpen && !isMobile) {
                closeAllMenus();
                console.log('Scrolling - menus closed');
            }
            
            // Update last scroll position
            lastScrollTop = currentScrollTop;
            
            // Set timeout to detect when scrolling stops
            scrollTimeout = setTimeout(function() {
                // Scrolling has stopped
                console.log('Scrolling stopped - ready for new clicks');
            }, 150);
        }
    }
    
    // Add scroll event listener with throttle for better performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Handle resize events
    window.addEventListener('resize', function() {
        handleResponsiveLayout();
        updateMenuTopPosition();
        
        // Handle responsive behavior
        if (!isMobile && isAnyMenuOpen) {
            document.body.style.overflow = '';
        }
    });
    
    // Function to handle trigger clicks
    function handleTriggerClick(event, index) {
        // First 3 items (indices 0,1,2) and 5th item (index 4) open menus
        if (index < 3 || index === 4) {
            event.preventDefault(); // Prevent default link behavior
            
            // Map index to appropriate menu section
            if (index < 3) {
                // First 3 items use first 3 menu sections
                openMenu(menuSections[index], index);
            } else if (index === 4) {
                // 5th item uses the 4th menu section
                openMenu(menuSections[3], index);
            }
        }
        // 4th item (index 3) - regular link
        else {
            // Let the default link behavior happen
            console.log('Regular link clicked (4th item)');
        }
    }
    
    // Add click handlers to desktop menu items
    desktopMenuItems.forEach((item, index) => {
        item.addEventListener('click', function(event) {
            handleTriggerClick(event, index);
        });
    });
    
    // Add click handlers to mobile menu items
    mobileMenuItems.forEach((item, index) => {
        item.addEventListener('click', function(event) {
            handleTriggerClick(event, index);
        });
    });
    
    // Close menus when clicking outside
    document.addEventListener('click', function(event) {
        const isDesktopMenuItem = event.target.closest('.menu__item');
        const isMobileMenuItem = event.target.closest('.menu-item');
        const isMenuSection = event.target.closest('[id^="shopify-section-sections--18072930287678__mega_menu"]');
        
        if (!isDesktopMenuItem && !isMobileMenuItem && !isMenuSection && isAnyMenuOpen) {
            closeAllMenus();
        }
    });
    
    // Close menus on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && isAnyMenuOpen) {
            closeAllMenus();
        }
    });
    
    // Handle mobile drawer close events
    const mobileDrawerCloseButtons = document.querySelectorAll('.drawer__close, [data-drawer-close]');
    mobileDrawerCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (isAnyMenuOpen) {
                closeAllMenus();
            }
        });
    });
    
    // Initial setup
    handleResponsiveLayout();
    updateMenuTopPosition();
    
    // Add some CSS for mobile mega menus
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 1024px) {
            .mega-menu--mobile {
                width: 100%;
                position: relative;
                top: 0;
                left: 0;
                right: 0;
                margin-top: 10px;
                margin-bottom: 20px;
                background: white;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                z-index: 1000;
            }
            
            .menu-item.active + .mega-menu--mobile {
                display: block;
            }
        }
    `;
    document.head.appendChild(style);
});