export const flyToCart = (
    startEl: HTMLElement,
    cartSelectorDesktop: string,
    cartSelectorMobile: string,
    imageSrc?: string
) => {
    // 1. Identify the Visible Cart Target
    let cartEl = document.querySelector(cartSelectorDesktop) as HTMLElement;

    // If desktop cart is hidden (offsetParent is null) or not found, try mobile
    if (!cartEl || cartEl.offsetParent === null) {
        cartEl = document.querySelector(cartSelectorMobile) as HTMLElement;
    }

    if (!cartEl) {
        console.warn('FlyToCart: No visible cart element found.');
        return;
    }

    // 2. Get Coordinates
    const startRect = startEl.getBoundingClientRect();
    const endRect = cartEl.getBoundingClientRect();

    // 3. Create Flying Element
    const flyingEl = document.createElement('div');
    flyingEl.style.position = 'fixed';
    flyingEl.style.zIndex = '9999';
    flyingEl.style.left = `${startRect.left}px`;
    flyingEl.style.top = `${startRect.top}px`;
    flyingEl.style.width = `${startRect.width}px`;
    flyingEl.style.height = `${startRect.height}px`;
    flyingEl.style.pointerEvents = 'none';
    flyingEl.style.transition = 'all 700ms cubic-bezier(0.2, 0.8, 0.2, 1)'; // Smooth easing
    flyingEl.style.opacity = '0.8';

    if (imageSrc) {
        const img = document.createElement('img');
        img.src = imageSrc;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        flyingEl.appendChild(img);
    } else {
        // Fallback: Green dot
        flyingEl.style.backgroundColor = '#00FF00'; // nppro-green
        flyingEl.style.borderRadius = '50%';
        flyingEl.style.width = '20px'; // Force smaller size for dot
        flyingEl.style.height = '20px';
    }

    document.body.appendChild(flyingEl);

    // 4. Trigger Animation (Force reflow first)
    // requestAnimationFrame ensures the initial state is rendered before changing it
    requestAnimationFrame(() => {
        // Force reflow
        void flyingEl.offsetWidth;

        // Set final state
        const targetWidth = 20; // Target size in cart
        const targetHeight = 20;

        // Center the target coordinates relative to the cart icon center
        const targetLeft = endRect.left + (endRect.width / 2) - (targetWidth / 2);
        const targetTop = endRect.top + (endRect.height / 2) - (targetHeight / 2);

        flyingEl.style.left = `${targetLeft}px`;
        flyingEl.style.top = `${targetTop}px`;
        flyingEl.style.width = `${targetWidth}px`;
        flyingEl.style.height = `${targetHeight}px`;
        flyingEl.style.opacity = '0.2';
        flyingEl.style.transform = 'scale(0.5)'; // Add a shrink effect
    });

    // 5. Cleanup
    flyingEl.addEventListener('transitionend', () => {
        if (flyingEl.parentNode) {
            flyingEl.parentNode.removeChild(flyingEl);
        }
    });
};
