<?php

/**
 * REST API logic for updates.
 *
 * @since 0.1
 */
final class FL_Assistant_REST_Updates {

	/**
	 * Register routes.
	 *
	 * @since  0.1
	 * @return void
	 */
	static public function register_routes() {
		register_rest_route(
			FL_Assistant_REST::$namespace, '/updates', array(
				array(
					'methods'  => WP_REST_Server::READABLE,
					'callback' => __CLASS__ . '::updates',
				),
			)
		);
	}

	/**
	 * Returns an array of response data for a single plugin.
	 *
	 * @since  0.1
	 * @param object $update
	 * @param array $plugin
	 * @return array
	 */
	static public function get_plugin_response_data( $update, $plugin ) {
		$thumbnail = null;

		if ( isset( $update->icons ) ) {
			if ( isset( $update->icons['2x'] ) ) {
				$thumbnail = $update->icons['2x'];
			} elseif ( isset( $update->icons['1x'] ) ) {
				$thumbnail = $update->icons['1x'];
			}
		}

		return array(
			'author'    => $plugin['AuthorName'],
			'thumbnail' => $thumbnail,
			'title'     => $plugin['Name'],
		);
	}

	/**
	 * Returns an array of response data for a single theme.
	 *
	 * @since  0.1
	 * @param object $update
	 * @param object $theme
	 * @return array
	 */
	static public function get_theme_response_data( $update, $theme ) {
		$thumbnail = null;

		if ( isset( $update->icons ) ) {
			if ( isset( $update->icons['2x'] ) ) {
				$thumbnail = $update->icons['2x'];
			} elseif ( isset( $update->icons['1x'] ) ) {
				$thumbnail = $update->icons['1x'];
			}
		}

		return array(
			'author'    => strip_tags( $theme->Author ),
			'thumbnail' => $theme->get_screenshot(),
			'title'     => $theme->Name,
		);
	}

	/**
	 * Returns an array of updates and related data.
	 *
	 * @since  0.1
	 * @param object $request
	 * @return array
	 */
	static public function updates( $request ) {
		$response 			 = array();
		$can_update_plugins  = current_user_can( 'update_plugins' );
		$can_update_themes   = current_user_can( 'update_themes' );

		if ( $can_update_plugins ) {
			$update_plugins = get_site_transient( 'update_plugins' );
			if ( ! empty( $update_plugins->response ) ) {
				$plugins = array(
					'label' => __( 'Plugins', 'fl-assistant' ),
					'items' => [],
				);
				foreach ( $update_plugins->response as $key => $update ) {
					$plugin     	    = get_plugin_data( trailingslashit( WP_PLUGIN_DIR ) . $key );
					$plugins['items'][] = self::get_plugin_response_data( $update, $plugin );
				}
				$response[] = $plugins;
			}
		}

		if ( $can_update_themes ) {
			$update_themes = get_site_transient( 'update_themes' );
			if ( ! empty( $update_themes->response ) ) {
				$themes = array(
					'label' => __( 'Themes', 'fl-assistant' ),
					'items' => [],
				);
				foreach ( $update_themes->response as $key => $update ) {
					$theme      	   = wp_get_theme( $key );
					$themes['items'][] = self::get_theme_response_data( $update, $theme );
				}
				$response[] = $themes;
			}
		}

		return rest_ensure_response( $response );
	}
}

FL_Assistant_REST_Updates::register_routes();
