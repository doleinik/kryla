<?php

// Replace WP default login error messages
add_filter('login_errors', 'bamboo_custom_login_err_messages');
function bamboo_custom_login_err_messages($error)
{
    // we will override only the above errors and not anything else
    if (is_int(strpos($error, 'The password you entered for')) || is_int(strpos($error, 'Invalid username'))) {
        $error = 'ERROR: Oops. Wrong login information. Lost your password?';
    }

    return $error;
}

// Remove service meta tags in html
remove_action('wp_head', 'feed_links_extra', 3);
remove_action('wp_head', 'feed_links', 2);
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'index_rel_link');
remove_action('wp_head', 'parent_post_rel_link', 10, 0);
remove_action('wp_head', 'start_post_rel_link', 10, 0);
remove_action('wp_head', 'adjacent_posts_rel_link', 10, 0);
remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0);

// Disable XMLRPC
add_filter('xmlrpc_enabled', '__return_false');

// Disable users rest routes
add_filter('rest_endpoints', function ($endpoints) {
    if (isset($endpoints['/wp/v2/users'])) {
        unset($endpoints['/wp/v2/users']);
    }
    if (isset($endpoints['/wp/v2/users/(?P<id>[\d]+)'])) {
        unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);
    }
    return $endpoints;
});

// Remove scripts && styles versions
// add_filter('script_loader_src', '_remove_script_version');
// add_filter('style_loader_src', '_remove_script_version');

// function _remove_script_version($src)
// {
//     $parts = explode('?', $src);
//     return $parts[0];
// }

// Remove public REST API
// add_filter( 'rest_authentication_errors', function( $result ){
//     if( is_null( $result ) && ! current_user_can('edit_others_posts') ){
//         return new WP_Error( 'rest_forbidden', 'You are not currently logged in.', [ 'status'=>401 ] );
//     }
//     return $result;
// } );

