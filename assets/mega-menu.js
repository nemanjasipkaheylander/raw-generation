document.addEventListener('DOMContentLoaded', function() {
    // Get all menu items
    const menuItems = document.querySelectorAll('.menu__item');
    
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
    }
    
    // Function to open specific menu
    function openMenu(menuSelector) {
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
    });
    
    // Add click handlers to menu items
    menuItems.forEach((item, index) => {
        item.addEventListener('click', function(event) {
            // First 3 items (indices 0,1,2) and 5th item (index 4) open menus
            if (index < 3 || index === 4) {
                event.preventDefault(); // Prevent default link behavior
                
                // Map index to appropriate menu section
                if (index < 3) {
                    // First 3 items use first 3 menu sections
                    openMenu(menuSections[index]);
                } else if (index === 4) {
                    // 5th item uses the 4th menu section
                    openMenu(menuSections[3]);
                }
            }
            // 4th item (index 3) - regular link
            else {
                // Let the default link behavior happen
                console.log('Regular link clicked (4th item)');
            }
        });
    });
    
    // Close menus when clicking outside
    document.addEventListener('click', function(event) {
        const isMenuItem = event.target.closest('.menu__item');
        const isMenuSection = event.target.closest('[id^="shopify-section-sections--18072930287678__mega_menu"]');
        
        if (!isMenuItem && !isMenuSection && isAnyMenuOpen) {
            closeAllMenus();
        }
    });
    
    // Close menus on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && isAnyMenuOpen) {
            closeAllMenus();
        }
    });
    
    // Initial position set
    updateMenuTopPosition();
});