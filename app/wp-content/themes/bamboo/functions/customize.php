<?php

// Detect old browsers
function detectOldBrowsers()
{
    $user_agent = $_SERVER['HTTP_USER_AGENT'];

    $deprecated_browsers = array('MSIE', 'Trident', 'Firefox/3.6', 'Opera Mini');

    foreach ($deprecated_browsers as $browser) {
        if (stripos($user_agent, $browser) !== false) {
            return true;
        }
    }

    return false;
}

// Load custom page for outdated browser
add_action('template_redirect', 'browserCheck');
function browserCheck()
{
    if (!detectOldBrowsers()) {
        return;
    }

    include get_stylesheet_directory() . '/outdated-browser.php';
    exit();
}

// Customize theme
add_action('after_setup_theme', 'customizeBambooTheme');
function customizeBambooTheme()
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', [
        'gallery',
        'caption',
        'script',
        'style'
    ]);

    // Register menu(s)
    register_nav_menus([
        'header_menu'      => 'Header menu',
        'footer_menu_prim' => 'Footer menu (primary)',
        'footer_menu_sec'  => 'Footer menu (secondary)'
    ]);

    // Load textdomain
    // load_theme_textdomain('bamboo', get_template_directory() . '/languages');
}

// Custom admin logo
add_action('login_head', function () {

    $logo = get_bloginfo('template_directory') . '/assets/img/logo.svg';

    if (file_exists($logo)) {
        echo '<style>h1 a { background-image:url(' . $logo . ')!important; background-size: contain !important;}</style>';
    }
});

// Add custom css to dashboard
add_action('admin_enqueue_scripts', 'addDashboardStyles');
function addDashboardStyles()
{
    wp_enqueue_style('admin-styles', get_stylesheet_directory_uri() . '/admin.css');
}

// Remove category & tag text before title
add_filter('get_the_archive_title', function ($title) {
    return preg_replace('~^[^:]+: ~', '', $title);
});

// Add contact info to admin
if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title'      => 'Our contacts',
        'menu_title'      => 'Our contacts',
        'menu_slug'       => 'contacts-page',
        'icon_url'        => 'dashicons-email-alt2',
        'position'        => 60,
        'redirect'        => false,
        'autoload'        => true,
        'show_in_graphql' => true
    ));
}

/* Remove admin bar for non-admin */
add_action('after_setup_theme', 'remove_admin_bar');
function remove_admin_bar()
{
    if (!current_user_can('administrator') && !is_admin()) {
        show_admin_bar(false);
    }
}

/* Block subscribers from entering dashboard */
add_action('init', 'blockDashboard');
function blockDashboard()
{
    if (is_admin() && userIs('subscriber') && !(defined('DOING_AJAX') && DOING_AJAX)) {
        wp_redirect(home_url());
        exit;
    }
}

/* Check user role */
function userIs(string $role = '', $user = null)
{
    $currentUser = $user;

    if (is_user_logged_in()) {
        $currentUser = wp_get_current_user();
    }

    $roles = $currentUser->roles ?? null;
    return ($roles && in_array($role, $roles)) ? true : false;
}

/* Change default avatar to custom user photo */
add_filter('get_avatar', 'customSubscriberAvatar', 10, 5);
function customSubscriberAvatar($avatar, $id_or_email, $size, $default, $alt)
{
    $user = false;

    if (is_numeric($id_or_email)) {
        $id   = (int) $id_or_email;
        $user = get_user_by('id', $id);
    } elseif (is_object($id_or_email)) {
        if (!empty($id_or_email->user_id)) {
            $id   = (int) $id_or_email->user_id;
            $user = get_user_by('id', $id);
        }
    } else {
        $user = get_user_by('email', $id_or_email);
    }

    if ($user && in_array('subscriber', $user->roles)) {

        $user_photo_meta = get_user_meta($user->ID, 'user_profile_photo', true);
        $user_photo = $user_photo_meta;

        if ($user_photo) {
            $src    = wp_get_attachment_image_url($user_photo);
            $avatar = "<img alt='{$alt}' src='{$src}' class='avatar avatar-{$size} photo' height='{$size}' width='{$size}' />";
        }
    }

    return $avatar;
}

/* Add promotion status to admin posts list */
add_filter('manage_promotions_posts_columns', 'promotionsColumns');
function promotionsColumns($columns)
{
    $columns['meta_field_column'] = __('Status', 'bamboo');
    return $columns;
}

add_action('manage_promotions_posts_custom_column', 'promotionsColumnsContent', 10, 2);
function promotionsColumnsContent($column, $post_id)
{
    switch ($column) {
        case 'meta_field_column':
            echo get_post_meta($post_id, 'status', true);
            break;
    }
}
