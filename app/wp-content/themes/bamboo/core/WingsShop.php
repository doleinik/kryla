<?php

class WingsShop
{
    public static function buyItem(int $id = null, $userId)
    {
        $item = get_post($id);

        if ($item && $item->post_type === 'goods') {
            $item->price = get_field('price', $item->ID);

            $checkoutForm = WingsPayment::renderCheckout($item);
            if (is_wp_error($checkoutForm)) {
                return $checkoutForm;
            }

            $user = get_user_by('id', $userId);
            if (is_wp_error($user)) {
                return $user;
            }

            $login = $user->user_login;
            $name = $user->display_name;
            $phone = get_user_meta($userId, 'user_profile_phone', true);

            // Set the email subject
            $subject = 'Замовлення з магазину Крила Надії';

            // Set the email message
            $message = sprintf(__('Ім`я: %s') . "\r\n\r\n", $name);
            $message .= sprintf(__('Пошта: %s') . "\r\n\r\n", $login);
            $message .= sprintf(__('Телефон: %s') . "\r\n\r\n", $phone);
            $message .= sprintf(__('Товар: %s') . "\r\n\r\n", $item->post_title);
            $message .= sprintf(__('Ціна: %s грн') . "\r\n\r\n", $item->price);

            // Filter the email message
            $message = apply_filters('retrieve_password_message', $message, $login, $user);

            // Send the email
            $reset_send = wp_mail($user->user_email, $subject, $message);

            if (is_wp_error($reset_send)) {
                return $reset_send;
            }
        }
        return [
            'code' => 'success',
        ];
    }
}
