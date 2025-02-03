<?php

class WingsUser
{
    static $user_meta = [
        'user_profile_photo',
        'user_profile_phone',
        'user_profile_google_id',
        'user_profile_facebook_id'
    ];

    public static function create(array $data)
    {
        $user_data = [
            'user_login' => $data['user_email'],
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'user_email' => $data['user_email'],
            'user_pass' => $data['user_pass'],
            'meta_input' => [
                'user_profile_phone' => $data['user_phone']
            ],
            'role' => 'subscriber',
            'show_admin_bar_front' => 'false'
        ];

        // Check if user exists
        $user = self::getByEmailOrPhone($user_data);

        if ($user) {
            // If email exists
            if ($user->user_email == $data['user_email']) {
                return WingsValidator::fieldsError('user_email', __('This email already exists.', 'bamboo'));
                // If phone exists
            } else {
                return WingsValidator::fieldsError('user_phone', __('This phone already exists.', 'bamboo'));
            }
        }

        $user_id = wp_insert_user($user_data);

        if (is_wp_error($user_id)) {
            return new WP_Error('create_user_error', $user_id->get_error_message());
        }

        return [
            'code' => 'success',
            'message' => __('User successfully created!', 'bamboo'),
            'user_data' => self::getData($user_id)
        ];
    }

    public static function login(array $data)
    {
        $user = self::getByEmailOrPhone($data);

        if (!$user) {
            return WingsValidator::fieldsError('user_login', __('Invalid login.', 'bamboo'));
        }

        if (!wp_check_password($data['user_login_pass'], $user->user_pass, $user->ID)) {
            return WingsValidator::fieldsError('user_login_pass', __('Invalid password.', 'bamboo'));
        }

        return [
            'code' => 'success',
            'message' => __('User successfully loged in', 'bamboo'),
            'user_data' => self::getData($user->ID)
        ];

    }

    public static function loginWithSocial(array $data)
    {
        // Check if user is connected with social ID
        $social = $data['social_key'];
        $social_id = $data['social_id'];

        $user = self::getByMeta("user_profile_{$social}_id", $social_id);

        if ($user) {

            return [
                'code' => 'success',
                'message' => __('User successfully loged in', 'bamboo'),
                'user_data' => self::getData($user->ID)
            ];
        } else {
            // Check if users email exists
            $user = get_user_by('email', $data['user_email']);

            // If users email exists connect with account | create new user from social
            return self::createWithSocial($data, $user);
        }
    }

    public static function createWithSocial(array $data, $user = null)
    {
        $social = $data['social_key'];
        $social_id = $data['social_id'];
        $user_social_photo = $data['user_social_photo'];

        if ($user) {
            $user_id = $user->ID;
            update_user_meta($user_id, "user_profile_{$social}_id", $social_id);
        } else {

            $user_data = [
                'user_login' => $data['user_email'],
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'user_email' => $data['user_email'],
                'user_pass' => wp_generate_password(16, true),
                'meta_input' => [
                    "user_profile_{$social}_id" => $social_id
                ],
                'role' => 'subscriber',
                'show_admin_bar_front' => 'false'
            ];

            $user_id = wp_insert_user($user_data);

            if (is_wp_error($user_id)) {
                return new WP_Error('create_user_error', $user_id->get_error_message());
            }
        }

        // Upload user photo
        if (!empty($user_social_photo)) {
            $user_photo = WingsTools::getFileFromUrl($user_social_photo, 'user-photo');

            if (is_wp_error($user_photo)) {
                return $user_photo;
            }

            $update_photo = self::updatePhoto($user_id, $user_photo);

            if (is_wp_error($update_photo)) {
                return $update_photo;
            }
        }

        return [
            'code' => 'success',
            'message' => __('User successfully connected!', 'bamboo'),
            'user_data' => self::getData($user_id)
        ];
    }

    public static function logout(array $data)
    {
        $user = get_user_by('ID', $data['user_id']);

        if (!$user) {
            return new WP_Error('not_authenticated', __('You are not authenticated.', 'bamboo'));
        } else {
            return [
                'code' => 'success',
                'message' => __('You have been logged out.', 'bamboo')
            ];
        }
    }

