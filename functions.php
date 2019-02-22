<?php 

function university_files() {
    wp_enqueue_style('custom-google-fonts', 'https://fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
    wp_enqueue_style('font-awesome', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_enqueue_style('university_main_styles', get_stylesheet_uri(), NULL, microtime(), false);

    wp_enqueue_script('main-university-js', get_theme_file_uri('/js/scripts-bundled.js'), NULL, microtime(), true);
}

add_action('wp_enqueue_scripts', 'university_files');

function univerity_features() {
    // title tag
    add_theme_support('title-tag');

    // add menus
    register_nav_menu('headerMenuLocation', 'Header Menu Location');
    register_nav_menu('footerLocationOne', 'Footer Location One');
    register_nav_menu('footerLocationTwo', 'Footer Location Two');
    // feature image
    add_theme_support('post-thumbnails');
    add_image_size('professorLandscape', 400, 260, true);
    add_image_size('professorPortrait', 480, 650, true);
    add_image_size('pageBanner', 1500, 350, true);
}

add_action('after_setup_theme', 'univerity_features');

// custom post type
// function university_post_type() {
//     register_post_type('event', array(
//         'public' => true,
//         'labels' => array(
//             'name' => 'Events'
//         ),
//         'menu_icon' => 'dashicons-calendar'
//     ));
// }

// add_action('init', 'university_post_type');

function university_adjust_queries($query) {
    $today = date('Ymd');
    if(!is_admin() && is_post_type_archive('programs') && $query->is_main_query()) {
        $query->set('orderby', 'title');
        $query->set('order', 'ASC');
        $query->set('posts_per_page', -1);
    }
    if(!is_admin() && is_post_type_archive( 'event' ) && $query->is_main_query()) {
        $query->set('meta_key', 'event_date');
        $query->set('orderby', 'meta_value_num');
        $query->set('order', 'ASC');
        $query->set('meta_query', array(
          array(
            'key' => 'event_date',
            'compare' => '>=',
            'value' => $today,
            'type' => 'numeric'
          )
        ));

    }
}

add_action('pre_get_posts', 'university_adjust_queries');
