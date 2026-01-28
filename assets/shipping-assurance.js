async function fetchCart() {
  const res = await fetch('/cart.js');
  return res.json();
}

// Refresh cart drawer via AJAX
async function refreshCartDrawer() {
  try {
    const res = await fetch('/cart?view=drawer'); 
    if (!res.ok) throw new Error('Failed to fetch drawer HTML');
    const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const newDrawerContent = doc.querySelector('.cart-drawer__inner-wrapper');
    const currentDrawerContent = document.querySelector('.cart-drawer__inner-wrapper');

    if (newDrawerContent && currentDrawerContent) {
      currentDrawerContent.innerHTML = newDrawerContent.innerHTML;

      // 🔥 Reorder: move Shipping Assurance to the last
      const cartTable = currentDrawerContent.querySelector('.cart-items tbody');
      if (cartTable) {
        const shippingRow = cartTable.querySelector('tr.cart-item a[href*="shipping-assurance"]')?.closest('tr.cart-item');
        if (shippingRow) {
          cartTable.appendChild(shippingRow); // move to last
        }
      }

      // Open drawer if not already open
      const drawer = document.querySelector('#cart-drawer');
      if (drawer) drawer.classList.add('is-open');
    }
  } catch (err) {
    console.error('Error refreshing cart drawer:', err);
  }
}

async function updateAssurance() {
  if (!window.assurance?.variants?.length) return;

  console.log("update assurance")

  let cart = await fetchCart();

  // 1. Remove existing insurance variants
  const insuranceIds = window.assurance.variants.map(v => v.id);
  const insuranceInCart = cart.items.filter(i => insuranceIds.includes(i.variant_id));

  if (insuranceInCart.length > 0) {
    for (const ins of insuranceInCart) {
      await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ins.key, quantity: 0 })
      });
    }
    // Re-fetch cart after removal
    cart = await fetchCart();
  }

  // 2. Calculate subtotal (excluding insurance items)
  const cartTotal = cart.items
    .filter(i => !insuranceIds.includes(i.variant_id))
    .reduce((sum, i) => sum + i.line_price, 0) / 100;

  // 3. Find applicable insurance
  const applicable = window.assurance.variants.find(v => {
    const range = v.title.replace(/\$/g, '').split('-').map(x => x.replace(/,/g, ''));
    if (range.length === 2) return cartTotal >= +range[0] && cartTotal <= +range[1];
    if (range.length === 1) return cartTotal >= +range[0];
  });

  if (!applicable) return;

  // 4. Add the applicable insurance
  const fd = new FormData();
  fd.append('id', applicable.id);
  fd.append('quantity', 1);

  try {
    const res = await fetch('/cart/add.js', { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Status: ' + res.status);
    await res.json();

    // Refresh drawer
    await refreshCartDrawer();
  } catch (err) {
    console.error('Failed to add assurance:', err);
  }
}

Attach listener to add-to-cart buttons
document.querySelectorAll('button.product-form__submit').forEach(button => {
  button.addEventListener('click', () => {
    setTimeout(updateAssurance, 500); // adjust delay if needed
  });
});

Also trigger when cart is updated manually (e.g. qty changes)
document.addEventListener('cart:updated', updateAssurance);
