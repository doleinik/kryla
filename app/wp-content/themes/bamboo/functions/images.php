<?php

// Remove quality loss for images
add_filter('jpeg_quality', 'bambukLovesHighQuality');
add_filter('wp_editor_set_quality', 'bambukLovesHighQuality');
function bambukLovesHighQuality($quality)
{
    return 100;
}

// Remove image sizes
// add_filter('intermediate_image_sizes', 'delete_intermediate_image_sizes');
function delete_intermediate_image_sizes($sizes)
{
    return array_diff($sizes, [
        // 'medium',
        // 'medium_large',
        // 'large',
        // '1536x1536',
        // '2048x2048',
        // 'woocommerce_thumbnail',
        // 'woocommerce_single',
        // 'woocommerce_gallery_thumbnail',
        // 'shop_catalog',
        // 'shop_single',
        // 'shop_thumbnail'
    ]);
}

// Custom images sizes
// add_action('after_setup_theme', 'bamboo_add_image_sizes');
function bamboo_add_image_sizes()
{
    if (function_exists('add_image_size')) {

        // Add image sizes
        add_image_size('custom', 1040, 960);
    }
}

// Get all registered image sizes
function get_image_sizes($unset_disabled = true)
{
    $wais = &$GLOBALS['_wp_additional_image_sizes'];

    $sizes = array();

    foreach (get_intermediate_image_sizes() as $_size) {
        if (in_array($_size, array('thumbnail', 'medium', 'medium_large', 'large'))) {
            $sizes[$_size] = array(
                'width'  => get_option("{$_size}_size_w"),
                'height' => get_option("{$_size}_size_h"),
                'crop'   => (bool) get_option("{$_size}_crop")
            );
        } elseif (isset($wais[$_size])) {
            $sizes[$_size] = array(
                'width'  => $wais[$_size]['width'],
                'height' => $wais[$_size]['height'],
                'crop'   => $wais[$_size]['crop']
            );
        }

        // size registered, but has 0 width and height
        if ($unset_disabled && ($sizes[$_size]['width'] == 0) && ($sizes[$_size]['height'] == 0)) {
            unset($sizes[$_size]);
        }

    }

    return $sizes;
}

