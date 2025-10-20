<?php
/**
 * Main plugin class
 *
 * @package LGD_Map
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Main LGD_Map class
 */
class LGD_Map {
    
    /**
     * Plugin version
     */
    const VERSION = LGD_MAP_VERSION;
    
    /**
     * Instance of this class
     */
    private static $instance = null;
    
    /**
     * Admin instance
     */
    public $admin;
    
    /**
     * Frontend instance
     */
    public $frontend;
    
    /**
     * Shortcode instance
     */
    public $shortcode;
    
    /**
     * REST API instance
     */
    public $rest_api;
    
    /**
     * JSON manager instance
     */
    public $json_manager;
    
    /**
     * Theme integration instance
     */
    public $theme_integration;
    
    /**
     * Get instance
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor
     */
    private function __construct() {
        $this->load_dependencies();
        $this->init_hooks();
    }
    
    /**
     * Load plugin dependencies
     */
    private function load_dependencies() {
        require_once LGD_MAP_PLUGIN_DIR . 'includes/class-admin.php';
        require_once LGD_MAP_PLUGIN_DIR . 'includes/class-frontend.php';
        require_once LGD_MAP_PLUGIN_DIR . 'includes/class-shortcode.php';
        require_once LGD_MAP_PLUGIN_DIR . 'includes/class-rest-api.php';
        require_once LGD_MAP_PLUGIN_DIR . 'includes/class-json-manager.php';
        require_once LGD_MAP_PLUGIN_DIR . 'includes/class-theme-integration.php';
    }
    
    /**
     * Initialize hooks
     */
    private function init_hooks() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_enqueue_scripts', array($this, 'admin_enqueue_scripts'));
    }
    
    /**
     * Initialize plugin
     */
    public function init() {
        // Initialize components
        $this->admin = new LGD_Map_Admin();
        $this->frontend = new LGD_Map_Frontend();
        $this->shortcode = new LGD_Map_Shortcode();
        $this->rest_api = new LGD_Map_REST_API();
        $this->json_manager = new LGD_Map_JSON_Manager();
        $this->theme_integration = new LGD_Map_Theme_Integration();
        
        // Load text domain
        load_plugin_textdomain('lgd-map', false, dirname(LGD_MAP_PLUGIN_BASENAME) . '/languages');
    }
    
    /**
     * Enqueue frontend scripts and styles
     */
    public function enqueue_scripts() {
        // Only enqueue on pages with shortcode
        global $post;
        if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'lgd_map')) {
            $this->frontend->enqueue_scripts();
        }
    }
    
    /**
     * Enqueue admin scripts and styles
     */
    public function admin_enqueue_scripts($hook) {
        if (strpos($hook, 'lgd-map') !== false) {
            $this->admin->enqueue_scripts();
        }
    }
    
    /**
     * Run plugin
     */
    public function run() {
        // Plugin is initialized in init hook
    }
    
    /**
     * Plugin activation
     */
    public static function activate() {
        // Initialize JSON manager
        $json_manager = new LGD_Map_JSON_Manager();
        
        // Create data directory and files
        $data_dir = LGD_MAP_PLUGIN_DIR . 'data';
        if (!file_exists($data_dir)) {
            wp_mkdir_p($data_dir);
        }
        
        // Create default data file if not exists
        if (!file_exists($json_manager->get_data_file_path())) {
            $json_manager->create_default_data_file();
        }
        
        // Create default settings file if not exists
        if (!file_exists($json_manager->get_settings_file_path())) {
            $json_manager->create_default_settings_file();
        }
        
        // Set activation flag
        update_option('lgd_map_activated', true);
    }
    
    /**
     * Plugin deactivation
     */
    public static function deactivate() {
        // Flush rewrite rules
        flush_rewrite_rules();
        
        // Remove activation flag
        delete_option('lgd_map_activated');
    }
    
    /**
     * Plugin uninstall
     */
    public static function uninstall() {
        // Remove JSON data files
        $json_manager = new LGD_Map_JSON_Manager();
        $data_file = $json_manager->get_data_file_path();
        $settings_file = $json_manager->get_settings_file_path();
        
        if (file_exists($data_file)) {
            unlink($data_file);
        }
        
        if (file_exists($settings_file)) {
            unlink($settings_file);
        }
        
        // Remove data directory if empty
        $data_dir = dirname($data_file);
        if (is_dir($data_dir) && count(scandir($data_dir)) == 2) {
            rmdir($data_dir);
        }
        
        // Remove options
        delete_option('lgd_map_activated');
    }
}