    public static function update(array $data)
    {
        $files = $data['files'] ?? [];

        $user_data = [
            'ID' => $data['user_id'],
            'user_login' => $data['user_email'],
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'user_email' => $data['user_email'],
            'meta_input' => [
                'user_profile_phone' => $data['user_phone']
            ]
        ];

        $user_id = wp_update_user($user_data);

        if (is_wp_error($user_id)) {
            return new WP_Error('update_error', $user_id->get_error_message());
        }

        if ($files && isset($files['user_photo']) && !empty($files['user_photo'])) {
            $update_photo = self::updatePhoto($user_id, $files['user_photo']);

            if (is_wp_error($update_photo)) {
                return $update_photo;
            }
        }

        return [
            'code' => 'success',
            'message' => __('User updated successfully!', 'bamboo'),
            'user_data' => self::getData($user_id)
        ];
    }

    public static function updatePassword(array $data)
    {
        $user = get_user_by('ID', $data['user_id']);

        // Check if old password is correct
        // if (!wp_check_password($data['user_old_pass'], $user->user_pass, $data['user_id'])) {
        //     return WingsValidator::fieldsError('user_old_pass', __('Invalid password.', 'bamboo'));
        // }

        // Update password
        wp_set_password($data['user_pass'], $user->ID);

        return [
            'code' => 'success',
            'message' => __('User password successfully updated!', 'bamboo'),
            'user_data' => self::getData($user->ID)
        ];
    }

    public static function resetPassword(array $data)
    {
        $user = get_user_by('email', $data['user_email']);

        if (!$user) {
            return WingsValidator::fieldsError('user_email', __('Invalid login.', 'bamboo'));
        }

        $login = $user->user_login;

        // Generate the password reset key and URL
        $key = get_password_reset_key($user);
        $reset_url = add_query_arg(array(
            'action' => 'rp',
            'key' => $key,
            'login' => rawurlencode($login)
        ), wp_login_url());

        // Set the email subject
        $subject = 'Password Reset Request';

        // Set the email message
        $message = sprintf(__('Someone has requested a password reset for the following account: %s') . "\r\n\r\n", $login);
        $message .= __('If this was a mistake, just ignore this email and nothing will happen.') . "\r\n\r\n";
        $message .= __('To reset your password, please copy and paste the following URL into your browser:') . "\r\n\r\n";
        $message .= $reset_url . "\r\n\r\n";

        // Filter the email message
        $message = apply_filters('retrieve_password_message', $message, $key, $login, $user);

        // Send the email
        $reset_send = wp_mail($user->user_email, $subject, $message);

        if (is_wp_error($reset_send)) {
            return $reset_send;
        }

        return [
            'code' => 'success',
            'message' => [
                'title' => __('Інструкції по скиданню паролю вислано на пошту', 'bamboo')
            ]
        ];

    }

    public static function delete($user_id, $from_admin = false)
    {
        // When removed from admin dashboard
        if ($from_admin) {
            $remove_photo = self::removePhoto($user_id, true);

            if (is_wp_error($remove_photo)) {
                return $remove_photo;
            }

            self::deleteMeta($user_id);
        } // If removed from uaser profile page
        else {
            if (!get_userdata($user_id)) {
                return new WP_Error('user_not_found', __('User not found.', 'bamboo'));
            }

            $remove_photo = self::removePhoto($user_id, true);

            if (is_wp_error($remove_photo)) {
                return $remove_photo;
            }

            if (!wp_delete_user($user_id)) {
                return new WP_Error('delete_error', __('An error occurred while deleting the user.', 'bamboo'));
            }

            self::deleteMeta($user_id);

            return [
                'code' => 'success',
                'message' => __('User successfully deleted', 'bamboo')
            ];
        }

    }

    public static function deleteMeta($user_id)
    {
        foreach (self::$user_meta as $meta_key) {
            delete_user_meta($user_id, $meta_key);
        }
    }

    public static function removePhoto($user_id, $folder_remove = false)
    {
        // Check if image already exists and remove it first
        $old_photo = get_user_meta($user_id, 'user_profile_photo', true);

        if ($old_photo) {
            wp_delete_attachment($old_photo, true);
            delete_user_meta($user_id, 'user_profile_photo');
        }

        // Delete custom folder if $folder_remove is true
        if ($folder_remove) {
            $custom_upload_dir = wp_upload_dir();
            $custom_folder_path = $custom_upload_dir['basedir'] . '/user_photos/' . $user_id;
            if (file_exists($custom_folder_path)) {
                $deleted = WingsTools::removeDir($custom_folder_path);
                if (!$deleted) {
                    return new WP_Error('folder_remove_error', __('An error occurred while deleting the user folder.', 'bamboo'));
                }
            }
        }

        return [
            'code' => 'success',
            'message' => __('User image successfully deleted', 'bamboo'),
            'user_data' => self::getData($user_id)
        ];
    }

