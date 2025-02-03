<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class WingsToken
{
    public static function check(WP_REST_Request $request)
    {
        $auth_header = $request->get_header('Authorization');

        if (!$auth_header) {
            return new WP_Error('invalid_token', __('Authorization header is missing', 'bamboo'), array('status' => 200));
        }

        $token = str_replace('Bearer ', '', $auth_header);

        try {
            JWT::decode($token, new Key(JWT_AUTH_SECRET_KEY, 'HS256'));
            return true;
        } catch (Exception $e) {
            return new WP_Error('invalid_token', $e->getMessage(), array('status' => 200));
        }
    }

    public static function generate($user)
    {
        $token = array(
            'sub'  => $user->ID,
            'iat'  => time(),
            // 'exp'  => time() + (5),
            'exp'  => time() + (1 * DAY_IN_SECONDS),
            'data' => array(
                'user_login' => $user->user_login,
                'user_email' => $user->user_email
            )
        );

        return JWT::encode($token, JWT_AUTH_SECRET_KEY, 'HS256');
    }

}
