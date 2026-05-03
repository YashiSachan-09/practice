<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Razorpay API keys (Dashboard → Account & Settings → API Keys)
    |--------------------------------------------------------------------------
    */
    'key_id' => env('RAZORPAY_KEY_ID'),

    'key_secret' => env('RAZORPAY_KEY_SECRET'),

    /**
     * Webhooks → Signing secret from Razorpay dashboard (optional).
     */
    'webhook_secret' => env('RAZORPAY_WEBHOOK_SECRET'),

    /*
    |--------------------------------------------------------------------------
    | When both keys are set, checkout redirects to Razorpay before confirmation.
    | Set keys empty to use guest checkout without online payment (pending payment).
    |--------------------------------------------------------------------------
    */
    'enabled' => filled(env('RAZORPAY_KEY_ID')) && filled(env('RAZORPAY_KEY_SECRET')),

];
