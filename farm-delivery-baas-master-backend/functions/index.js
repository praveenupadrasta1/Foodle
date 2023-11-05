const express = require('express');
var cors = require('cors');
const app = express();
const functions = require('firebase-functions');
var body_parser = require('body-parser');
const epochTimestampMiddleware = require('./middlewares/epoch-timestamp-middleware');
const attachCsrfTokenMiddleWare = require('./middlewares/attach-csrf-token-middleware');

app.use(cors());
app.use(body_parser.json()); // for parsing application/json
app.use(body_parser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(epochTimestampMiddleware); // adds timestamp field to the response body
app.use(attachCsrfTokenMiddleWare('/', 'csrfToken', (Math.random()* 100000000000000000).toString()));

// const loginRouter = require('./routes/user/login');
// const registerRouter = require('./routes/user/register');
// const helloWorldRouter = require('./routes/hello-world');
const versionRouter = require('./routes/version');
const getCitiesRouter = require('./routes/city/v1/get-cities');
// const getPincodesRouter = require('./routes/city/get-pincodes');
const bannersRouter = require('./routes/banners/v1/get-banners');
const getCustomerRouter = require('./routes/user/v1/get-customer');
const updateCustomerRouter = require('./routes/user/v1/update-customer');
const getCategoriesRouter = require('./routes/category/v1/get-categories');
const getCategoriesNFeaturedProductsRouter = require('./routes/category/v1/get-categories-n-featured-products');
const getProductsOfCategoryRouter = require('./routes/product/v1/get-category-products');
const searchProductGlobalRouter = require('./routes/product/v1/search-product-global');
const getProductVariantsRouter = require('./routes/product/v1/get-product-variants');
const createCart = require('./routes/cart/v1/create-cart');
const getShippingAddresses = require('./routes/shipping-address/v1/get-shipping-addresses');
const addShippingAddress = require('./routes/shipping-address/v1/add-shipping-address');
const applyShippingBillingAddress = require('./routes/apply-shipping-billing-address/v1/apply-shipping-billing-address');
const deleteShippingAddress = require('./routes/shipping-address/v1/delete-shipping-address');
const updateShippingAddress = require('./routes/shipping-address/v1/update-shipping-address');
const applyCoupon = require('./routes/coupons/v1/apply-coupon');
const deleteCoupon = require('./routes/coupons/v1/delete-coupon');
const createInvoice = require('./routes/payment/xen-invoice/v1/create-invoice');
const xenInvoicePaidCallback = require('./routes/xendit-callbacks/xeninvoice-callbacks/invoice-paid-callback');
// const ovoPaidCallback = require('./routes/xendit-callbacks/e-wallets-callbacks/ovo/ovo-callback');
// const danaPaidCallback = require('./routes/xendit-callbacks/e-wallets-callbacks/dana/dana-callback');
const createCodOrder = require('./routes/order/v1/create-cod-order');
const getCustomerOrders = require('./routes/order/v1/get-customer-orders');
const getOrderProducts = require('./routes/order/v1/get-order-products');
const categoryCUDBigcommerceWebhook = require('./routes/bigcommerce-webhooks/category/category-CUD');
const productCUDBigcommerceWebhook = require('./routes/bigcommerce-webhooks/products/product-CUD');
const orderCUDBigcommerceWebhook = require('./routes/bigcommerce-webhooks/order/order-CUD');
// const skuCUDBigcommerceWebhook = require('./routes/bigcommerce-webhooks/sku/sku-CUD');
const barcodeProductSearch = require('./routes/product/v1/barcode-product-search');
const getSpecifiedProducts = require('./routes/product/v1/get-specified-products');
const createProfileInBigCommerce = require('./routes/user/v1/create-customer-bigcommerce');
const createCustomerInBigCommerce = require('./routes/user/v1/create-customer-bigcommerce-direct');
const sessionToken = require('./routes/user/v1/login');

// app.use('/user/login', loginRouter);
// app.use('/user/register', registerRouter);
app.use('/v1/user', getCustomerRouter);
app.use('/v1/user', updateCustomerRouter);
app.use('/v1/login', sessionToken);
// app.use('/helloWorld', helloWorldRouter);
app.use('/version', versionRouter);
app.use('/v1/city', getCitiesRouter);
// app.use('/city', getPincodesRouter);
app.use('/v1/banners', bannersRouter);
app.use('/v1/categories', getCategoriesRouter);
app.use('/v1/categories-n-fp', getCategoriesNFeaturedProductsRouter);
app.use('/v1/products', getProductsOfCategoryRouter);
app.use('/v1/products-subset', getSpecifiedProducts);
app.use('/v1/search/product', searchProductGlobalRouter);
app.use('/v1/products/variants/', getProductVariantsRouter);
app.use('/v1/create-cart', createCart);
app.use('/v1/shipping-addresses', getShippingAddresses);
app.use('/v1/shipping-addresses', addShippingAddress);
app.use('/v1/shipping-addresses', deleteShippingAddress);
app.use('/v1/shipping-addresses', updateShippingAddress);
app.use('/v1/apply-shipping-billing-address', applyShippingBillingAddress);
app.use('/v1/coupons', applyCoupon);
app.use('/v1/coupons', deleteCoupon);
app.use('/v1/create-invoice', createInvoice);
app.use('/xen-invoice-paid', xenInvoicePaidCallback);
app.use('/v1/create-cod-order', createCodOrder);
// app.use('/ovo-paid', ovoPaidCallback);
// app.use('/dana-paid', danaPaidCallback);
app.use('/webhook/category', categoryCUDBigcommerceWebhook);
app.use('/webhook/product', productCUDBigcommerceWebhook);
app.use('/webhook/order', orderCUDBigcommerceWebhook);
// app.use('/sku-cud-bcw', skuCUDBigcommerceWebhook);
app.use('/v1/search/upc', barcodeProductSearch);
app.use('/v1/get-customer-orders', getCustomerOrders);
app.use('/v1/get-order-products', getOrderProducts);
app.use('/v1/create-customer-bc', createCustomerInBigCommerce);

exports.api = functions.region('asia-east2').https.onRequest(app);
exports.createProfileBigCommerce = createProfileInBigCommerce;

exports = this.api;