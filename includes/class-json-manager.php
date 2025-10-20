<?php
if (!defined('ABSPATH')) {
    exit;
}
class LGD_Map_JSON_Manager {
    private $data_file;
    private $settings_file;
    
    public function __construct() {
        $this->data_file = LGD_MAP_PLUGIN_DIR . 'data/data.json';
        $this->settings_file = LGD_MAP_PLUGIN_DIR . 'data/settings.json';
        $this->init_hooks();
    }
    
    private function init_hooks() {
        add_action('wp_ajax_lgd_map_save_point', array($this, 'ajax_save_point'));
        add_action('wp_ajax_lgd_map_delete_point', array($this, 'ajax_delete_point'));
        add_action('wp_ajax_lgd_map_save_settings', array($this, 'ajax_save_settings'));
        add_action('wp_ajax_lgd_map_get_data', array($this, 'ajax_get_data'));
    }
    
    /**
     * Get data file path
     */
    public function get_data_file_path() {
        return $this->data_file;
    }
    
    /**
     * Get settings file path
     */
    public function get_settings_file_path() {
        return $this->settings_file;
    }
    
    /**
     * Ensure data directory exists
     */
    private function ensure_data_directory() {
        $data_dir = dirname($this->data_file);
        if (!file_exists($data_dir)) {
            wp_mkdir_p($data_dir);
        }
    }
    
    /**
     * Load points data from JSON file
     */
    public function load_points() {
        $this->ensure_data_directory();
        
        if (!file_exists($this->data_file)) {
            $this->create_default_data_file();
        }
        
        $json_content = file_get_contents($this->data_file);
        $data = json_decode($json_content, true);
        
        if (!$data || !is_array($data)) {
            return array();
        }
        
        return $data;
    }
    
