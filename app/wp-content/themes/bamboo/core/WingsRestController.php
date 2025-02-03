<?php

/**
 * TODO: Turn on token check for authorized routes
 */
require_once ABSPATH . 'wp-load.php';
require_once ABSPATH . 'wp-admin/includes/user.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

class WingsRestController
{
    private static $routes = [
        [
            'url'      => '/user/create',
            'callback' => [__CLASS__, 'create_user']
        ],
        [
            'url'      => '/user/login',
            'callback' => [__CLASS__, 'login_user']
        ],
        [
            'url'      => '/user/login-social',
            'callback' => [__CLASS__, 'login_social']
        ],
        [
            'url'      => '/user/reset-password',
            'callback' => [__CLASS__, 'reset_user_password']
        ],
        [
            'url'      => '/get-forms',
            'callback' => [__CLASS__, 'get_forms']
        ],
        [
            'url'      => '/send-form',
            'callback' => [__CLASS__, 'send_form']
        ],
        [
            'url'      => '/buy-good',
            'callback' => [__CLASS__, 'buy_good']
        ],
        [
            'url'      => '/liqpay/callback',
            'callback' => [__CLASS__, 'liqpay_callback']
        ],
        [
            'url'      => '/liqpay/get',
            'callback' => [__CLASS__, 'liqpay_get']
        ],
        [
            'url'      => '/promo/subscribe',
            'callback' => [__CLASS__, 'promo_subscribe']
        ]
    ];

    private static $authRoutes = [
        [
            'url'      => '/user/update',
            'callback' => [__CLASS__, 'update_user']
        ],
        [
            'url'      => '/user/update-password',
            'callback' => [__CLASS__, 'update_user_password']
        ],
        [
            'url'      => '/user/logout',
            'callback' => [__CLASS__, 'logout_user']
        ],
        [
            'url'      => '/user/remove-photo',
            'callback' => [__CLASS__, 'remove_user_photo']
        ],
        [
            'url'      => '/user/delete',
            'callback' => [__CLASS__, 'delete_user']
        ],
        [
            'url'      => '/promotion/create',
            'callback' => [__CLASS__, 'create_promo']
        ],
        [
            'url'      => '/promotion/update',
            'method'   => 'POST',
            'callback' => [__CLASS__, 'update_promo']
        ],
        [
            'url' => '/promotion/delete',
            'method' => 'POST',
            'callback' => [__CLASS__, 'delete_promo']
        ],
        [
            'url' => '/promotion/get',
            'callback' => [__CLASS__, 'get_promo']
        ],
        [
            'url'      => '/promotions',
            'callback' => [__CLASS__, 'get_promos']
        ],
        [
            'url' => '/promotions/history-update',
            'callback' => [__CLASS__, 'promo_history_update']
        ],
        [
            'url' => '/promotions/history-edit',
            'callback' => [__CLASS__, 'promo_history_edit']
        ],
        [
            'url' => '/promotions/history-delete',
            'callback' => [__CLASS__, 'promo_history_delete']
        ],
        [
            'url' => 'promotions/support',
            'callback' => [__CLASS__, 'promo_support']
        ],
        [
            'url' => '/donation-sum',
            'callback' => [__CLASS__, 'project_support']
        ],
        [
            'url' => 'subscription/edit',
            'callback' => [__CLASS__, 'subscription_edit']
        ],
        [
            'url' => 'subscription/delete',
            'callback' => [__CLASS__, 'subscription_delete']
        ],
        [
            'url' => 'support/history',
            'callback' => [__CLASS__, 'support_history']
        ]
    ];

    /* MAIN CLASS METHODS */
    public static function registerRoutes()
    {

        foreach (self::$routes as $route) {
            register_rest_route('wings/v1', $route['url'], [
                'methods'  => $route['method'] ?? 'POST',
                'callback' => $route['callback']
            ]);
        }

        foreach (self::$authRoutes as $route) {
            register_rest_route('wings/v1', $route['url'], [
                'methods'             => $route['method'] ?? 'POST',
                'callback'            => $route['callback'],
                'permission_callback' => [__CLASS__, 'check_auth']
            ]);
        }
    }

    public static function check_auth(WP_REST_Request $request): bool
    {
        // return WingsToken::check($request);
        return true;
    }

    private static function validate(WP_REST_Request $request)
    {
        $params = $request->get_params();
        $files  = $request->get_file_params();

        if (!empty($files)) {
            $params['files'] = $files;
        }

        $errors = WingsValidator::validate($params);

        return $errors ?: $params;
    }

