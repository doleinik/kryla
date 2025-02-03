<?php

// Include the PHPMailer class
require_once ABSPATH . WPINC . '/PHPMailer/PHPMailer.php';
require_once ABSPATH . WPINC . '/PHPMailer/Exception.php';

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

class WingsForms
{
    public static function getForm(int $form_id): array
    {
        $form_data = [];
        $sub_forms = null;

        $form = get_post($form_id);

        if ($form && $form->post_type === 'forms') {

            $data = get_field('form_options', $form->ID);

            // Get form fields
            if (isset($data['fields']) && is_array($data['fields'])) {
                foreach ($data['fields'] as &$field) {
                    if (isset($field['acf_fc_layout'])) {
                        $field['type'] = $field['acf_fc_layout'];
                        unset($field['acf_fc_layout']);
                    }
                }
            }

            // Get subforms
            if ($data['sub_forms']) {
                $sub_forms = [
                    'title' => $data['sub_forms_title'],
                    'forms' => $data['sub_forms']
                ];
            }

            $form_data = [
                'id'              => $form->ID,
                'title'           => $data['title'],
                'subtitle'        => $data['subtitle'],
                'name'            => $data['name'],
                'fields'          => $data['fields'],
                'endpoint'        => $data['endpoint'],
                'confirm_message' => $data['confirm_message'],
                'success_message' => $data['success_message'],
                'sub_forms'       => $sub_forms
            ];
        }

        return $form_data;
    }

    public static function getForms(int $id = null): array
    {
        if ($id) {
            return self::getForm($id);
        }

        $forms = [];
        $args  = [
            'post_type'      => 'forms',
            'posts_per_page' => -1
        ];

        $query = new WP_Query($args);

        if ($query->have_posts()) {
            foreach ($query->posts as $post) {
                $data                 = self::getForm($post->ID);
                $forms[$data['name']] = $data;
            }
        }

        return $forms;
    }

    private static function formToLetter(array $form_data)
    {
        $mail_to     = get_option('admin_email');
        $tpl         = self::getForm($form_data['form_id']);
        $fields      = $tpl['fields'] ?? null;
        $attachments = null;

        // Create a new WP_Error object
        $errors = new WP_Error();

        // Create a new PHPMailer instance
        $mail = new PHPMailer();

        $mail->CharSet = 'utf-8';
        $mail->Subject = __('Запит з форми', 'bamboo') . ': "' . $tpl['title'] . '"';
        $mail->Body    = self::createEmailBody($form_data, $fields);
        $mail->isHTML(true);
        $mail->setFrom($mail_to, 'Site Admin');
        $mail->addAddress($mail_to, 'Site Admin');

        // Add attachments
        if (isset($form_data['files'])) {
            $attachments = reset($form_data['files']);
            $mail->addAttachment($attachments['tmp_name'], $attachments['name']);
        }

        // Send email
        try {
            if ($mail->send()) {
                return [
                    'code'    => 'success',
                    'message' => $tpl['success_message']
                ];

            } else {
                $errors->add('send_email_error', $mail->ErrorInfo);
            }
        } catch (Exception $e) {
            $errors->add('send_email_error', $e->getMessage());
        }

        return $errors;
    }

    private static function createEmailBody(array $form_data, array $fields): string
    {
        $inputs = [];

        foreach ($fields as $field) {
            if (isset($form_data[$field['name']])) {
                $title          = '<b>' . str_replace('*', '', $field['title']) . '</b>';
                $inputs[$title] = $form_data[$field['name']];
            }
        }

        return implode("\r\n<br>", array_map(function ($key, $value) {
            return $key . ": " . $value;
        }, array_keys($inputs), $inputs));
    }

    public static function sendForm($post_data)
    {
        return self::formToLetter($post_data);
    }
}