    private static function updatePhoto($user_id, $img = [])
    {
        self::removePhoto($user_id);

        // Upload new image and save to meta field
        if (!empty($img)) {

            $custom_upload_dir = function ($uploads) use ($user_id) {
                $uploads['path'] = $uploads['basedir'] . '/user_photos/' . $user_id;
                $uploads['url'] = $uploads['baseurl'] . '/user_photos/' . $user_id;
                $uploads['subdir'] = '/user_photos/' . $user_id;
                return $uploads;
            };

            add_filter('upload_dir', $custom_upload_dir);

            $uploaded_id = media_handle_sideload($img, $user_id);

            remove_filter('upload_dir', $custom_upload_dir);

            if (is_wp_error($uploaded_id)) {
                return new WP_Error('upload_error', $uploaded_id->get_error_message());
            }

            // Remove temp file if isset
            if (isset($img['remove_temp']) && file_exists($img['remove_temp'])) {
                unlink($img['remove_temp']);
            }

            update_user_meta($user_id, 'user_profile_photo', $uploaded_id);
        }

        return [
            'code' => 'success',
            'message' => __('User image successfully updated', 'bamboo'),
            'user_data' => self::getData($user_id)
        ];
    }

    private static function getByEmailOrPhone($data)
    {
        $login = $data['user_login'] ?? null;

        // Check if user_login is an email address or a phone number
        if (filter_var($login, FILTER_VALIDATE_EMAIL)) {
            $user = get_user_by('email', $login);
        } else {
            $user = self::getByMeta('user_profile_phone', $login);
        }

        return $user;
    }

    private static function getByMeta($meta_key, $meta_value)
    {
        $user = reset(get_users([
            'meta_key' => $meta_key,
            'meta_value' => $meta_value,
            'number' => 1,
            'count_total' => false,
            'fields' => 'all'
        ]));

        return $user;
    }

    private static function getData($user_id)
    {
        $user = get_user_by('ID', $user_id);

        $user_photo_meta = get_user_meta($user->ID, 'user_profile_photo', true);
        $user_photo = wp_get_attachment_image_url($user_photo_meta, 'thumbnail');

        return [
            'user_id' => $user->ID,
            'user_email' => $user->user_email,
            'full_name' => $user->first_name . ' ' . $user->last_name,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'user_phone' => get_user_meta($user->ID, 'user_profile_phone', true),
            'google_id' => get_user_meta($user->ID, 'user_profile_google_id', true),
            'facebook_id' => get_user_meta($user->ID, 'user_profile_facebook_id', true),
            'token' => WingsToken::generate($user),
            'user_photo' => $user_photo
        ];
    }

    public static function addSubscriptions($data)
    {
        $user_id = $data['user_id'] ?? '';
        if (is_wp_error($user_id)) {
            return new WP_Error('upload_error', $user_id->get_error_message());
        }

        $project_id = $data['project_id'] ?? '0';
        $type = get_post($project_id);
        $date = new DateTimeImmutable();

        $subscItems = get_user_meta($user_id, 'user_profile_subscriptions', true) ?? '0';

        $addSubscItem = [
            ['user_profile_subscriptions_' . $subscItems . '_subscription_name', get_the_title($project_id)],
            ['user_profile_subscriptions_' . $subscItems . '_subscription_count', $data['donation_amount'] ?? ''],
            ['user_profile_subscriptions_' . $subscItems . '_subscription_date', $date->format('Ymd')],
            ['user_profile_subscriptions_' . $subscItems . '_subscription_appointment', $data['donation_appointment'] ?? ''],
            ['user_profile_subscriptions_' . $subscItems . '_subscription_type', $type->post_type ?? ''],
        ];

        foreach ($addSubscItem as $item) {
            $addSubsc = update_user_meta($user_id, $item[0], $item[1]);

            if (is_wp_error($addSubsc)) {
                return new WP_Error('subscriptions_error', $addSubsc->get_error_message());
            }
        }

        $updateCount = update_user_meta($user_id, 'user_profile_subscriptions', $subscItems + 1);

        if (is_wp_error($updateCount)) {
            return new WP_Error('update_count', $updateCount->get_error_message());
        }

        return [
            'code' => 'success',
        ];

    }

