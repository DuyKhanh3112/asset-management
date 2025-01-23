import instance from './instance';
export function getAccountPaymentResFileApi() {
    return instance.get('/api/get-account-payment-res-file')
}