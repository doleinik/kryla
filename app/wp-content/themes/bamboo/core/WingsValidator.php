<?php

use Respect\Validation\Exceptions\ValidationException as vException;
use Respect\Validation\Validator as v;

class WingsValidator
{
    private static function getPredefinedRules()
    {
        return [
            'required'    => v::notEmpty(),
            'not_required'=> v::optional(v::notEmpty()),
            'email'       => v::email(),
            'single_name' => v::length(3, 50),
            'full_name'   => v::length(3, 150),
            'long_text'   => v::length(3, 250),
            'password'    => v::stringType()->length(6, 50)->regex('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/'),
            'phone'       => v::optional(v::phone()->startsWith('+380')->length(9)),
            'document'    => v::file()->size(null, '50MB')->anyOf(
                v::mimetype('application/pdf'),
                v::mimetype('application/msword'),
                v::mimetype('text/plain')),
            'image'       => v::image()->size(null, '50MB')
        ];
    }

    private static function getRule($rule)
    {
        $rules = self::getPredefinedRules();
        return $rules[$rule];
    }

    public static function getRules($inputs)
    {
        $rules = [
            'user_login'           => [
                'rules'   => self::getRule('required'),
                'message' => __('Please enter a valid email address or phone number', 'bamboo')
            ],
            'user_email'           => [
                'rules'   => self::getRule('email'),
                'message' => __('Please enter a valid email address', 'bamboo')
            ],
            'user_login_pass'      => [
                'rules'   => self::getRule('required'),
                'message' => __('Please enter a password', 'bamboo')
            ],
            'first_name'           => [
                'rules'   => self::getRule('single_name'),
                'message' => __('Please enter your first name', 'bamboo')
            ],
            'last_name'            => [
                'rules'   => self::getRule('single_name'),
                'message' => __('Please enter your last name', 'bamboo')
            ],
            'user_pass'            => [
                'rules'   => self::getRule('password'),
                'message' => __('Пароль повинен складатися мінімум з 6 символів, містити цифри та літери і щонайменш одну велику літеру', 'bamboo')
            ],
            'user_phone'           => [
                'rules'   => self::getRule('phone'),
                'message' => __('Please enter a valid phone number starting with +380', 'bamboo')
            ],
            'promo_title'          => [
                'rules' => self::getRule('required'),
                'message' => __('Please enter a correct text', 'bamboo')
            ],
            // 'promo_excerpt'        => [
            //     'rules' => self::getRule('long_text'),
            // ],
            'promo_excerpt'        => [
                'rules' => self::getRule('required')
            ],
            'promo_description'    => [
                'rules' => self::getRule('required'),
                'message' => __('Please enter a correct text', 'bamboo')
            ],
            'promo_contact_person' => [
                'rules' => self::getRule('required')
            ],
            'promo_contact_phone'  => [
                'rules' => self::getRule('phone')
            ],
            'promo_sum'            => [
                'rules' => self::getRule('required')
            ],
            'promo_featured_image' => [
                'rules'   => self::getRule('image'),
                'message' => __('Please upload a valid image file with size less than or equal to 50MB', 'bamboo')
            ],
            'upload_file'          => [
                'rules'   => self::getRule('document'),
                'message' => __('Please upload a valid document file, with size less than or equal to 50MB', 'bamboo')
            ],
//             'upload_file'          => [
//                 'rules'   => self::getRule('not_required'),
//             ],
            'promo_history_title'          => [
                'rules'   => self::getRule('long_text'),
                'message' => __('Please enter a correct text', 'bamboo')
            ],
            'promo_history_text'          => [
                'rules'   => self::getRule('long_text'),
                'message' => __('Please enter a correct text', 'bamboo')
            ],
        ];

        if (isset($inputs['user_pass']) && isset($inputs['user_pass_repeat'])) {
            $rules['user_pass_repeat'] = [
                'rules'   => v::equals($inputs['user_pass']),
                'message' => __('Please make sure the password confirmation matches the password', 'bamboo')
            ];
        }

        return $rules;
    }

    public static function validateData($data)
    {
        $validationErrors = [];
        $rules            = self::getRules($data);

        foreach ($rules as $field => $rule) {
            if (!isset($data[$field])) {
                continue;
            }

            $fieldValue  = $data[$field];
            $fieldErrors = [];

            if (is_array($fieldValue) && isset($fieldValue['tmp_name'])) {
                $fieldErrors = self::validateFileField($rule, $fieldValue['tmp_name']);
            } else {
                $fieldErrors = self::validateInputField($rule, $fieldValue);
            }

            if (!empty($fieldErrors)) {
                $validationErrors[$field] = $fieldErrors;
            }
        }

        return $validationErrors;
    }

    private static function validateFileField($rule, $tmpName)
    {
        $fieldErrors = [];

        try {
            $rule['rules']->check($tmpName);
        } catch (vException $e) {
            if (empty($rule['message'])) {
                $fieldErrors[] = $e->getMessage();
            } else {
                $errorMessage = $rule['message'];
                if (!in_array($errorMessage, $fieldErrors)) {
                    $fieldErrors[] = $errorMessage;
                }
            }
        }

        return $fieldErrors;
    }

    private static function validateInputField($rule, $fieldValue)
    {
        $fieldErrors = [];

        foreach ($rule['rules']->getRules() as $validator) {
            try {
                if (isset($rule['message']) && !empty($rule['message'])) {
                    $validator->setName($rule['message']);
                }
                $validator->check($fieldValue);
            } catch (vException $e) {
                if (empty($rule['message'])) {
                    $fieldErrors[] = $e->getMessage();
                } else {
                    $errorMessage = $rule['message'];
                    if (!in_array($errorMessage, $fieldErrors)) {
                        $fieldErrors[] = $errorMessage;
                    }
                }
            }
        }

        return $fieldErrors;
    }

    public static function validate($data)
    {

        // Check for files
        if (isset($data['files']) && is_array($data['files'])) {
            $files = $data['files'];
            unset($data['files']);
            foreach ($files as $key => $value) {
                $data[$key] = $value;
            }
        }

        $validationErrors = self::validateData($data);

        if (!empty($validationErrors)) {
            return new WP_Error('validation_error', __('Validation error', 'bamboo'), array(
                'fields' => $validationErrors
            ), 200);
        }
    }

    public static function fieldsError($field_name, $message)
    {
        return new WP_Error('validation_error', __('Validation error', 'bamboo'), array(
            'fields' => [
                $field_name => $message
            ]
        ), 200);
    }

}
