<?php
/**
 * Frontend class
 *
 * @package LGD_Map
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * LGD_Map_Frontend class
 */
class LGD_Map_Frontend {
    
    /**
     * Constructor
     */
    public function __construct() {
        // Frontend hooks will be called by main plugin class
    }
    
    /**
     * Enqueue frontend scripts and styles
     */
    public function enqueue_scripts() {
        // Enqueue Leaflet CSS/JS
        wp_enqueue_style('leaflet-css', 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css', array(), '1.7.1');
        wp_enqueue_script('leaflet-js', 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js', array(), '1.7.1', true);
        
        // Enqueue plugin styles
        wp_enqueue_style('lgd-map-style', LGD_MAP_PLUGIN_URL . 'public/css/map.css', array('leaflet-css'), LGD_MAP_VERSION);
        
        // Enqueue plugin scripts
        wp_enqueue_script('lgd-map-main', LGD_MAP_PLUGIN_URL . 'public/js/map.js', array('leaflet-js'), LGD_MAP_VERSION, true);
        
        // Get theme integration data
        $theme_integration = new LGD_Map_Theme_Integration();
        $theme_info = $theme_integration->get_theme_info();
        
        // Localize script with WordPress data
        wp_localize_script('lgd-map-main', 'lgdMapData', array(
            'apiUrl' => rest_url('lgd-map/v1/'),
            'nonce' => wp_create_nonce('wp_rest'),
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'pluginUrl' => LGD_MAP_PLUGIN_URL,
            'theme' => $theme_info,
            'strings' => array(
                'loading' => __('Loading map...', 'lgd-map'),
                'error' => __('Error loading map', 'lgd-map'),
                'noPoints' => __('No points found', 'lgd-map'),
                'close' => __('Close', 'lgd-map'),
                'next' => __('Next', 'lgd-map'),
                'prev' => __('Previous', 'lgd-map'),
            )
        ));
    }
}
