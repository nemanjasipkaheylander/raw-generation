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
    
    // Variable to track if any menu is open
    let isAnyMenuOpen = false;
    
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
        const menu = document.querySelector(menuSelector);
        if (menu) {
            // Apply transition
            menu.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
            menu.style.display = 'block'; // or 'flex' depending on your layout
            // Force reflow to ensure transition works
            menu.offsetHeight;
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            isAnyMenuOpen = true;
        }
    }
    
    // Function to handle scroll start
    function handleScrollStart() {
        if (isAnyMenuOpen) {
            closeAllMenus();
            console.log('Scrolling started - menus closed');
        }
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScrollStart, { passive: true });
    
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
    
    // Optional: Close menus when clicking outside
    document.addEventListener('click', function(event) {
        const isMenuItem = event.target.closest('.menu__item');
        const isMenuSection = event.target.closest('[id^="shopify-section-sections--18072930287678__mega_menu"]');
        
        if (!isMenuItem && !isMenuSection && isAnyMenuOpen) {
            closeAllMenus();
        }
    });
    
    // Optional: Close menus on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && isAnyMenuOpen) {
            closeAllMenus();
        }
    });
});