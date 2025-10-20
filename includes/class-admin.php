<?php
/**
 * Admin interface class
 *
 * @package LGD_Map
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * LGD_Map_Admin class
 */
class LGD_Map_Admin {
    
    /**
     * Constructor
     */
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        // Main menu page
        add_menu_page(
            __('LGD Map', 'lgd-map'),
            __('LGD Map', 'lgd-map'),
            'manage_options',
            'lgd-map',
            array($this, 'admin_page'),
            'dashicons-location-alt',
            30
        );
        
        // Points submenu
        add_submenu_page(
            'lgd-map',
            __('Map Points', 'lgd-map'),
            __('Points', 'lgd-map'),
            'manage_options',
            'lgd-map-points',
            array($this, 'points_page')
        );
        
        // Settings submenu
        add_submenu_page(
            'lgd-map',
            __('Settings', 'lgd-map'),
            __('Settings', 'lgd-map'),
            'manage_options',
            'lgd-map-settings',
            array($this, 'settings_page')
        );
        
        // Theme Integration submenu
        add_submenu_page(
            'lgd-map',
            __('Theme Integration', 'lgd-map'),
            __('Theme Integration', 'lgd-map'),
            'manage_options',
            'lgd-map-theme',
            array($this, 'theme_page')
        );
    }
    
    /**
     * Register settings
     */
    public function register_settings() {
        register_setting('lgd_map_settings', 'lgd_map_settings');
        
        add_settings_section(
            'lgd_map_general',
            __('General Settings', 'lgd-map'),
            array($this, 'general_section_callback'),
            'lgd_map_settings'
        );
        
        add_settings_field(
            'default_lat',
            __('Default Latitude', 'lgd-map'),
            array($this, 'default_lat_callback'),
            'lgd_map_settings',
            'lgd_map_general'
        );
        
        add_settings_field(
            'default_lng',
            __('Default Longitude', 'lgd-map'),
            array($this, 'default_lng_callback'),
            'lgd_map_settings',
            'lgd_map_general'
        );
        
        add_settings_field(
            'default_zoom',
            __('Default Zoom Level', 'lgd-map'),
            array($this, 'default_zoom_callback'),
            'lgd_map_settings',
            'lgd_map_general'
        );
    }
    
    /**
     * Admin page callback
     */
    public function admin_page() {
        $theme_integration = new LGD_Map_Theme_Integration();
        $theme_info = $theme_integration->get_theme_info();
        ?>
        <div class="wrap">
            <h1><?php _e('LGD Map Dashboard', 'lgd-map'); ?></h1>
            
            <div class="lgd-map-dashboard">
                <div class="lgd-map-stats">
                    <?php
                    $points_count = wp_count_posts('lgd_point');
                    $published_points = $points_count->publish;
                    ?>
                    <div class="lgd-stat-box">
                        <h3><?php _e('Total Points', 'lgd-map'); ?></h3>
                        <p class="lgd-stat-number"><?php echo esc_html($published_points); ?></p>
                    </div>
                    
                    <div class="lgd-stat-box">
                        <h3><?php _e('Categories', 'lgd-map'); ?></h3>
                        <p class="lgd-stat-number">8</p>
                    </div>
                    
                    <div class="lgd-stat-box">
                        <h3><?php _e('Current Theme', 'lgd-map'); ?></h3>
                        <p class="lgd-stat-number"><?php echo esc_html($theme_info['name']); ?></p>
                    </div>
                </div>
                
                <div class="lgd-map-preview">
                    <h2><?php _e('Map Preview', 'lgd-map'); ?></h2>
                    <div id="lgd-map-admin-preview" style="width: 100%; height: 400px;"></div>
                </div>
                
                <div class="lgd-map-shortcode">
                    <h2><?php _e('Shortcode', 'lgd-map'); ?></h2>
                    <p><?php _e('Use this shortcode to display the map on your pages:', 'lgd-map'); ?></p>
                    <code>[lgd_map]</code>
                    
                    <h3><?php _e('Shortcode Options', 'lgd-map'); ?></h3>
                    <table class="widefat">
                        <thead>
                            <tr>
                                <th><?php _e('Attribute', 'lgd-map'); ?></th>
                                <th><?php _e('Default', 'lgd-map'); ?></th>
                                <th><?php _e('Description', 'lgd-map'); ?></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>width</td>
                                <td>100%</td>
                                <td><?php _e('Map width', 'lgd-map'); ?></td>
                            </tr>
                            <tr>
                                <td>height</td>
                                <td>600px</td>
                                <td><?php _e('Map height', 'lgd-map'); ?></td>
                            </tr>
                            <tr>
                                <td>center_lat</td>
                                <td>51.2465</td>
                                <td><?php _e('Center latitude', 'lgd-map'); ?></td>
                            </tr>
                            <tr>
                                <td>center_lng</td>
                                <td>22.5684</td>
                                <td><?php _e('Center longitude', 'lgd-map'); ?></td>
                            </tr>
                            <tr>
                                <td>zoom</td>
                                <td>10</td>
                                <td><?php _e('Zoom level', 'lgd-map'); ?></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <style>
        .lgd-map-dashboard {
            margin-top: 20px;
        }
        
        .lgd-map-stats {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .lgd-stat-box {
            background: #fff;
            border: 1px solid #ccd0d4;
            border-radius: 4px;
            padding: 20px;
            text-align: center;
            min-width: 150px;
        }
        
        .lgd-stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #0073aa;
            margin: 10px 0 0 0;
        }
        
        .lgd-map-preview,
        .lgd-map-shortcode {
            background: #fff;
            border: 1px solid #ccd0d4;
            border-radius: 4px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .lgd-map-shortcode code {
            background: #f1f1f1;
            padding: 10px;
            border-radius: 4px;
            font-size: 14px;
        }
        </style>
        <?php
    }
    
    /**
     * Points page callback
     */
    public function points_page() {
        ?>
        <div class="wrap">
            <h1><?php _e('Map Points Management', 'lgd-map'); ?></h1>
            
            <p>
                <a href="<?php echo admin_url('post-new.php?post_type=lgd_point'); ?>" class="button button-primary">
                    <?php _e('Add New Point', 'lgd-map'); ?>
                </a>
            </p>
            
            <div class="lgd-points-list">
                <?php
                $points = get_posts(array(
                    'post_type' => 'lgd_point',
                    'numberposts' => -1,
                    'post_status' => 'publish',
                ));
                
                if ($points) {
                    echo '<table class="wp-list-table widefat fixed striped">';
                    echo '<thead><tr>';
                    echo '<th>' . __('Name', 'lgd-map') . '</th>';
                    echo '<th>' . __('Category', 'lgd-map') . '</th>';
                    echo '<th>' . __('Coordinates', 'lgd-map') . '</th>';
                    echo '<th>' . __('Actions', 'lgd-map') . '</th>';
                    echo '</tr></thead>';
                    echo '<tbody>';
                    
                    foreach ($points as $point) {
                        $latitude = get_post_meta($point->ID, 'latitude', true);
                        $longitude = get_post_meta($point->ID, 'longitude', true);
                        $category = get_post_meta($point->ID, 'category', true);
                        
                        echo '<tr>';
                        echo '<td><strong>' . esc_html($point->post_title) . '</strong></td>';
                        echo '<td>' . esc_html($category) . '</td>';
                        echo '<td>' . esc_html($latitude) . ', ' . esc_html($longitude) . '</td>';
                        echo '<td>';
                        echo '<a href="' . get_edit_post_link($point->ID) . '" class="button button-small">' . __('Edit', 'lgd-map') . '</a>';
                        echo ' <a href="' . get_delete_post_link($point->ID) . '" class="button button-small button-link-delete">' . __('Delete', 'lgd-map') . '</a>';
                        echo '</td>';
                        echo '</tr>';
                    }
                    
                    echo '</tbody></table>';
                } else {
                    echo '<p>' . __('No points found.', 'lgd-map') . '</p>';
                }
                ?>
            </div>
        </div>
        <?php
    }
    
    /**
     * Settings page callback
     */
    public function settings_page() {
        ?>
        <div class="wrap">
            <h1><?php _e('LGD Map Settings', 'lgd-map'); ?></h1>
            
            <form method="post" action="options.php">
                <?php
                settings_fields('lgd_map_settings');
                do_settings_sections('lgd_map_settings');
                submit_button();
                ?>
            </form>
        </div>
        <?php
    }
    
    /**
     * Theme integration page callback
     */
    public function theme_page() {
        $theme_integration = new LGD_Map_Theme_Integration();
        $theme_info = $theme_integration->get_theme_info();
        ?>
        <div class="wrap">
            <h1><?php _e('Theme Integration', 'lgd-map'); ?></h1>
            
            <div class="lgd-theme-info">
                <h2><?php _e('Current Theme Information', 'lgd-map'); ?></h2>
                <table class="widefat">
                    <tbody>
                        <tr>
                            <td><strong><?php _e('Theme Name', 'lgd-map'); ?></strong></td>
                            <td><?php echo esc_html($theme_info['name']); ?></td>
                        </tr>
                        <tr>
                            <td><strong><?php _e('Theme Version', 'lgd-map'); ?></strong></td>
                            <td><?php echo esc_html($theme_info['version']); ?></td>
                        </tr>
                        <tr>
                            <td><strong><?php _e('Theme Author', 'lgd-map'); ?></strong></td>
                            <td><?php echo esc_html($theme_info['author']); ?></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="lgd-theme-colors">
                <h2><?php _e('Detected Theme Colors', 'lgd-map'); ?></h2>
                <table class="widefat">
                    <thead>
                        <tr>
                            <th><?php _e('Color Type', 'lgd-map'); ?></th>
                            <th><?php _e('Value', 'lgd-map'); ?></th>
                            <th><?php _e('Preview', 'lgd-map'); ?></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($theme_info['colors'] as $key => $value): ?>
                        <tr>
                            <td><strong><?php echo esc_html(ucfirst($key)); ?></strong></td>
                            <td><code><?php echo esc_html($value); ?></code></td>
                            <td><span class="lgd-color-preview" style="background-color: <?php echo esc_attr($value); ?>; width: 20px; height: 20px; display: inline-block; border: 1px solid #ccc;"></span></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            
            <div class="lgd-theme-typography">
                <h2><?php _e('Detected Theme Typography', 'lgd-map'); ?></h2>
                <table class="widefat">
                    <thead>
                        <tr>
                            <th><?php _e('Typography Property', 'lgd-map'); ?></th>
                            <th><?php _e('Value', 'lgd-map'); ?></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($theme_info['typography'] as $key => $value): ?>
                        <tr>
                            <td><strong><?php echo esc_html(ucfirst(str_replace('_', ' ', $key))); ?></strong></td>
                            <td><code><?php echo esc_html($value); ?></code></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            
            <div class="lgd-theme-preview">
                <h2><?php _e('Theme Integration Preview', 'lgd-map'); ?></h2>
                <p><?php _e('The map will automatically use your theme\'s colors and typography. Here\'s how it will look:', 'lgd-map'); ?></p>
                <div class="lgd-preview-container" style="border: 1px solid #ddd; padding: 20px; background: #f9f9f9;">
                    <div class="lgd-preview-legend" style="background: <?php echo esc_attr($theme_info['colors']['background']); ?>; border: 1px solid <?php echo esc_attr($theme_info['colors']['border']); ?>; padding: 10px; margin-bottom: 10px;">
                        <h3 style="color: <?php echo esc_attr($theme_info['colors']['primary']); ?>; font-family: <?php echo esc_attr($theme_info['typography']['font_family']); ?>;"><?php _e('Legend Title', 'lgd-map'); ?></h3>
                        <div style="color: <?php echo esc_attr($theme_info['colors']['text']); ?>; font-family: <?php echo esc_attr($theme_info['typography']['font_family']); ?>;"><?php _e('Legend item', 'lgd-map'); ?></div>
                    </div>
                    <div class="lgd-preview-card" style="background: <?php echo esc_attr($theme_info['colors']['background']); ?>; border: 1px solid <?php echo esc_attr($theme_info['colors']['border']); ?>; padding: 15px;">
                        <h4 style="color: <?php echo esc_attr($theme_info['colors']['primary']); ?>; font-family: <?php echo esc_attr($theme_info['typography']['font_family']); ?>;"><?php _e('Card Title', 'lgd-map'); ?></h4>
                        <p style="color: <?php echo esc_attr($theme_info['colors']['text']); ?>; font-family: <?php echo esc_attr($theme_info['typography']['font_family']); ?>;"><?php _e('Card description text', 'lgd-map'); ?></p>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }
    
    /**
     * General section callback
     */
    public function general_section_callback() {
        echo '<p>' . __('Configure default map settings.', 'lgd-map') . '</p>';
    }
    
    /**
     * Default latitude callback
     */
    public function default_lat_callback() {
        $options = get_option('lgd_map_settings');
        $value = isset($options['default_lat']) ? $options['default_lat'] : '51.2465';
        echo '<input type="number" step="any" name="lgd_map_settings[default_lat]" value="' . esc_attr($value) . '" />';
    }
    
    /**
     * Default longitude callback
     */
    public function default_lng_callback() {
        $options = get_option('lgd_map_settings');
        $value = isset($options['default_lng']) ? $options['default_lng'] : '22.5684';
        echo '<input type="number" step="any" name="lgd_map_settings[default_lng]" value="' . esc_attr($value) . '" />';
    }
    
    /**
     * Default zoom callback
     */
    public function default_zoom_callback() {
        $options = get_option('lgd_map_settings');
        $value = isset($options['default_zoom']) ? $options['default_zoom'] : '10';
        echo '<input type="number" min="1" max="18" name="lgd_map_settings[default_zoom]" value="' . esc_attr($value) . '" />';
    }
    
    /**
     * Enqueue admin scripts
     */
    public function enqueue_scripts() {
        wp_enqueue_style('lgd-map-admin', LGD_MAP_PLUGIN_URL . 'admin/css/admin.css', array(), LGD_MAP_VERSION);
        wp_enqueue_script('lgd-map-admin', LGD_MAP_PLUGIN_URL . 'admin/js/admin.js', array('jquery'), LGD_MAP_VERSION, true);
    }
}
