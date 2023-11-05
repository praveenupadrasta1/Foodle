module.exports = {
    // Bigcommerce api
    bigcommerce_api_host: 'api.bigcommerce.com',
    bigcommerce_port: 443,
    bigcommerce_store_hash: 'store_hash',
    X_Auth_Client: 'X_Auth_Client',
    X_Auth_Token: 'X_Auth_Token',
    bigcommerce_callback_token: 'bigcommerce_callback_token-ea0d-40dd-bigcommerce_callback_token-bigcommerce_callback_token',

    // Firebase config
    firebase_config : {
        apiKey: "apiKey",
        authDomain: "authDomain",
        databaseURL: "databaseURL",
        projectId: "farm-delivery-indo",
        storageBucket: "farm-delivery-indo.appspot.com",
        messagingSenderId: "messagingSenderId",
        appId: "1:appId",
        measurementId: "G-measurementId"
      },
    firestore_IN_query_list_threshold: 10,
    
    dev_site_base_url: 'http://localhost:8100',
    beta_site_base_url: 'https://farm-delivery-indo.web.app',
    prod_site_base_url: 'https://www.foodle.id',
    
    xendit_secret_key: 'xendit_secret_key',
    xendit_avail_invoice_payment_methods: '["BRI", "MANDIRI", "BNI", "PERMATA", "ALFAMART", "CREDIT_CARD","OVO", "DANA"]',
    xendit_callback_token: 'xendit_callback_token',

    localhost_callback_base_url: 'https://8b98fa258ae7.ngrok.io',

    CUD_bigcommerce_webhook_token: 'CUD_bigcommerce_webhook_token',

    email_settings: {
      host: 'smtppro.zoho.in',
      port: 465,
      auth: {
         user: 'no-reply@foodle.id',
         pass: 'pass@1234'
      }
    }
}