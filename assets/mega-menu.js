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
    
    // Variable to track scroll timeout
    let scrollTimeout;
    
    // Function to close all menus
    function closeAllMenus() {
        document.querySelectorAll('[id^="shopify-section-sections--18072930287678__mega_menu"]').forEach(menu => {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            menu.style.display = 'none';
        });
    }
    
    // Function to open specific menu
    function openMenu(menuSelector) {
        const menu = document.querySelector(menuSelector);
        if (menu) {
            // Apply transition
            menu.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
            menu.style.display = 'block'; // or 'flex' depending on your layout
            // Force reflow to ensure transition works
            menu.offsetHeight;
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
        }
    }
    
    // Function to handle scroll events
    function handleScroll() {
        // Clear previous timeout
        clearTimeout(scrollTimeout);
        
        // Close menus immediately when scrolling starts
        closeAllMenus();
        
        // Optional: Set a timeout to reopen menus if scrolling stops
        // Uncomment if you want this behavior
        /*
        scrollTimeout = setTimeout(function() {
            // You could add logic here to reopen the last opened menu
            // if scrolling stops and menu was previously open
            console.log('Scrolling stopped');
        }, 150);
        */
    }
    
    // Add scroll event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Add click handlers to menu items
    menuItems.forEach((item, index) => {
        item.addEventListener('click', function(event) {
            // First 3 items (indices 0,1,2) and 5th item (index 4) open menus
            if (index < 3 || index === 4) {
                event.preventDefault(); // Prevent default link behavior
                closeAllMenus();
                
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
    
    // Optional: Close menus when clicking outside
    document.addEventListener('click', function(event) {
        const isMenuItem = event.target.closest('.menu__item');
        const isMenuSection = event.target.closest('[id^="shopify-section-sections--18072930287678__mega_menu"]');
        
        if (!isMenuItem && !isMenuSection) {
            closeAllMenus();
        }
    });
    
    // Optional: Close menus on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllMenus();
        }
    });
    
    // Optional: Throttled scroll version for better performance
    // Uncomment this version and comment out the simple handleScroll above if you want throttling
    /*
    let isScrolling = false;
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                closeAllMenus();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });
    */
});