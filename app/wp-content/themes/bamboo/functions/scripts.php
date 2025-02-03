<?php

// Load CSS & JS
add_action('wp_enqueue_scripts', function () {

    // Disable caching of scripts & styles in dev mode
    $cache         = microtime();
    // $cache         = (WP_DEBUG) ? microtime() : null;
    $load_js_after = null;

    // Deregister/register Jquery
    if (!is_admin()) {
        wp_deregister_script('jquery');
        // wp_enqueue_script('jquery', '//code.jquery.com/jquery-3.6.0.min.js', null, null, true);
    }

    // Check if jQuery is registered
    if (wp_script_is('jquery', 'registered')) {
        $load_js_after = ['jquery'];
    }

    wp_enqueue_style('styles', get_template_directory_uri() . '/assets/css/styles.css', null, $cache);
    wp_enqueue_script('scripts', get_template_directory_uri() . '/assets/js/scripts.js', $load_js_after, $cache, true);

    // Set local js vars
    wp_localize_script('scripts', 'BAMBOO', [
        'baseUrl' => home_url(),
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'assets'  => get_template_directory_uri() . '/assets/',
        'restapi' => esc_url_raw(rest_url('wings/v1/')),
        'graphql' => esc_url_raw(home_url('graphql')),
        'nonce'   => wp_create_nonce('wp_rest')
    ]);
});

// Disable CF7 default styles & scripts
// add_filter( 'wpcf7_load_css', '__return_false' );
// add_filter( 'wpcf7_load_js', '__return_false' );

/// Remove unused WP СSS
add_action('wp_enqueue_scripts', 'bamboo_remove_needless_css', 100);
function bamboo_remove_needless_css()
{
    // Remove Gutenberg Block Library CSS
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    // Remove WooCommerce block CSS
    wp_dequeue_style('wc-block-style');
    // Remove theme.json
    wp_dequeue_style('global-styles');
    wp_dequeue_style('classic-theme-styles');
}

// Remove WP FSE Scripts & styles
add_action('after_setup_theme', function () {

    // remove SVG and global styles
    remove_action('wp_enqueue_scripts', 'wp_enqueue_global_styles');

    // remove wp_footer actions which add's global inline styles
    remove_action('wp_footer', 'wp_enqueue_global_styles', 1);

    // remove render_block filters which adding unnecessary stuff
    remove_filter('render_block', 'wp_render_duotone_support');
    remove_filter('render_block', 'wp_restore_group_inner_container');
    remove_filter('render_block', 'wp_render_layout_support_flag');
});
