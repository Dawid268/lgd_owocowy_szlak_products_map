<?php
/**
 * Plugin Name: LGD Map
 * Plugin URI: https://github.com/Dawid268/lgd_owocowy_szlak_products_map
 * Description: Interactive map plugin for LGD Owocewy Szlak with points management and theme integration.
 * Version: 1.0.0
 * Author: Dawid268
 * License: GPL v2 or later
 * Text Domain: lgd-map
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) {
    exit;
}

define('LGD_MAP_VERSION', '1.0.0');
define('LGD_MAP_PLUGIN_FILE', __FILE__);
define('LGD_MAP_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('LGD_MAP_PLUGIN_URL', plugin_dir_url(__FILE__));
define('LGD_MAP_PLUGIN_BASENAME', plugin_basename(__FILE__));

require_once LGD_MAP_PLUGIN_DIR . 'includes/class-lgd-map.php';

function lgd_map() {
    return LGD_Map::get_instance();
}

register_activation_hook(__FILE__, array('LGD_Map', 'activate'));
register_deactivation_hook(__FILE__, array('LGD_Map', 'deactivate'));
register_uninstall_hook(__FILE__, array('LGD_Map', 'uninstall'));

lgd_map()->run();
