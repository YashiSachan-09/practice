<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    public const STATUSES = [
        'pending',
        'confirmed',
        'packed',
        'shipped',
        'delivered',
        'cancelled',
    ];

    public const PAYMENT_STATUSES = [
        'pending',
        'paid',
        'failed',
        'refunded',
    ];

    protected $fillable = [
        'order_number',
        'customer_name',
        'customer_email',
        'customer_phone',
        'shipping_address',
        'subtotal',
        'tax',
        'shipping_fee',
        'total',
        'status',
        'payment_status',
        'razorpay_order_id',
        'razorpay_payment_id',
        'confirmed_at',
        'packed_at',
        'shipped_at',
        'delivered_at',
        'cancelled_at',
        'tracking_number',
        'admin_notes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'tax' => 'decimal:2',
            'shipping_fee' => 'decimal:2',
            'total' => 'decimal:2',
            'confirmed_at' => 'datetime',
            'packed_at' => 'datetime',
            'shipped_at' => 'datetime',
            'delivered_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    /**
     * @return HasMany<OrderItem, Order>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function syncProgressTimestamps(): void
    {
        $now = now();

        if ($this->status === 'cancelled') {
            $this->cancelled_at ??= $now;

            return;
        }

        if (in_array($this->status, ['confirmed', 'packed', 'shipped', 'delivered'], true)) {
            $this->confirmed_at ??= $now;
        }
        if (in_array($this->status, ['packed', 'shipped', 'delivered'], true)) {
            $this->packed_at ??= $now;
        }
        if (in_array($this->status, ['shipped', 'delivered'], true)) {
            $this->shipped_at ??= $now;
        }
        if ($this->status === 'delivered') {
            $this->delivered_at ??= $now;
        }
    }
}