    public static function deleteSubscriptions($data)
    {
        $user_id = $data['user_id'];
        if (is_wp_error($user_id)) {
            return new WP_Error('update_count', $user_id->get_error_message());
        }

        $removeItem = $data['unsubscribe_item'] ?? '';
        $subscArr = [];
        $subscItems = get_user_meta($user_id, 'user_profile_subscriptions', true) ?? '0';
        if (isset($subscItems) && $subscItems > 0) {
            for ($i = 0; $i < $subscItems; $i++) {
                if ($i != $removeItem) {
                    $addSubscItem = [
                        get_user_meta($user_id, 'user_profile_subscriptions_' . $i . '_subscription_name', true),
                        get_user_meta($user_id, 'user_profile_subscriptions_' . $i . '_subscription_count', true),
                        get_user_meta($user_id, 'user_profile_subscriptions_' . $i . '_subscription_date', true),
                        get_user_meta($user_id, 'user_profile_subscriptions_' . $i . '_subscription_type', true),
                    ];
                    $subscArr[] = $addSubscItem;
                }
            }

            foreach ($subscArr as $index => $item) {
                update_user_meta($user_id, 'user_profile_subscriptions_' . $index . '_subscription_name', $item[0]);
                update_user_meta($user_id, 'user_profile_subscriptions_' . $index . '_subscription_count', $item[1]);
                update_user_meta($user_id, 'user_profile_subscriptions_' . $index . '_subscription_date', $item[2]);
                update_user_meta($user_id, 'user_profile_subscriptions_' . $index . '_subscription_type', $item[2]);
            }

            $updateSubsc = update_user_meta($user_id, 'user_profile_subscriptions', $subscItems - 1);
            if (is_wp_error($updateSubsc)) {
                return new WP_Error('update_subscriptions', $updateSubsc->get_error_message());
            }
            return [
                'code' => 'success',
            ];
        }
        return [
            'code' => 'error',
            'message' => __('There is nothing to unsubscribe', 'bamboo'),
        ];
    }

    public static function editSubscriptions($data)
    {
        $user_id = $data['user_id'];
        if (is_wp_error($user_id)) {
            return new WP_Error('update_count', $user_id->get_error_message());
        }
        $subscItem = $data['edit_item'] ?? '0';

        update_user_meta($user_id, 'user_profile_subscriptions_' . $subscItem . '_subscription_count', $data['donation_amount']);
        update_user_meta($user_id, 'user_profile_subscriptions_' . $subscItem . '_subscription_date', $data['donation_date']);
        update_user_meta($user_id, 'user_profile_subscriptions_' . $subscItem . '_subscription_appointment', $data['donation_appointment']);

        return [
            'code' => 'success',
        ];
    }

    public static function addHistorySupport($data)
    {
        $user_id = $data['user_id'];
        if (is_wp_error($user_id)) {
            return new WP_Error('user_id_error', $user_id->get_error_message());
        }

        $support_id = $data['support_id'] ?? '0';
        $type = get_post($support_id);
        $supportItems = get_user_meta($user_id, 'user_profile_history_support', true) ?? '0';

        $addSupportItem = [
            ['user_profile_history_support_' . $supportItems . '_item_id', $support_id ?? ''],
            ['user_profile_history_support_' . $supportItems . '_item_type', $type->post_type ?? '']
        ];

        foreach ($addSupportItem as $item) {
            $addSupport = update_user_meta($user_id, $item[0], $item[1]);

            if (is_wp_error($addSupport)) {
                return new WP_Error('add_profile_history_error', $addSupport->get_error_message());
            }
        }

        $updateCount = update_user_meta($user_id, 'user_profile_history_support', $supportItems + 1);
        if (is_wp_error($updateCount)) {
            return new WP_Error('update_count', $updateCount->get_error_message());
        }

        return [
            'code' => 'success',
        ];
    }
}

/* Custom delete for subscribers */
add_action('delete_user', 'deleteSubscriberHook', 10, 1);
function deleteSubscriberHook($user_id)
{
    WingsUser::delete($user_id, true);
}
