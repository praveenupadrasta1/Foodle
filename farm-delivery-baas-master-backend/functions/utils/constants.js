module.exports = {
    // Firebase Login JSON Keys
    displayName: 'displayName',

    // Firestore Collection and Document names/IDs
        // Collection names/IDs
        city: 'city',
            //Field names
            pincodes: 'pincodes',
            valid: 'valid',
            province: 'province',
            order_accept_before_n_hours: 'order_accept_before_n_hours',
            next_n_days_accept_orders: 'next_n_days_accept_orders',
            delivery_timings: 'delivery_timings',
            same_day_delivery: 'same_day_delivery',
            timezone: 'timezone',

        version: 'version',
            // Version Document names/IDs
            new_version: 'new',
            force_update: 'force_update',
            version_field: 'version',

        banners: 'banners',
    
    // Cart API JSON keys.
        // Frontend to Firebase API call JSON keys
            line_items: 'line_items',
            product_id: 'product_id',
            variant_id: 'variant_id',
            quantity: 'quantity',
            delivery_data: 'delivery_data',
            area: 'area',
            date: 'date',
            time: 'time',
        
        // BigCommerce to Firebase get product variants JSON Keys
            option_values: 'option_values',
            // Option_values JSON keys
                label: 'label',
            inventory_level: 'inventory_level',
            id: 'id',
            purchasing_disabled: 'purchasing_disabled',
        
        // Firebase to BigCommerce Cart creation API JSON keys
            customer_id: 'customer_id',
        
        // Apply Shipping Address to checkout API JSON Keys
            shipping_address: 'shipping_address',
            country_code: 'country_code',
            state_or_province: 'state_or_province',
            state_or_province_code: 'state_or_province_code',
            email: 'email',
            item_id: 'item_id',
            physical_items: 'physical_items',

        // Apply Shipping Options to Checkout API JSON Keys
            consignments: 'consignments',
            available_shipping_options: 'available_shipping_options',
            type: 'type',
            description: 'description',
            shipping_option_id: 'shipping_option_id',
    
        // Get Checkout API JSON keys
            grand_total: 'grand_total',

    // Shipping addresses API
        // Add Shipping address API JSON keys
        city_data: 'city_data',

    // Coupons API
        coupons: 'coupons',
        coupon_code: 'coupon_code',
    
    // Order API JSON Keys
        // Update Order
        customer_message: 'customer_message',
        status_id: 'status_id',
        payment_provider_id: 'payment_provider_id',
        staff_notes: 'staff_notes',
        payment_method: 'payment_method',

    // Xendit Payment Gateway API JSON keys
        payerEmail: 'payerEmail',
        externalID: 'externalID',
        paymentMethods: 'paymentMethods',
        shouldSendEmail: 'shouldSendEmail',
        invoiceDuration: 'invoiceDuration',
        successRedirectURL: 'successRedirectURL',
        failureRedirectURL: 'failureRedirectURL',
        currency: 'currency',
        amount: 'amount',
        ewalletType: 'ewalletType',
        expirationDate: 'expirationDate',
        callbackURL: 'callbackURL',
        redirectURL: 'redirectURL',

    // BigCommerce create/update/delete webhook API JSON Keys
        scope: 'scope',
        destination: 'destination',
        headers: 'headers',
        x_callback_token: 'x-callback-token',

        // BigCommerce webhook collection in cloud firestore keys
        col_bigcommerce_webhooks: 'bigcommerce-webhooks',
        doc_category: 'category',
        doc_product: 'product',
    
    firestore: {
        categories_collection_id: 'categories',
        products_collection_id: 'products',
        customers_collection_id: 'customers',
        promotion_stores_collection_id: 'promotion-stores'
    },

    // Email
    no_reply_email_id: 'no-reply@foodle.id',
    
}