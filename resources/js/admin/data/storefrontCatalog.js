/**
 * Mirrors `resources/views/pages/marketplace.blade.php` grid + hero imagery
 * so admin “Products” previews match the live storefront.
 */
export const MARKETPLACE_HERO_IMAGE =
    'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1400&q=80';

/** @typedef {{ image: string, title: string, blurb: string, hint: string }} StorefrontListing */

/** @type {StorefrontListing[]} */
export const MARKETPLACE_COLLECTIONS = [
    {
        image:
            'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80',
        title: 'Abstract Paintings',
        blurb: 'Curated inventory, transparent details, and seamless buying flow.',
        hint: 'Collector-grade listings · edition notes on site',
    },
    {
        image:
            'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80',
        title: 'Sculpture',
        blurb: 'Curated inventory, transparent details, and seamless buying flow.',
        hint: 'Documentation + provenance mirrored on marketplace',
    },
    {
        image:
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
        title: 'Fine Art Prints',
        blurb: 'Curated inventory, transparent details, and seamless buying flow.',
        hint: 'Same card layout customers see when purchasing',
    },
    {
        image:
            'https://images.unsplash.com/photo-1459908676235-d5f02a50184b?auto=format&fit=crop&w=900&q=80',
        title: 'Modern Minimal',
        blurb: 'Curated inventory, transparent details, and seamless buying flow.',
        hint: 'Hero imagery matches public marketplace',
    },
    {
        image:
            'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?auto=format&fit=crop&w=900&q=80',
        title: 'Contemporary Icons',
        blurb: 'Curated inventory, transparent details, and seamless buying flow.',
        hint: 'Opens the live buy flow in a new tab',
    },
    {
        image:
            'https://images.unsplash.com/photo-1577720643272-265f09367456?auto=format&fit=crop&w=900&q=80',
        title: 'Gallery Editions',
        blurb: 'Curated inventory, transparent details, and seamless buying flow.',
        hint: 'Typography: Cormorant + Outfit from site CSS',
    },
];