    private static function errorHandler($wp_error)
    {

        if (is_wp_error($wp_error)) {

            $code       = $wp_error->get_error_code();
            $message    = $wp_error->get_error_message();
            $error_data = $wp_error->get_error_data();

            $response_data = array(
                'code'    => $code,
                'message' => $message
            );

            if ($code == 'validation_error') {
                $response_data['fields'] = $error_data['fields'];
            }

            return new WP_REST_Response($response_data, 200);
        }

        return $wp_error;
    }

    /* USER */
    public static function create_user(WP_REST_Request $request)
    {
        $data = self::validate($request);

        if (is_wp_error($data)) {
            return self::errorHandler($data);
        }

        $new_user = WingsUser::create($data);

        if (is_wp_error($new_user)) {
            return self::errorHandler($new_user);
        }

        return $new_user;
    }

    public static function login_user(WP_REST_Request $request)
    {
        $data = self::validate($request);

        if (is_wp_error($data)) {
            return self::errorHandler($data);
        }

        $logged_in = WingsUser::login($data);

        if (is_wp_error($logged_in)) {
            return self::errorHandler($logged_in);
        }

        return $logged_in;
    }

    public static function login_social(WP_REST_Request $request)
    {

        $data = self::validate($request);

        if (is_wp_error($data)) {
            return self::errorHandler($data);
        }

        $logged_in = WingsUser::loginWithSocial($data);

        if (is_wp_error($logged_in)) {
            return self::errorHandler($logged_in);
        }

        return $logged_in;
    }

    public static function logout_user(WP_REST_Request $request)
    {
        $data = self::validate($request);

        if (is_wp_error($data)) {
            return self::errorHandler($data);
        }

        $logout = WingsUser::logout($data);

        if (is_wp_error($logout)) {
            return self::errorHandler($logout);
        }

        return $logout;
    }

    public static function update_user(WP_REST_Request $request)
    {
        $data = self::validate($request);

        if (is_wp_error($data)) {
            return self::errorHandler($data);
        }

        $updated = WingsUser::update($data);

        if (is_wp_error($updated)) {
            return self::errorHandler($updated);
        }

        return $updated;
    }

    public static function update_user_password(WP_REST_Request $request)
    {
        $data = self::validate($request);

        if (is_wp_error($data)) {
            return self::errorHandler($data);
        }

        $new_password = WingsUser::updatePassword($data);

        if (is_wp_error($new_password)) {
            return self::errorHandler($new_password);
        }

        return $new_password;
    }

    public static function reset_user_password(WP_REST_Request $request)
    {
        $data = self::validate($request);

        if (is_wp_error($data)) {
            return self::errorHandler($data);
        }

        $reset_password = WingsUser::resetPassword($data);

        if (is_wp_error($reset_password)) {
            return self::errorHandler($reset_password);
        }

        return $reset_password;
    }

    public static function remove_user_photo(WP_REST_Request $request)
    {
        $user_id      = $request->get_param('user_id');
        $remove_photo = WingsUser::removePhoto($user_id);

        if (is_wp_error($remove_photo)) {
            return self::errorHandler($remove_photo);
        }

        return $remove_photo;
    }

    public static function delete_user(WP_REST_Request $request)
    {
        $user_id = $request->get_param('user_id');
        $delete  = WingsUser::delete($user_id);

        if (is_wp_error($delete)) {
            return self::errorHandler($delete);
        }

        return $delete;
    }

    /* PROMOTIONS */
    public static function create_promo(WP_REST_Request $request)
    {
        $data = self::validate($request);

        if (is_wp_error($data)) {
            return self::errorHandler($data);
        }

        $new_promo = WingsPromo::create($data);

        if (is_wp_error($new_promo)) {
            return self::errorHandler($new_promo);
        }

        return $new_promo;
    }

    public static function update_promo(WP_REST_Request $request)
    {
        $data = self::validate($request);

        if (is_wp_error($data)) {
            return self::errorHandler($data);
        }

        $updated_promo = WingsPromo::update($data);

        if (is_wp_error($updated_promo)) {
            return self::errorHandler($updated_promo);
        }

        return $updated_promo;
    }

    public static function delete_promo(WP_REST_Request $request)
    {
        $data = self::validate($request);

        if (is_wp_error($data)) {
            return self::errorHandler($data);
        }

        $delete_promo = WingsPromo::delete($data);

        if (is_wp_error($delete_promo)) {
            return self::errorHandler($delete_promo);
        }

        return $delete_promo;
    }

    public static function get_promo(WP_REST_Request $request)
    {
        $post_id = $request->get_param('post_id');
        $promo   = WingsPromo::getSingle($post_id);

        if (is_wp_error($promo)) {
            return self::errorHandler($promo);
        }

        return $promo;
    }

