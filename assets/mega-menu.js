document.addEventListener('DOMContentLoaded', function() {
    // Get all menu items for both desktop and mobile
    const desktopMenuItems = document.querySelectorAll('.menu__item');
    const mobileMenuItems = document.querySelectorAll('.menu-item');
    const mobileMenuList = document.querySelector('ul.menu-level-1');
    
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
    
    // Create wrapper divs for mobile
    const mobileWrappers = new Map();
    
    // Variables to track state
    let isAnyMenuOpen = false;
    let lastScrollTop = 0;
    let scrollTimeout;
    let activeMenuIndex = null;
    let isMobile = window.innerWidth <= 1024;
    
    // Function to check if mobile and reposition menus accordingly
    function handleResponsiveLayout() {
        const wasMobile = isMobile;
        isMobile = window.innerWidth <= 1024;
        
        if (isMobile !== wasMobile) {
            if (isMobile) {
                // Switching to mobile - move menus inside the mobile menu list
                moveMenusToMobile();
            } else {
                // Switching to desktop - restore menus to original positions
                restoreMenusToDesktop();
                // Close any open menus
                closeAllMenus();
            }
        }
    }
    
    // Function to move menus inside the mobile menu list below corresponding li
    function moveMenusToMobile() {
        if (!mobileMenuList) return;
        
        menuSections.forEach((selector, index) => {
            const menu = document.querySelector(selector);
            if (!menu) return;
            
            // Find corresponding li trigger
            let triggerLi = null;
            if (index < 3) {
                // First 3 menus correspond to first 3 li items
                triggerLi = mobileMenuItems[index];
            } else if (index === 3) {
                // 4th menu corresponds to 5th li item (index 4)
                triggerLi = mobileMenuItems[4];
            }
            
            if (triggerLi) {
                // Create a wrapper div if it doesn't exist
                if (!mobileWrappers.has(selector)) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'mega-menu--mobile';
                    mobileWrappers.set(selector, wrapper);
                }
                
                const wrapper = mobileWrappers.get(selector);
                
                // Move the menu into the wrapper
                wrapper.appendChild(menu);
                
                // Insert the wrapper right after the trigger li
                triggerLi.parentNode.insertBefore(wrapper, triggerLi.nextSibling);
                
                // Ensure the wrapper has the correct styles
                wrapper.style.display = 'none';
                
                // The menu inside should be visible when wrapper is shown
                menu.style.position = 'relative';
                menu.style.top = '0';
                menu.style.left = '0';
                menu.style.right = 'auto';
                menu.style.width = '100%';
                menu.style.margin = '0';
            }
        });
    }
    
    // Function to restore menus to original positions on desktop
    function restoreMenusToDesktop() {
        menuSections.forEach(selector => {
            const menu = document.querySelector(selector);
            const originalParent = originalParents.get(selector);
            const wrapper = mobileWrappers.get(selector);
            
            if (menu && originalParent) {
                // Remove from wrapper
                if (wrapper && wrapper.parentNode) {
                    wrapper.parentNode.removeChild(wrapper);
                }
                
                // Move back to original location
                originalParent.appendChild(menu);
                
                // Reset menu styles
                menu.style.position = '';
                menu.style.top = '';
                menu.style.left = '';
                menu.style.right = '';
                menu.style.width = '';
                menu.style.margin = '';
            }
        });
    }
    
    // Function to update menu top position based on scroll (desktop only)
    function updateMenuTopPosition() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const menuElements = document.querySelectorAll('[id^="shopify-section-sections--18072930287678__mega_menu"]');
        
        menuElements.forEach(menu => {
            if (!isMobile) {
                // Desktop positioning
                if (scrollPosition > 70) {
                    menu.style.top = '66px';
                } else {
                    menu.style.top = '138px';
                }
                menu.style.position = 'absolute';
                menu.style.left = '0';
                menu.style.right = '0';
            }
        });
    }
    
    // Function to close all menus
    function closeAllMenus() {
        // Hide all mobile wrappers
        mobileWrappers.forEach(wrapper => {
            wrapper.style.display = 'none';
        });
        
        // Hide all desktop menus
        document.querySelectorAll('[id^="shopify-section-sections--18072930287678__mega_menu"]').forEach(menu => {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            menu.style.display = 'none';
        });
        
        isAnyMenuOpen = false;
        activeMenuIndex = null;
        
        // Remove active class from menu items
        mobileMenuItems.forEach(item => {
            item.classList.remove('active');
        });
        desktopMenuItems.forEach(item => {
            item.classList.remove('active');
        });
    }
    
    // Function to open specific menu
    function openMenu(menuSelector, index, triggerElement) {
        // Close any open menus first
        closeAllMenus();
        
        if (isMobile) {
            // Mobile: Show the wrapper
            const wrapper = mobileWrappers.get(menuSelector);
            if (wrapper) {
                wrapper.style.display = 'block';
                
                // The menu inside should be visible
                const menu = wrapper.firstElementChild;
                if (menu) {
                    menu.style.display = 'block';
                    menu.style.opacity = '1';
                    menu.style.visibility = 'visible';
                }
                
                isAnyMenuOpen = true;
                activeMenuIndex = index;
                
                // Add active class to trigger
                if (triggerElement) {
                    triggerElement.classList.add('active');
                }
                
                // Scroll to the menu
                setTimeout(() => {
                    wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        } else {
            // Desktop: Show the menu directly
            const menu = document.querySelector(menuSelector);
            if (menu) {
                updateMenuTopPosition();
                
                menu.style.transition = 'opacity 0.3s ease, visibility 0.3s ease, top 0.2s ease';
                menu.style.display = 'block';
                menu.offsetHeight;
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                
                isAnyMenuOpen = true;
                activeMenuIndex = index;
                
                if (triggerElement) {
                    triggerElement.classList.add('active');
                }
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
            // User is actively scrolling - close menus on desktop only
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
    
    // Add scroll event listener with throttle
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
        
        if (!isMobile && isAnyMenuOpen) {
            closeAllMenus();
        }
    });
    
    // Function to handle trigger clicks
    function handleTriggerClick(event, index, triggerElement) {
        // First 3 items (indices 0,1,2) and 5th item (index 4) open menus
        if (index < 3 || index === 4) {
            event.preventDefault(); // Prevent default link behavior
            
            // Map index to appropriate menu section
            if (index < 3) {
                // First 3 items use first 3 menu sections
                openMenu(menuSections[index], index, triggerElement);
            } else if (index === 4) {
                // 5th item uses the 4th menu section
                openMenu(menuSections[3], index, triggerElement);
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
            handleTriggerClick(event, index, item);
        });
    });
    
    // Add click handlers to mobile menu items (li.menu-item)
    mobileMenuItems.forEach((item, index) => {
        item.addEventListener('click', function(event) {
            handleTriggerClick(event, index, item);
        });
    });
    
    // Close menus when clicking outside
    document.addEventListener('click', function(event) {
        const isDesktopMenuItem = event.target.closest('.menu__item');
        const isMobileMenuItem = event.target.closest('.menu-item');
        const isMenuSection = event.target.closest('[id^="shopify-section-sections--18072930287678__mega_menu"]');
        const isMobileWrapper = event.target.closest('.mega-menu--mobile');
        
        if (!isDesktopMenuItem && !isMobileMenuItem && !isMenuSection && !isMobileWrapper && isAnyMenuOpen) {
            closeAllMenus();
        }
    });
    
    // Close menus on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && isAnyMenuOpen) {
            closeAllMenus();
        }
    });
    
    // Initial setup
    handleResponsiveLayout();
    updateMenuTopPosition();
    
    // Add CSS for mobile mega menus
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 1024px) {
            ul.menu-level-1 {
                position: relative;
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .menu-item {
                padding: 15px 20px;
                border-bottom: 1px solid #eee;
            }
            
            .menu-item.active {
                background-color: #f5f5f5;
            }
            
            .mega-menu--mobile {
                width: 100%;
                background: #fff;
                border-bottom: 1px solid #eee;
                padding: 0;
                margin: 0;
            }
            
            .mega-menu--mobile > div {
                width: 100%;
                padding: 20px;
                box-sizing: border-box;
            }
            
            .mega-menu--mobile > div[class*="shopify-section"] {
                opacity: 1 !important;
                visibility: visible !important;
                display: block !important;
                position: relative !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
            }
        }
    `;
    document.head.appendChild(style);
});