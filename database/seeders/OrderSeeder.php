<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        if (Order::query()->exists()) {
            return;
        }

        $specs = [
            [
                'order_number' => 'AN-2026-01045',
                'customer_name' => 'Meera Joshi',
                'customer_email' => 'meera.joshi@example.com',
                'customer_phone' => '+91 98765 43210',
                'shipping_address' => "12 Lavelle Road\nBengaluru 560001",
                'subtotal' => 18990,
                'tax' => 3418.2,
                'shipping_fee' => 0,
                'total' => 22408.2,
                'status' => 'delivered',
                'payment_status' => 'paid',
                'confirmed_at' => now()->subDays(8),
                'packed_at' => now()->subDays(7),
                'shipped_at' => now()->subDays(6),
                'delivered_at' => now()->subDays(4),
                'tracking_number' => 'BLR-DEL-99231',
                'items' => [
                    ['product_name' => 'Heritage canvas — Dawn I', 'sku' => 'CV-DN-01', 'quantity' => 1, 'unit_price' => 18990, 'line_total' => 18990],
                ],
            ],
            [
                'order_number' => 'AN-2026-01046',
                'customer_name' => 'Arun Deshpande',
                'customer_email' => 'arun.d@example.com',
                'customer_phone' => '+91 91234 55678',
                'shipping_address' => "403 Palm Grove\nMumbai 400050",
                'subtotal' => 5600,
                'tax' => 1008,
                'shipping_fee' => 150,
                'total' => 6758,
                'status' => 'shipped',
                'payment_status' => 'paid',
                'confirmed_at' => now()->subDays(3),
                'packed_at' => now()->subDays(2),
                'shipped_at' => now()->subDay(),
                'tracking_number' => 'MUM-SHP-44102',
                'items' => [
                    ['product_name' => 'Limited lithograph — Monsoon', 'sku' => 'LT-MN-14', 'quantity' => 2, 'unit_price' => 2800, 'line_total' => 5600],
                ],
            ],
            [
                'order_number' => 'AN-2026-01047',
                'customer_name' => 'Sana Khan',
                'customer_email' => 'sana.k@example.com',
                'customer_phone' => null,
                'shipping_address' => "92 MG Road\nPune 411001",
                'subtotal' => 12499,
                'tax' => 2249.82,
                'shipping_fee' => 0,
                'total' => 14748.82,
                'status' => 'packed',
                'payment_status' => 'paid',
                'confirmed_at' => now()->subDays(2),
                'packed_at' => now()->subDay(),
                'items' => [
                    ['product_name' => 'Oak frame — medium', 'sku' => 'FR-OK-M', 'quantity' => 1, 'unit_price' => 2499, 'line_total' => 2499],
                    ['product_name' => 'Canvas print — Midnight', 'sku' => 'CV-MN-09', 'quantity' => 1, 'unit_price' => 10000, 'line_total' => 10000],
                ],
            ],
            [
                'order_number' => 'AN-2026-01048',
                'customer_name' => 'Vikram Nair',
                'customer_email' => 'vikram.nair@example.com',
                'customer_phone' => '+91 99887 66554',
                'shipping_address' => "21 Marine Drive\nKochi 682031",
                'subtotal' => 4500,
                'tax' => 810,
                'shipping_fee' => 120,
                'total' => 5430,
                'status' => 'confirmed',
                'payment_status' => 'paid',
                'confirmed_at' => now()->subHours(18),
                'items' => [
                    ['product_name' => 'Ceramic sculpture — Wave', 'sku' => 'SC-WV-03', 'quantity' => 1, 'unit_price' => 4500, 'line_total' => 4500],
                ],
            ],
            [
                'order_number' => 'AN-2026-01049',
                'customer_name' => 'Priya Malhotra',
                'customer_email' => 'priya.m@example.com',
                'customer_phone' => '+91 98100 11223',
                'shipping_address' => "88 Sector 17\nChandigarh 160017",
                'subtotal' => 3200,
                'tax' => 576,
                'shipping_fee' => 0,
                'total' => 3776,
                'status' => 'pending',
                'payment_status' => 'pending',
                'items' => [
                    ['product_name' => 'Desk study — Graphite series', 'sku' => 'PR-GS-22', 'quantity' => 1, 'unit_price' => 3200, 'line_total' => 3200],
                ],
            ],
            [
                'order_number' => 'AN-2026-01050',
                'customer_name' => 'Rahul Verma',
                'customer_email' => 'rahul.v@example.com',
                'customer_phone' => '+91 90909 80808',
                'shipping_address' => "Plot 4 DLF Phase 3\nGurugram 122002",
                'subtotal' => 8900,
                'tax' => 1602,
                'shipping_fee' => 200,
                'total' => 10702,
                'status' => 'cancelled',
                'payment_status' => 'refunded',
                'confirmed_at' => now()->subDays(5),
                'cancelled_at' => now()->subDays(4),
                'admin_notes' => 'Customer requested cancellation before dispatch.',
                'items' => [
                    ['product_name' => 'Heritage canvas — Dawn II', 'sku' => 'CV-DN-02', 'quantity' => 1, 'unit_price' => 8900, 'line_total' => 8900],
                ],
            ],
        ];

        foreach ($specs as $row) {
            $items = $row['items'];
            unset($row['items']);

            $order = Order::query()->create($row);

            foreach ($items as $line) {
                OrderItem::query()->create([
                    'order_id' => $order->id,
                    'product_name' => $line['product_name'],
                    'sku' => $line['sku'],
                    'quantity' => $line['quantity'],
                    'unit_price' => $line['unit_price'],
                    'line_total' => $line['line_total'],
                ]);
            }
        }
    }
}
