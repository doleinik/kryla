<?php

class WingsPayment
{

    private static $publicKey = 'sandbox_i81915749408';
    private static $privateKey = 'sandbox_GqRPY8kN3trgWGdPCB96KgwgKPwrOCzPz3Hd8jqz';

    private static function generateOrderID($item_id)
    {
        $timestamp = time();
        $randomChars = strtoupper(substr(md5(uniqid(rand(), true)), 0, 5));
        return $item_id . '-' . $timestamp . '-' . $randomChars;
    }

    public static function renderCheckout($item)
    {
        $liqpay = new LiqPay(self::$publicKey, self::$privateKey);

        $paymentRequest = [
            'action' => 'pay',
            'amount' => '1',
            'price' => $item->price,
            'currency' => 'UAH',
            'description' => 'Payment for your order: ' . $item->post_title,
            'order_id' => self::generateOrderID($item->ID),
            'version' => '3',
            // 'result_url'  => 'https://example.com/payment-successful', // redirect
            // 'server_url'  => 'https://example.com/payment-callback', // callback
            'sandbox' => 1
        ];

        $data = base64_encode(json_encode($paymentRequest));
        $signature = $liqpay->str_to_sign(self::$publicKey . $data . self::$privateKey);

        // $paymentForm = $liqpay->cnb_form($paymentRequest);
        // return $paymentForm;

        return [
            'data' => $data,
            'signature' => $signature
        ];
    }

    public static function support($item)
    {
        $liqpay = new LiqPay(self::$publicKey, self::$privateKey);

        $paymentRequest = [
            'action' => 'pay',
            'amount' => '1',
            'currency' => 'UAH',
            'description' => 'Payment for your order: ',
            'order_id' => self::generateOrderID($item->ID),
            'version' => '3',
            // 'result_url'  => 'https://example.com/payment-successful', // redirect
            // 'server_url'  => 'https://example.com/payment-callback', // callback
            'sandbox' => 1
        ];

        $data = base64_encode(json_encode($paymentRequest));
        $signature = $liqpay->str_to_sign(self::$publicKey . $data . self::$privateKey);

        return [
            'data' => $data,
            'signature' => $signature
        ];
    }

}
