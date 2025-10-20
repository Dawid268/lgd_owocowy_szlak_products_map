<?php
if (!defined('ABSPATH')) {
    exit;
}

class LGD_Map_Shortcode {
    
    public function __construct() {
        add_shortcode('lgd_map', array($this, 'render_shortcode'));
    }
    
    public function render_shortcode($atts) {
        $atts = shortcode_atts(array(
            'width' => '100%',
            'height' => '600px',
            'center_lat' => '51.2465',
            'center_lng' => '22.5684',
            'zoom' => '10',
            'show_legend' => 'true',
            'show_cards' => 'true',
            'legend_position' => 'left'
        ), $atts);
        
        $container_id = 'lgd-map-' . uniqid();
        
        ob_start();
        ?>
        <div id="<?php echo esc_attr($container_id); ?>" class="lgd-map-container" 
             style="width: <?php echo esc_attr($atts['width']); ?>; height: <?php echo esc_attr($atts['height']); ?>;">
            <div id="lgd-map" class="lgd-map" style="width: 100%; height: 100%;"></div>
            
            <?php if ($atts['show_legend'] === 'true'): ?>
            <div id="lgd-legend" class="lgd-legend lgd-legend--<?php echo esc_attr($atts['legend_position']); ?>"></div>
            <?php endif; ?>
            
            <?php if ($atts['show_cards'] === 'true'): ?>
            <div id="lgd-cards" class="lgd-cards"></div>
            <?php endif; ?>
            
            <div id="lgd-lightbox" class="lgd-lightbox" style="display: none;"></div>
        </div>
        
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof LgdMap !== 'undefined') {
                new LgdMap({
                    container: '<?php echo esc_js($container_id); ?>',
                    center: [<?php echo esc_js($atts['center_lat']); ?>, <?php echo esc_js($atts['center_lng']); ?>],
                    zoom: <?php echo esc_js($atts['zoom']); ?>,
                    showLegend: <?php echo esc_js($atts['show_legend']); ?>,
                    showCards: <?php echo esc_js($atts['show_cards']); ?>,
                    legendPosition: '<?php echo esc_js($atts['legend_position']); ?>'
                });
            }
        });
        </script>
        <?php
        return ob_get_clean();
    }
}
