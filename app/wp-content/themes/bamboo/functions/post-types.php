<?php

// Projects
add_action('init', 'createWingsCustomPosts');
add_action('init', 'defaultWingsPost');

function createWingsCustomPosts()
{
    // Projects
    register_post_type('projects', [
        'labels'              => [
            'name'           => __('Проєкти', 'bamboo'),
            'all_items'      => __('Усі проєкти', 'bamboo'),
            'name_admin_bar' => __('Проєкт', 'bamboo'),
            'singular_name'  => __('Проєкт', 'bamboo')
        ],
        'public'              => true,
        'has_archive'         => false,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'project',
        'graphql_plural_name' => 'projects',
        'menu_position'       => 4,
        'menu_icon'           => 'dashicons-archive',
        'supports'            => ['title', 'thumbnail', 'excerpt', 'editor']
    ]);

    // Promotions
    register_post_type('promotions', [
        'labels'              => [
            'name'           => __('Акції', 'bamboo'),
            'all_items'      => __('Усі акції', 'bamboo'),
            'name_admin_bar' => __('Акцію', 'bamboo'),
            'singular_name'  => __('Акція', 'bamboo')
        ],
        'public'              => true,
        'has_archive'         => false,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'promotion',
        'graphql_plural_name' => 'promotions',
        'menu_position'       => 4,
        'menu_icon'           => 'dashicons-megaphone',
        'supports'            => ['title', 'thumbnail', "author"]
    ]);

    // Reports
    register_post_type('reports', [
        'labels'              => [
            'name'           => __('Звіти', 'bamboo'),
            'all_items'      => __('Усі звіти', 'bamboo'),
            'name_admin_bar' => __('Звіти', 'bamboo'),
            'singular_name'  => __('Звіт', 'bamboo')
        ],
        'public'              => true,
        'has_archive'         => false,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'report',
        'graphql_plural_name' => 'reports',
        'menu_position'       => 4,
        'menu_icon'           => 'dashicons-analytics',
        'supports'            => ['title', 'thumbnail', 'excerpt', 'editor']
    ]);

    register_taxonomy('year', ['reports'], [
        'labels'              => [
            'name'          => 'Роки',
            'singular_name' => 'Рік'
        ],
        'show_in_rest'        => true,
        'graphql_single_name' => 'year',
        'graphql_plural_name' => 'years',
        'show_in_graphql'     => true,
        'hierarchical'        => true,
        'query_var'           => true,
        'show_admin_column'   => true,
        // 'show_in_nav_menus'  => false,
        // 'public'             => true,
        // 'supports'           => ['title'],
        'show_ui'             => true
        // "publicly_queryable" => false
    ]);

    // Shop
    register_post_type('goods', [
        'labels'              => [
            'name'           => __('Магазин', 'bamboo'),
            'all_items'      => __('Усі товари', 'bamboo'),
            'name_admin_bar' => __('Товар', 'bamboo'),
            'singular_name'  => __('Товар', 'bamboo')
        ],
        'public'              => true,
        'has_archive'         => false,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'good',
        'graphql_plural_name' => 'goods',
        'menu_position'       => 4,
        'menu_icon'           => 'dashicons-cart',
        'supports'            => ['title', 'thumbnail']
    ]);

    // Forms
    register_post_type('forms', [
        'labels'              => [
            'name'           => __('Форми', 'bamboo'),
            'all_items'      => __('Усі форми', 'bamboo'),
            'name_admin_bar' => __('Форма', 'bamboo'),
            'singular_name'  => __('Форма', 'bamboo')
        ],
        'public'              => false,
        'show_ui'             => true,
        'has_archive'         => false,
        'show_in_rest'        => true,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'form',
        'graphql_plural_name' => 'forms',
        'menu_position'       => 5,
        'menu_icon'           => 'dashicons-welcome-write-blog',
        'supports'            => ['title']
    ]);
}

// News post type as default
function defaultWingsPost()
{
    $pt = get_post_type_object('post');

    $pt->menu_icon          = 'dashicons-calendar';
    $labels                 = $pt->labels;
    $labels->name           = __('Новини', 'bamboo');
    $labels->singular_name  = __('Новина', 'bamboo');
    $labels->add_new        = __('Додати новину', 'bamboo');
    $labels->add_new_item   = __('Додати новину', 'bamboo');
    $labels->edit_item      = __('Редагувати новину', 'bamboo');
    $labels->new_item       = __('Нова', 'bamboo');
    $labels->all_items      = __('Усі новини', 'bamboo');
    $labels->menu_name      = __('Новини', 'bamboo');
    $labels->name_admin_bar = __('Новину', 'bamboo');
}
