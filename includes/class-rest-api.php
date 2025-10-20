<?php
/**
 * REST API handler class
 *
 * @package LGD_Map
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * LGD_Map_REST_API class
 */
class LGD_Map_REST_API {
    
    /**
     * Namespace for REST API
     */
    const NAMESPACE = 'lgd-map/v1';
    
    /**
     * Constructor
     */
    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }
    
    /**
     * Register REST API routes
     */
    public function register_routes() {
        // Get all points
        register_rest_route(self::NAMESPACE, '/points', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_points'),
            'permission_callback' => '__return_true',
            'args' => array(
                'per_page' => array(
                    'default' => 100,
                    'sanitize_callback' => 'absint',
                ),
                'page' => array(
                    'default' => 1,
                    'sanitize_callback' => 'absint',
                ),
                'category' => array(
                    'default' => '',
                    'sanitize_callback' => 'sanitize_text_field',
                ),
            ),
        ));
        
        // Get single point
        register_rest_route(self::NAMESPACE, '/points/(?P<id>\d+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_point'),
            'permission_callback' => '__return_true',
            'args' => array(
                'id' => array(
                    'required' => true,
                    'sanitize_callback' => 'absint',
                ),
            ),
        ));
        
        // Get categories
        register_rest_route(self::NAMESPACE, '/categories', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_categories'),
            'permission_callback' => '__return_true',
        ));
        
        // Get settings
        register_rest_route(self::NAMESPACE, '/settings', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_settings'),
            'permission_callback' => '__return_true',
        ));
    }
    
    /**
     * Get all points
     */
    public function get_points($request) {
        $json_manager = new LGD_Map_JSON_Manager();
        $all_points = $json_manager->load_points();
        
        // Filter by category if specified
        $category = $request->get_param('category');
        if (!empty($category)) {
            $all_points = array_filter($all_points, function($point) use ($category) {
                return $point['category'] === $category;
            });
        }
        
        // Pagination
        $per_page = $request->get_param('per_page');
        $page = $request->get_param('page');
        $total = count($all_points);
        $pages = ceil($total / $per_page);
        
        $offset = ($page - 1) * $per_page;
        $points = array_slice($all_points, $offset, $per_page);
        
        return rest_ensure_response(array(
            'points' => $points,
            'total' => $total,
            'pages' => $pages,
        ));
    }
    
    /**
     * Get single point
     */
    public function get_point($request) {
        $point_id = $request->get_param('id');
        $json_manager = new LGD_Map_JSON_Manager();
        $point = $json_manager->get_point($point_id);
        
        if (!$point) {
            return new WP_Error('point_not_found', __('Point not found', 'lgd-map'), array('status' => 404));
        }
        
        return rest_ensure_response($point);
    }
    
    /**
     * Get categories
     */
    public function get_categories($request) {
        $json_manager = new LGD_Map_JSON_Manager();
        $settings = $json_manager->load_settings();
        $categories = $settings['categories'] ?? array();
        
        return rest_ensure_response($categories);
    }
    
    /**
     * Get settings
     */
    public function get_settings($request) {
        $json_manager = new LGD_Map_JSON_Manager();
        $settings = $json_manager->load_settings();
        
        return rest_ensure_response($settings);
    }
}
