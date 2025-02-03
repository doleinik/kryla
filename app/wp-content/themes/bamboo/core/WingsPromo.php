<?php

class WingsPromo
{
    public static function getByUser($user_id, $status = null)
    {
        $posts = [];

        $args = array(
            'author' => $user_id,
            'post_type' => 'promotions',
            'post_status' => 'any',
            'posts_per_page' => -1
        );

        if ($status) {
            $args['meta_query'] = [
                [
                    'key' => 'status',
                    'value' => $status,
                    'compare' => '='
                ]
            ];
        }

        $query = new WP_Query($args);

        if ($query->have_posts()) {
            foreach ($query->posts as $post) {
                $posts["data"][] = self::getSingle($post->ID, true);
            }
            return $posts;
        } else {
            return [
                'message' => __('You do not have any promotions yet!', 'bamboo')
            ];
        }
    }

    public static function getSingle($post_id, $short = false)
    {

        $post = get_post($post_id);

        if (!$post) {
            return null;
        }

        $thumbnail_url = '';

        if (has_post_thumbnail($post_id)) {
            $thumbnail_id = get_post_thumbnail_id($post_id);
            $thumbnail_arr = WingsTools::getImgArray($thumbnail_id);

            $thumbnail_alt = get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true);
            $thumbnail_size = 'medium';
            $thumbnail = wp_get_attachment_image($thumbnail_id, $thumbnail_size, false, array(
                'class' => 'post-thumbnail',
                'alt' => $thumbnail_alt
            ));
        }

        $promo_data = [
            'promo_title' => $post->post_title,
            'promo_link' => get_permalink($post_id),
            'promo_id' => $post_id,
            'post_status' => $post->post_status,
            'promo_status' => get_field('status', $post_id),
            'promo_featured_image' => $thumbnail ?? null,
            'promo_featured_image_arr' => $thumbnail_arr ?? null,
            'promo_contact_person' => get_field('contact_person', $post_id),
            'promo_contact_phone' => get_field('contact_phone', $post_id),
            'promo_sum' => get_field('sum', $post_id),
            'promo_collected' => get_field('collected', $post_id),
            'promo_excerpt' => get_field('excerpt', $post_id)

        ];

        if (!$short) {
            $promo_data['promo_description'] = get_field('description', $post_id);
        }

