<?php
if (!defined('ABSPATH')) {
    exit;
}
class LGD_Map {
    const VERSION = LGD_MAP_VERSION;
    private static $instance = null;
    public $admin;
    public $frontend;
    public $shortcode;
    public $rest_api;
    public $json_manager;
    public $theme_integration;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        $this->load_dependencies();
        $this->init_hooks();
    }
    
    private function load_dependencies() {
        require_once LGD_MAP_PLUGIN_DIR . 'includes/class-admin.php';
        require_once LGD_MAP_PLUGIN_DIR . 'includes/class-frontend.php';
        require_once LGD_MAP_PLUGIN_DIR . 'includes/class-shortcode.php';
        require_once LGD_MAP_PLUGIN_DIR . 'includes/class-rest-api.php';
        require_once LGD_MAP_PLUGIN_DIR . 'includes/class-json-manager.php';
        require_once LGD_MAP_PLUGIN_DIR . 'includes/class-theme-integration.php';
    }
    
    private function init_hooks() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_enqueue_scripts', array($this, 'admin_enqueue_scripts'));
    }
    
    public function init() {
        $this->load_textdomain();
        $this->admin = new LGD_Map_Admin();
        $this->frontend = new LGD_Map_Frontend();
        $this->shortcode = new LGD_Map_Shortcode();
        $this->rest_api = new LGD_Map_REST_API();
        $this->json_manager = new LGD_Map_JSON_Manager();
        $this->theme_integration = new LGD_Map_Theme_Integration();
    }
    
    private function load_textdomain() {
        $locale = apply_filters('plugin_locale', get_locale(), 'lgd-map');
        $mofile = LGD_MAP_PLUGIN_DIR . 'languages/lgd-map-' . $locale . '.mo';
        
        if (file_exists($mofile)) {
            load_textdomain('lgd-map', $mofile);
        } else {
            load_plugin_textdomain('lgd-map', false, dirname(LGD_MAP_PLUGIN_BASENAME) . '/languages');
        }
    }
    
    public function enqueue_scripts() {
        global $post;
        if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'lgd_map')) {
            $this->frontend->enqueue_scripts();
        }
    }
    
    public function admin_enqueue_scripts($hook) {
        if (strpos($hook, 'lgd-map') !== false) {
            $this->admin->enqueue_scripts();
        }
    }
    
    public function run() {
    }
    
    public static function activate() {
        $json_manager = new LGD_Map_JSON_Manager();
        $data_dir = LGD_MAP_PLUGIN_DIR . 'data';
        if (!file_exists($data_dir)) {
            wp_mkdir_p($data_dir);
        }
        if (!file_exists($json_manager->get_data_file_path())) {
            $json_manager->create_default_data_file();
        }
        if (!file_exists($json_manager->get_settings_file_path())) {
            $json_manager->create_default_settings_file();
        }
        update_option('lgd_map_activated', true);
    }
    
    public static function deactivate() {
        flush_rewrite_rules();
        delete_option('lgd_map_activated');
    }
    
    public static function uninstall() {
        $json_manager = new LGD_Map_JSON_Manager();
        $data_file = $json_manager->get_data_file_path();
        $settings_file = $json_manager->get_settings_file_path();
        if (file_exists($data_file)) {
            unlink($data_file);
        }
        if (file_exists($settings_file)) {
            unlink($settings_file);
        }
        $data_dir = dirname($data_file);
        if (is_dir($data_dir) && count(scandir($data_dir)) == 2) {
            rmdir($data_dir);
        }
        delete_option('lgd_map_activated');
    }
}
