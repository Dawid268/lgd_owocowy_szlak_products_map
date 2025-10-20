<?php
/**
 * Theme integration class
 *
 * @package LGD_Map
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * LGD_Map_Theme_Integration class
 */
class LGD_Map_Theme_Integration {
    
    /**
     * Current theme
     */
    private $current_theme;
    
    /**
     * Theme colors
     */
    private $theme_colors;
    
    /**
     * Theme typography
     */
    private $theme_typography;
    
    /**
     * Constructor
     */
    public function __construct() {
        $this->current_theme = wp_get_theme();
        $this->init_hooks();
    }
    
    /**
     * Initialize hooks
     */
    private function init_hooks() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_theme_styles'), 20);
        add_action('wp_head', array($this, 'add_theme_css_variables'), 5);
        add_filter('lgd_map_css_variables', array($this, 'get_theme_css_variables'));
    }
    
    /**
     * Enqueue theme-specific styles
     */
    public function enqueue_theme_styles() {
        // Only enqueue on pages with shortcode
        global $post;
        if (!is_a($post, 'WP_Post') || !has_shortcode($post->post_content, 'lgd_map')) {
            return;
        }
        
        $this->detect_theme_styles();
        $this->enqueue_theme_css();
    }
    
    /**
     * Detect theme styles
     */
    private function detect_theme_styles() {
        $this->theme_colors = $this->get_theme_colors();
        $this->theme_typography = $this->get_theme_typography();
    }
    
    /**
     * Get theme colors
     */
    private function get_theme_colors() {
        $colors = array();
        
        // Try to get colors from theme customizer
        $colors['primary'] = $this->get_theme_mod('primary_color', '#0073aa');
        $colors['secondary'] = $this->get_theme_mod('secondary_color', '#005177');
        $colors['accent'] = $this->get_theme_mod('accent_color', '#00a0d2');
        $colors['text'] = $this->get_theme_mod('text_color', '#333333');
        $colors['background'] = $this->get_theme_mod('background_color', '#ffffff');
        $colors['border'] = $this->get_theme_mod('border_color', '#dddddd');
        
        // Try to get colors from CSS custom properties
        if (empty($colors['primary'])) {
            $colors = $this->extract_css_custom_properties();
        }
        
        // Fallback to default colors
        if (empty($colors['primary'])) {
            $colors = $this->get_default_colors();
        }
        
        return $colors;
    }
    
    /**
     * Get theme typography
     */
    private function get_theme_typography() {
        $typography = array();
        
        // Try to get typography from theme customizer
        $typography['font_family'] = $this->get_theme_mod('font_family', 'inherit');
        $typography['font_size_base'] = $this->get_theme_mod('font_size_base', '16px');
        $typography['font_size_small'] = $this->get_theme_mod('font_size_small', '14px');
        $typography['font_size_large'] = $this->get_theme_mod('font_size_large', '18px');
        $typography['line_height'] = $this->get_theme_mod('line_height', '1.5');
        $typography['font_weight_normal'] = $this->get_theme_mod('font_weight_normal', '400');
        $typography['font_weight_bold'] = $this->get_theme_mod('font_weight_bold', '700');
        
        // Try to get typography from CSS custom properties
        if ($typography['font_family'] === 'inherit') {
            $css_typography = $this->extract_css_typography_properties();
            $typography = array_merge($typography, $css_typography);
        }
        
        // Fallback to default typography
        if ($typography['font_family'] === 'inherit') {
            $typography = array_merge($typography, $this->get_default_typography());
        }
        
        return $typography;
    }
    
    /**
     * Get theme mod with fallback
     */
    private function get_theme_mod($key, $default = '') {
        return get_theme_mod($key, $default);
    }
    
    /**
     * Extract CSS custom properties from theme
     */
    private function extract_css_custom_properties() {
        $colors = array();
        
        // Get theme's main stylesheet
        $theme_stylesheet = get_stylesheet_directory() . '/style.css';
        if (file_exists($theme_stylesheet)) {
            $css_content = file_get_contents($theme_stylesheet);
            
            // Extract CSS custom properties
            preg_match_all('/--([^:]+):\s*([^;]+);/', $css_content, $matches);
            
            if (!empty($matches[1])) {
                foreach ($matches[1] as $index => $property) {
                    $value = trim($matches[2][$index]);
                    
                    // Map common CSS custom properties to our color scheme
                    switch ($property) {
                        case 'primary-color':
                        case 'primary':
                            $colors['primary'] = $value;
                            break;
                        case 'secondary-color':
                        case 'secondary':
                            $colors['secondary'] = $value;
                            break;
                        case 'accent-color':
                        case 'accent':
                            $colors['accent'] = $value;
                            break;
                        case 'text-color':
                        case 'text':
                            $colors['text'] = $value;
                            break;
                        case 'background-color':
                        case 'background':
                            $colors['background'] = $value;
                            break;
                        case 'border-color':
                        case 'border':
                            $colors['border'] = $value;
                            break;
                    }
                }
            }
        }
        
        return $colors;
    }
    
    /**
     * Extract CSS typography properties from theme
     */
    private function extract_css_typography_properties() {
        $typography = array();
        
        // Get theme's main stylesheet
        $theme_stylesheet = get_stylesheet_directory() . '/style.css';
        if (file_exists($theme_stylesheet)) {
            $css_content = file_get_contents($theme_stylesheet);
            
            // Extract font-family from body or html
            if (preg_match('/body\s*\{[^}]*font-family:\s*([^;]+);/', $css_content, $matches)) {
                $typography['font_family'] = trim($matches[1]);
            } elseif (preg_match('/html\s*\{[^}]*font-family:\s*([^;]+);/', $css_content, $matches)) {
                $typography['font_family'] = trim($matches[1]);
            }
            
            // Extract font-size from body
            if (preg_match('/body\s*\{[^}]*font-size:\s*([^;]+);/', $css_content, $matches)) {
                $typography['font_size_base'] = trim($matches[1]);
            }
            
            // Extract line-height from body
            if (preg_match('/body\s*\{[^}]*line-height:\s*([^;]+);/', $css_content, $matches)) {
                $typography['line_height'] = trim($matches[1]);
            }
        }
        
        return $typography;
    }
    
    /**
     * Get default colors
     */
    private function get_default_colors() {
        return array(
            'primary' => '#0073aa',
            'secondary' => '#005177',
            'accent' => '#00a0d2',
            'text' => '#333333',
            'background' => '#ffffff',
            'border' => '#dddddd',
            'success' => '#46b450',
            'warning' => '#ffb900',
            'error' => '#dc3232',
            'info' => '#00a0d2',
        );
    }
    
    /**
     * Get default typography
     */
    private function get_default_typography() {
        return array(
            'font_family' => '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
            'font_size_base' => '16px',
            'font_size_small' => '14px',
            'font_size_large' => '18px',
            'line_height' => '1.5',
            'font_weight_normal' => '400',
            'font_weight_bold' => '700',
        );
    }
    
    /**
     * Enqueue theme-specific CSS
     */
    private function enqueue_theme_css() {
        $css_variables = $this->get_theme_css_variables();
        
        // Add inline CSS with theme variables
        wp_add_inline_style('lgd-map-style', $css_variables);
    }
    
    /**
     * Add theme CSS variables to head
     */
    public function add_theme_css_variables() {
        // Only add on pages with shortcode
        global $post;
        if (!is_a($post, 'WP_Post') || !has_shortcode($post->post_content, 'lgd_map')) {
            return;
        }
        
        $css_variables = $this->get_theme_css_variables();
        echo '<style id="lgd-map-theme-variables">' . $css_variables . '</style>';
    }
    
    /**
     * Get theme CSS variables
     */
    public function get_theme_css_variables() {
        $colors = $this->theme_colors;
        $typography = $this->theme_typography;
        
        $css = ':root {';
        
        // Color variables
        foreach ($colors as $key => $value) {
            $css .= "--lgd-map-color-{$key}: {$value};";
        }
        
        // Typography variables
        foreach ($typography as $key => $value) {
            $css .= "--lgd-map-{$key}: {$value};";
        }
        
        $css .= '}';
        
        // Apply theme styles to map elements
        $css .= $this->get_theme_override_styles();
        
        return $css;
    }
    
    /**
     * Get theme override styles
     */
    private function get_theme_override_styles() {
        return '
        .lgd-map-container {
            font-family: var(--lgd-map-font_family, inherit);
            color: var(--lgd-map-color-text, #333);
        }
        
        .lgd-map-container .lgd-legend {
            background-color: var(--lgd-map-color-background, #fff);
            border-color: var(--lgd-map-color-border, #ddd);
        }
        
        .lgd-map-container .lgd-legend-item {
            color: var(--lgd-map-color-text, #333);
        }
        
        .lgd-map-container .lgd-legend-item:hover {
            background-color: var(--lgd-map-color-primary, #0073aa);
            color: var(--lgd-map-color-background, #fff);
        }
        
        .lgd-map-container .lgd-card {
            background-color: var(--lgd-map-color-background, #fff);
            border-color: var(--lgd-map-color-border, #ddd);
            color: var(--lgd-map-color-text, #333);
        }
        
        .lgd-map-container .lgd-card-title {
            color: var(--lgd-map-color-primary, #0073aa);
            font-weight: var(--lgd-map-font_weight_bold, 700);
        }
        
        .lgd-map-container .lgd-popup {
            background-color: var(--lgd-map-color-background, #fff);
            color: var(--lgd-map-color-text, #333);
        }
        
        .lgd-map-container .lgd-popup-title {
            color: var(--lgd-map-color-primary, #0073aa);
        }
        
        .lgd-map-container .lgd-lightbox {
            background-color: var(--lgd-map-color-background, #fff);
        }
        
        .lgd-map-container .lgd-lightbox-nav {
            background-color: var(--lgd-map-color-primary, #0073aa);
            color: var(--lgd-map-color-background, #fff);
        }
        ';
    }
    
    /**
     * Get current theme info
     */
    public function get_theme_info() {
        return array(
            'name' => $this->current_theme->get('Name'),
            'version' => $this->current_theme->get('Version'),
            'author' => $this->current_theme->get('Author'),
            'colors' => $this->theme_colors,
            'typography' => $this->theme_typography,
        );
    }
}
