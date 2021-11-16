<?php
/**
 * Plugin Name:       Caniuse Block
 * Description:       CanIUse table embed
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Katya Leurdo
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       caniuse-block
 *
 * @package           caniuse-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/writing-your-first-block-type/
 */
function create_block_caniuse_block_block_init() {
	register_block_type( __DIR__, array(
		'render_callback' => 'ciu_render_cb',
	) );
	wp_set_script_translations( 'leurdo-caniuse-block-editor-script', 'caniuse-block', plugin_dir_path( __FILE__ ) . 'languages' );
}

add_action( 'init', 'create_block_caniuse_block_block_init', 999 );

function ciu_enqueue_scripts() {
	wp_register_script( 'ciu-js', '//cdn.jsdelivr.net/gh/ireade/caniuse-embed/caniuse-embed.min.js', array(), null, true );
}
add_action( 'wp_enqueue_scripts', 'ciu_enqueue_scripts' );

function ciu_render_cb( $attributes, $content ) {

	wp_enqueue_script( 'ciu-js' );

	return $content;
}

