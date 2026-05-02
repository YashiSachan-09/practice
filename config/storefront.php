<?php

return [
    /**
     * GST-style rate applied to the sum of line totals (server-side only; never trust the browser).
     */
    'tax_rate' => (float) env('STOREFRONT_TAX_RATE', 0.18),

    /**
     * Flat shipping in INR for the whole order (0 = free shipping for now).
     */
    'shipping_flat_inr' => (float) env('STOREFRONT_SHIPPING_FLAT', 0),

    /**
     * Price list for guest checkout. Keys are SKUs; prices must match what you show in the UI.
     */
    'catalog' => [
        'CV-DN-01' => ['name' => 'Heritage canvas — Dawn I', 'unit_price' => 18990.00],
        'LT-MN-14' => ['name' => 'Limited lithograph — Monsoon', 'unit_price' => 2800.00],
        'FR-OK-M' => ['name' => 'Oak frame — medium', 'unit_price' => 2499.00],
        'CV-MN-09' => ['name' => 'Canvas print — Midnight', 'unit_price' => 10000.00],
        'SC-WV-03' => ['name' => 'Ceramic sculpture — Wave', 'unit_price' => 4500.00],
        'PR-GS-22' => ['name' => 'Desk study — Graphite series', 'unit_price' => 3200.00],
    ],
];