    /**
     * Save points data to JSON file
     */
    public function save_points($points) {
        $this->ensure_data_directory();
        
        // Validate data
        if (!is_array($points)) {
            return false;
        }
        
        // Sanitize data
        $sanitized_points = array();
        foreach ($points as $point) {
            $sanitized_points[] = $this->sanitize_point($point);
        }
        
        $json_content = json_encode($sanitized_points, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        
        if (file_put_contents($this->data_file, $json_content) === false) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Add new point
     */
    public function add_point($point_data) {
        $points = $this->load_points();
        
        // Generate unique ID
        $point_data['id'] = $this->generate_unique_id($points);
        
        // Add timestamp
        $point_data['created_at'] = current_time('mysql');
        $point_data['updated_at'] = current_time('mysql');
        
        $points[] = $point_data;
        
        return $this->save_points($points);
    }
    
    /**
     * Update existing point
     */
    public function update_point($point_id, $point_data) {
        $points = $this->load_points();
        
        foreach ($points as $index => $point) {
            if ($point['id'] == $point_id) {
                $point_data['id'] = $point_id;
                $point_data['created_at'] = $point['created_at'];
                $point_data['updated_at'] = current_time('mysql');
                $points[$index] = $point_data;
                return $this->save_points($points);
            }
        }
        
        return false;
    }
    
    /**
     * Delete point
     */
    public function delete_point($point_id) {
        $points = $this->load_points();
        
        foreach ($points as $index => $point) {
            if ($point['id'] == $point_id) {
                unset($points[$index]);
                $points = array_values($points); // Re-index array
                return $this->save_points($points);
            }
        }
        
        return false;
    }
    
    /**
     * Get point by ID
     */
    public function get_point($point_id) {
        $points = $this->load_points();
        
        foreach ($points as $point) {
            if ($point['id'] == $point_id) {
                return $point;
            }
        }
        
        return null;
    }
    
    /**
     * Load settings from JSON file
     */
    public function load_settings() {
        $this->ensure_data_directory();
        
        if (!file_exists($this->settings_file)) {
            $this->create_default_settings_file();
        }
        
        $json_content = file_get_contents($this->settings_file);
        $settings = json_decode($json_content, true);
        
        if (!$settings || !is_array($settings)) {
            return $this->get_default_settings();
        }
        
        return $settings;
    }
    
    /**
     * Save settings to JSON file
     */
    public function save_settings($settings) {
        $this->ensure_data_directory();
        
        // Validate and sanitize settings
        $sanitized_settings = $this->sanitize_settings($settings);
        
        $json_content = json_encode($sanitized_settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        
        if (file_put_contents($this->settings_file, $json_content) === false) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Create default data file
     */
    private function create_default_data_file() {
        $default_data = array(
            array(
                'id' => 1,
                'name' => 'Przykładowy punkt',
                'description' => 'To jest przykładowy punkt na mapie',
                'latitude' => 51.2465,
                'longitude' => 22.5684,
                'category' => '1',
                'legendName' => 'Przykład',
                'legendSubName' => 'Podkategoria',
                'phone' => '+48 123 456 789',
                'website' => 'https://example.com',
                'image' => 'example.webp',
                'images' => array('example1.webp', 'example2.webp'),
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            )
        );
        
        $json_content = json_encode($default_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        file_put_contents($this->data_file, $json_content);
    }
    
    /**
     * Create default settings file
     */
    private function create_default_settings_file() {
        $default_settings = $this->get_default_settings();
        $json_content = json_encode($default_settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        file_put_contents($this->settings_file, $json_content);
    }
    
    /**
     * Get default settings
     */
    private function get_default_settings() {
        return array(
            'map' => array(
                'default_lat' => 51.2465,
                'default_lng' => 22.5684,
                'default_zoom' => 10,
                'show_legend' => true,
                'show_cards' => true,
                'legend_position' => 'left'
            ),
            'display' => array(
                'width' => '100%',
                'height' => '600px',
                'theme' => 'default'
            ),
            'categories' => array(
                '1' => 'Dom do wynajęcia',
                '2' => 'Pokoje restauracje',
                '3' => 'Hotel',
                '4' => 'Lody',
                '5' => 'Pokoje',
                '6' => 'Rekolekcje',
                '7' => 'Restauracje',
                '8' => 'Kampery'
            )
        );
    }
    
    /**
     * Generate unique ID
     */
    private function generate_unique_id($points) {
        $max_id = 0;
        foreach ($points as $point) {
            if (isset($point['id']) && $point['id'] > $max_id) {
                $max_id = $point['id'];
            }
        }
        return $max_id + 1;
    }
    
    /**
     * Sanitize point data
     */
    private function sanitize_point($point) {
        return array(
            'id' => intval($point['id'] ?? 0),
            'name' => sanitize_text_field($point['name'] ?? ''),
            'description' => sanitize_textarea_field($point['description'] ?? ''),
            'latitude' => floatval($point['latitude'] ?? 0),
            'longitude' => floatval($point['longitude'] ?? 0),
            'category' => sanitize_text_field($point['category'] ?? ''),
            'legendName' => sanitize_text_field($point['legendName'] ?? ''),
            'legendSubName' => sanitize_text_field($point['legendSubName'] ?? ''),
            'phone' => sanitize_text_field($point['phone'] ?? ''),
            'website' => esc_url_raw($point['website'] ?? ''),
            'image' => sanitize_text_field($point['image'] ?? ''),
            'images' => is_array($point['images'] ?? array()) ? array_map('sanitize_text_field', $point['images']) : array(),
            'created_at' => sanitize_text_field($point['created_at'] ?? ''),
            'updated_at' => sanitize_text_field($point['updated_at'] ?? '')
        );
    }
    
    /**
     * Sanitize settings data
     */
    private function sanitize_settings($settings) {
        $sanitized = array();
        
        if (isset($settings['map'])) {
            $sanitized['map'] = array(
                'default_lat' => floatval($settings['map']['default_lat'] ?? 51.2465),
                'default_lng' => floatval($settings['map']['default_lng'] ?? 22.5684),
                'default_zoom' => intval($settings['map']['default_zoom'] ?? 10),
                'show_legend' => (bool)($settings['map']['show_legend'] ?? true),
                'show_cards' => (bool)($settings['map']['show_cards'] ?? true),
                'legend_position' => sanitize_text_field($settings['map']['legend_position'] ?? 'left')
            );
        }
        
        if (isset($settings['display'])) {
            $sanitized['display'] = array(
                'width' => sanitize_text_field($settings['display']['width'] ?? '100%'),
                'height' => sanitize_text_field($settings['display']['height'] ?? '600px'),
                'theme' => sanitize_text_field($settings['display']['theme'] ?? 'default')
            );
        }
        
        if (isset($settings['categories'])) {
            $sanitized['categories'] = array();
            foreach ($settings['categories'] as $key => $value) {
                $sanitized['categories'][sanitize_text_field($key)] = sanitize_text_field($value);
            }
        }
        
        return $sanitized;
    }
    
    /**
     * AJAX: Save point
     */
    public function ajax_save_point() {
        check_ajax_referer('lgd_map_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }
        
        $point_data = $_POST['point'] ?? array();
        
        if (isset($point_data['id']) && !empty($point_data['id'])) {
            // Update existing point
            $result = $this->update_point($point_data['id'], $point_data);
        } else {
            // Add new point
            $result = $this->add_point($point_data);
        }
        
        if ($result) {
            wp_send_json_success(array('message' => __('Point saved successfully', 'lgd-map')));
        } else {
            wp_send_json_error(array('message' => __('Failed to save point', 'lgd-map')));
        }
    }
    
    /**
     * AJAX: Delete point
     */
    public function ajax_delete_point() {
        check_ajax_referer('lgd_map_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }
        
        $point_id = intval($_POST['point_id'] ?? 0);
        
        if ($this->delete_point($point_id)) {
            wp_send_json_success(array('message' => __('Point deleted successfully', 'lgd-map')));
        } else {
            wp_send_json_error(array('message' => __('Failed to delete point', 'lgd-map')));
        }
    }
    
    /**
     * AJAX: Save settings
     */
    public function ajax_save_settings() {
        check_ajax_referer('lgd_map_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }
        
        $settings = $_POST['settings'] ?? array();
        
        if ($this->save_settings($settings)) {
            wp_send_json_success(array('message' => __('Settings saved successfully', 'lgd-map')));
        } else {
            wp_send_json_error(array('message' => __('Failed to save settings', 'lgd-map')));
        }
    }
    
    /**
     * AJAX: Get data
     */
    public function ajax_get_data() {
        check_ajax_referer('lgd_map_nonce', 'nonce');
        
        $data = array(
            'points' => $this->load_points(),
            'settings' => $this->load_settings()
        );
        
        wp_send_json_success($data);
    }
}