    public static function get_promos(WP_REST_Request $request)
    {
        $user_id = $request->get_param('user_id');
        $status  = $request->get_param('status');

        $promos = WingsPromo::getByUser($user_id, $status);

        if (is_wp_error($promos)) {
            return self::errorHandler($promos);
        }

        return $promos;
    }

    public static function promo_history_update(WP_REST_Request $request)
    {

        $data = self::validate($request);

        if (is_wp_error($data)) {
            return self::errorHandler($data);
        }

        $historyUpdate = WingsPromo::promoHistoryUpdate($data);

        if (is_wp_error($historyUpdate)) {
            return self::errorHandler($historyUpdate);
        }

        return $historyUpdate;
    }

    public static function promo_history_edit(WP_REST_Request $request)
    {
        $data = self::validate($request);

        $post_id = $data['promo_id'];
        $item = $data['promo_edit_item'];

        $historyUpdate = WingsPromo::promoHistoryUpdate($post_id, $data, $item);

        if (is_wp_error($historyUpdate)) {
            return self::errorHandler($historyUpdate);
        }
        return $data;
    }

    public static function promo_history_delete(WP_REST_Request $request)
    {
        $data = self::validate($request);

        if (is_wp_error($data)) {
            return self::errorHandler($data);
        }

        $historyUpdate = WingsPromo::promoHistoryUpdate($data);

        if (is_wp_error($historyUpdate)) {
            return self::errorHandler($historyUpdate);
        }

        return $historyUpdate;
    }

    public static function promo_subscribe(WP_REST_Request $request)
    {

        $data = self::validate($request);

        return $data;
    }

    public static function promo_support(WP_REST_Request $request)
    {
        $data = self::validate($request);

        if (is_wp_error($data)) {
            return self::errorHandler($data);
        }

        $historyUpdate = WingsPromo::promoSupport($data);

        if (is_wp_error($historyUpdate)) {
            return self::errorHandler($historyUpdate);
        }
        return $historyUpdate;
    }

    /* FORMS */
    public static function get_forms(WP_REST_Request $request)
    {
        $form_id = $request->get_param('id');

        $form = WingsForms::getForms($form_id);

        if (is_wp_error($form)) {
            return self::errorHandler($form);
        }

        return $form;
    }

    public static function send_form(WP_REST_Request $request)
    {
        $data = self::validate($request);

        if (is_wp_error($data)) {
            return self::errorHandler($data);
        }

        $send = WingsForms::sendForm($data);

        if (is_wp_error($send)) {
            return self::errorHandler($send);
        }

        return $send;
    }

    /* SHOP */
    public static function buy_good(WP_REST_Request $request)
    {
        $data = self::validate($request);

        if (is_wp_error($data)) {
            return self::errorHandler($data);
        }

        $buy = WingsShop::buyItem($data['id'], $data['user_id']);

        if (is_wp_error($buy)) {
            return self::errorHandler($buy);
        }

        return $buy;
    }

    public static function liqpay_callback(WP_REST_Request $request)
    {
        // return WingsPayment::callback($request);
    }

    /* PROJECTS */

    public static function project_support(WP_REST_Request $request)
    {
        $data = self::validate($request);

        if (is_wp_error($data)) {
            return self::errorHandler($data);
        }

        $projectSupport = WingsProject::projectSupport($data);

        if (is_wp_error($projectSupport)) {
            return self::errorHandler($projectSupport);
        }

        return $projectSupport;
    }

    /* subscription */

    public static function subscription_edit(WP_REST_Request $request)
    {
        $data = self::validate($request);

        if (is_wp_error($data)) {
            return self::errorHandler($data);
        }

        $editSubscriptions = WingsUser::editSubscriptions($data);

        if (is_wp_error($editSubscriptions)) {
            return self::errorHandler($editSubscriptions);
        }

        return $editSubscriptions;
    }

    public static function subscription_delete(WP_REST_Request $request)
    {
        $data = self::validate($request);

        if (is_wp_error($data)) {
            return self::errorHandler($data);
        }

        $deleteSubscriptions = WingsUser::deleteSubscriptions($data);

        if (is_wp_error($deleteSubscriptions)) {
            return self::errorHandler($deleteSubscriptions);
        }

        return $deleteSubscriptions;
    }

    public static function support_history(WP_REST_Request $request)
    {
        $data = self::validate($request);

        if (is_wp_error($data)) {
            return self::errorHandler($data);
        }

        $addHistorySupport = WingsUser::addHistorySupport($data);

        if (is_wp_error($addHistorySupport)) {
            return self::errorHandler($addHistorySupport);
        }

        return $addHistorySupport;
    }
}

add_action('rest_api_init', function () {
    WingsRestController::registerRoutes();
});
