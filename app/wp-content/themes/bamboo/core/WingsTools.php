<?php

/* COMMENT AFTER TESTING ON LOCALHOST */
add_filter('http_request_host_is_external', function ($is_external, $host, $url) {
    if ($host === 'localhost' || $host === '127.0.0.1') {
        return true;
    }
    return $is_external;
}, 10, 3);

class WingsTools
{
    public static function removeDir($dir)
    {
        if (is_dir($dir)) {
            $objects = scandir($dir);
            foreach ($objects as $object) {
                if ($object != "." && $object != "..") {
                    if (is_dir($dir . '/' . $object)) {
                        self::removeDir($dir . '/' . $object);
                    } else {
                        unlink($dir . '/' . $object);
                    }
                }
            }
            rmdir($dir);
            return true;
        }
        return false;
    }

    public static function getFileFromUrl($url, $name = null)
    {
        $response = wp_remote_get($url);

        if (is_wp_error($response)) {
            return $response;
        }

        $body = wp_remote_retrieve_body($response);

        if (!$body) {
            return null;
        }

        // Select or create temp folder
        $upload_dir  = wp_upload_dir();
        $upload_path = wp_normalize_path($upload_dir['basedir'] . '/temp/');

        if (!file_exists($upload_path)) {
            wp_mkdir_p($upload_path);
        }

        // Get filename and extension
        $mime_type = wp_remote_retrieve_header($response, 'content-type');
        $filename  = wp_unique_filename($upload_path, ($name ?? "temp") . '.' . str_replace('image/', '', $mime_type));
        $filepath  = $upload_path . $filename;

        file_put_contents($filepath, $body);

        $file_array = array(
            'name'        => $filename,
            'type'        => $mime_type,
            'tmp_name'    => $filepath,
            'error'       => 0,
            'size'        => filesize($filepath),
            'remove_temp' => $filepath
        );

        return $file_array;
    }

    // Retrieve all image data for <picture> tag with WebP support
    public static function getImgArray($id, $size = 'medium')
    {
        $img  = wp_get_attachment_image_src($id, $size);
        $_img = [];

        if ($img) {

            $_img['src']    = $img[0];
            $_img['width']  = $img[1];
            $_img['height'] = $img[2];
            $_img['alt']    = trim(strip_tags(get_post_meta($id, '_wp_attachment_image_alt', true)));
            $_img['mime']   = get_post_mime_type($id);

            $mimes = ['png', 'jpg', 'jpeg', 'gif'];
            $type  = '';

            $mime = explode('/', $_img['mime']);

            if (in_array($mime[1], $mimes)) {
                $type = $mime[1];
            }

            $meta = wp_get_attachment_metadata($id);

            if (is_array($meta) && $type) {
                $size_array          = array(absint($_img['width']), absint($_img['height']));
                $src_set             = wp_calculate_image_srcset($size_array, $_img['src'], $meta, $id);
                $_img['srcset']      = ($src_set !== false) ? $src_set : $_img['src'];
                $_img['webp_srcset'] = str_replace('.' . $type, '.webp', $_img['srcset']);
                $_img['sizes']       = wp_calculate_image_sizes($size_array, $_img['src'], $meta, $id);
            }

        }

        return $_img;
    }
}
