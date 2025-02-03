<?php

class WingsProject
{
    public static function projectSupport($data)
    {
        $addSubsc = WingsUser::addSubscriptions($data);

        if (is_wp_error($addSubsc)) {
            return new WP_Error('upload_error', $addSubsc->get_error_message());
        }

        return $addSubsc;

        $support = WingsPayment::support($data);

        if (is_wp_error($support)) {
            return new WP_Error('upload_error', $support->get_error_message());
        }

        return [
            'code' => 'success'
        ];
    }
}




