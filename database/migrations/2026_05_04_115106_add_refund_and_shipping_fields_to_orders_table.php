<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('razorpay_refund_id')->nullable()->after('razorpay_payment_id');
            $table->decimal('refund_amount', 12, 2)->nullable()->after('razorpay_refund_id');
            $table->string('refund_status')->nullable()->after('refund_amount');
            $table->string('shipping_provider')->nullable()->after('tracking_number');
            $table->string('shipping_label_url')->nullable()->after('shipping_provider');
            $table->string('shipping_manifest_id')->nullable()->after('shipping_label_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'razorpay_refund_id',
                'refund_amount',
                'refund_status',
                'shipping_provider',
                'shipping_label_url',
                'shipping_manifest_id'
            ]);
        });
    }
};
