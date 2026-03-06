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
    
    // Variables to track state
    let isAnyMenuOpen = false;
    let lastScrollTop = 0;
    let scrollTimeout;
    let activeMenuIndex = null;
    
    // Function to update menu top position based on scroll
    function updateMenuTopPosition() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const menuElements = document.querySelectorAll('[id^="shopify-section-sections--18072930287678__mega_menu"]');
        
        menuElements.forEach(menu => {
            if (scrollPosition > 70) {
                menu.style.top = '66px';
            } else {
                menu.style.top = '138px';
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
            menu.style.transition = 'opacity 0.3s ease, visibility 0.3s ease, top 0.2s ease';
            menu.style.display = 'block'; // or 'flex' depending on your layout
            // Force reflow to ensure transition works
            menu.offsetHeight;
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            isAnyMenuOpen = true;
            activeMenuIndex = index;
            
            // On mobile, you might want to prevent body scroll
            if (window.innerWidth <= 768) {
                document.body.style.overflow = 'hidden';
            }
        }
    }
    
    // Function to handle scroll
    function handleScroll() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Clear any pending timeout
        clearTimeout(scrollTimeout);
        
        // Update menu positions based on scroll
        updateMenuTopPosition();
        
        // Check if actually scrolling (not just the event firing)
        if (currentScrollTop !== lastScrollTop) {
            // User is actively scrolling
            if (isAnyMenuOpen) {
                closeAllMenus();
                // Re-enable body scroll on mobile
                document.body.style.overflow = '';
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
    
    // Also update position on resize in case header height changes
    window.addEventListener('resize', function() {
        updateMenuTopPosition();
        
        // Handle responsive behavior
        if (window.innerWidth > 768 && isAnyMenuOpen) {
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
            // Note: Mobile menu might have different structure
            // If mobile menu has different ordering, you might need to map indices differently
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
            // Re-enable body scroll on mobile
            document.body.style.overflow = '';
        }
    });
    
    // Close menus on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && isAnyMenuOpen) {
            closeAllMenus();
            // Re-enable body scroll on mobile
            document.body.style.overflow = '';
        }
    });
    
    // Handle mobile drawer close events (if your mobile drawer has a close button)
    const mobileDrawerCloseButtons = document.querySelectorAll('.drawer__close, [data-drawer-close]');
    mobileDrawerCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (isAnyMenuOpen) {
                closeAllMenus();
                document.body.style.overflow = '';
            }
        });
    });
    
    // Initial position set
    updateMenuTopPosition();
    
    // Optional: Add touch event handling for mobile
    if ('ontouchstart' in window) {
        let touchStartY = 0;
        
        document.addEventListener('touchstart', function(event) {
            touchStartY = event.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchmove', function(event) {
            const touchCurrentY = event.touches[0].clientY;
            const touchDiff = Math.abs(touchCurrentY - touchStartY);
            
            // If user is scrolling with touch and menu is open, close it
            if (touchDiff > 10 && isAnyMenuOpen) {
                closeAllMenus();
                document.body.style.overflow = '';
            }
        }, { passive: true });
    }
});