        return $promo_data;
    }

    public static function create($data)
    {
        $promo_data = [
            'post_type' => 'promotions',
            'post_status' => 'draft',
            'post_author' => $data['user_id'],
            'post_title' => $data['promo_title'],
            'meta_input' => [
                'status' => 'pending',
                'excerpt' => $data['promo_excerpt'],
                'contact_person' => $data['promo_contact_person'],
                'contact_phone' => $data['promo_contact_phone'],
                'sum' => $data['promo_sum'],
                'description' => $data['promo_description']
            ]
        ];

        $post_id = wp_insert_post($promo_data);

        if (is_wp_error($post_id)) {
            return new WP_Error('create_post_error', $post_id->get_error_message());
        }

        // Upload the featured image to the media library
        $featured = self::setFeaturedImage($post_id, 'promo_featured_image');

        if (is_wp_error($featured)) {
            return $featured;
        }

        return [
            'code' => 'success',
            'message' => [
                "title" => __('Promotion successfully created!', 'bamboo'),
                "subtitle" => __('Fund moderators are reviewing your request', 'bamboo')
            ]
        ];
    }

    public static function update($data)
    {
        $post_id = $data['post_id'];

        $promo_data = [
            'ID' => $post_id,
            'post_type' => 'promotions',
            'post_status' => 'draft',
            'post_title' => $data['promo_title'],
            'meta_input' => [
                'status' => 'pending',
                'excerpt' => $data['promo_excerpt'],
                'contact_person' => $data['promo_contact_person'],
                'contact_phone' => $data['promo_contact_phone'],
                'sum' => $data['promo_sum'],
                'description' => $data['promo_description']
            ]
        ];

        $updated = wp_update_post($promo_data);

        if (is_wp_error($updated)) {
            return new WP_Error('create_post_error', $updated->get_error_message());
        }

        // Update featured image
        if (isset($data['files']) && isset($data['files']['promo_featured_image'])) {

            $featured = self::setFeaturedImage($post_id, 'promo_featured_image');

            if (is_wp_error($featured)) {
                return $featured;
            }
        }

        return [
            'code' => 'success',
            'message' => [
                "title" => __('Promotion successfully updated!', 'bamboo'),
                "subtitle" => __('Fund moderators are reviewing your request', 'bamboo')
            ]
        ];
    }

    public static function delete($data)
    {
        $post_id = $data['promo_id'];

        $deleted = wp_delete_post($post_id);

        if (is_wp_error($deleted)) {
            return new WP_Error('create_post_error', $deleted->get_error_message());
        }
        return [
            'code' => 'success',
            'message' => [
                "title" => __('Promotion successfully delete!', 'bamboo'),
                "subtitle" => __('Fund moderators are reviewing your request', 'bamboo')
            ]
        ];
    }

    public static function deletePromoAttachments($post_id)
    {
        $attachment_ids = [];
        $featured_image_id = get_post_thumbnail_id($post_id);

        $args = array(
            'post_type' => 'attachment',
            'posts_per_page' => -1,
            'post_status' => 'any',
            'post_parent' => $post_id
        );

        $attachments = get_posts($args);

        foreach ($attachments as $attachment) {
            $attachment_ids[] = $attachment->ID;
        }

        if ($featured_image_id) {
            array_push($attachment_ids, $featured_image_id);
        }

        foreach ($attachment_ids as $id) {
            wp_delete_attachment($id, true);
        }
    }

    private static function setFeaturedImage($post_id, $file_key)
    {

        // Delete the existing featured image from the media library
        $existing_featured_image_id = get_post_thumbnail_id($post_id);

        if ($existing_featured_image_id) {
            wp_delete_attachment($existing_featured_image_id, true);
        }

        $upload = media_handle_upload($file_key, 0);

        if (is_wp_error($upload)) {
            return new WP_Error('upload_error', $upload->get_error_message());
        }

        // Set the uploaded image as the featured image for the created post
        return set_post_thumbnail($post_id, $upload);
    }

    public static function promoHistoryUpdate($data)
    {
        $post_id = $data['promo_id'];
        if (is_wp_error($post_id)) {
            return new WP_Error('id_error', $post_id->get_error_message());
        }

        $updatesCount = get_post_meta($post_id, 'update', true) ?? '0';

        if (!isset($data['promo_delete_item'])) {
            $date = new DateTimeImmutable();

            $upload = media_handle_upload('upload_file', 0);
            if (is_wp_error($upload)) {
                return new WP_Error('upload_error', $upload->get_error_message());
            }

            $updateItem = array(
                'item' => [
                    'date' => $date->format('Ymd'),
                    'title' => $data['promo_history_title'],
                    'text' => $data['promo_history_text'],
                    'gallery' => $upload
                ]
            );

            $addUpdate = add_row('update', $updateItem, $post_id);

            if (is_wp_error($addUpdate)) {
                return new WP_Error('add_update_error', $addUpdate->get_error_message());
            }

        } else {
            if ($updatesCount > 0) {
                $item = $data['promo_delete_item'];
                if (is_wp_error($item)) {
                    return new WP_Error('delete_item_error', $item->get_error_message());
                }

                $deleteUpdate = delete_row('update', $item, $post_id);
                if (is_wp_error($deleteUpdate)) {
                    return new WP_Error('update_error', $deleteUpdate->get_error_message());
                }
            }
        }

        return [
            'code' => 'success',
        ];
    }

    public static function promoSupport($data)
    {
        $post_id = $data['promo_id'] ?? '';
        $sum = get_post_meta($post_id, 'sum', true) ?? '0';
        $collected = get_post_meta($post_id, 'collected', true) ?? '0';
        $addCollected = $data['donation_short_count'] ?? '0';
        $collect = $collected + $addCollected;

        $promo_update = [
            'ID' => $post_id,
            'meta_input' => [
                'collected' => $collect,
            ]
        ];

        if ($collect >= $sum) {
            $promo_update['meta_input'] = [
                'status' => 'finished',
                'collected' => $collect,
            ];
        }

        if ($promo_update) {
            $updated = wp_update_post($promo_update);

            if (is_wp_error($updated)) {
                return new WP_Error('create_post_error', $updated->get_error_message());
            }
        }

        $date = new DateTimeImmutable();
        $name = $data['full_name'] ?? '';

        if (isset($data['anonymous'])) {
            $anonymous = $data['anonymous'] ?? '';
            if ($anonymous === 'on') {
                $name = __("Анонімно");
            }
        }

        $paymentItem = array(
            'item' => [
                'date' => $date->format('Ymd'),
                'name' => $name,
                'phone' => $data['user_phone'],
                'email' => $data['user_email'],
                'count' => $addCollected,
                'coment' => $data['donation_message'],
            ]
        );

        $addItem = add_row('payments', $paymentItem, $post_id);

        if (is_wp_error($addItem)) {
            return new WP_Error('create_post_error', $addItem->get_error_message());
        }

        return [
            'code' => 'success',
        ];
    }
}


/* Custom delete for promotions */
add_action('before_delete_post', 'deletePromotionAttachments');
function deletePromotionAttachments($post_id)
{
    // Only delete attachments if the post type is "promotion"
    if (get_post_type($post_id) == 'promotions') {
        WingsPromo::deletePromoAttachments($post_id);
    }
}



