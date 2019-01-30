<?php

/**
 * Handles working with backend assistant data.
 *
 * @since 0.1
 */
class FL_Assistant_Data {

	/**
	 * Default state for the current user.
	 *
	 * @since 0.1
	 * @var string $default_user_state
	 */
	static public $default_user_state = array(
		'activeApp' => 'fl-dashboard',
		'showUI'    => true,
	);

	/**
	 * Returns an array of all assistant data.
	 *
	 * NOTE: Kept in alphabetical order.
	 *
	 * @since 0.1
	 * @return array
	 */
	static public function get_all() {
		$user_state = self::get_current_user_state();

		return array(
			'activeApp'       => $user_state['activeApp'],
			'apiNonce'        => wp_create_nonce( 'wp_rest' ),
			'apiRoot'         => esc_url_raw( get_rest_url() ),
			'currentPageView' => self::get_current_view(),
			'contentTypes'    => self::get_post_types(),
			'currentUser'     => self::get_current_user_data(),
			'pluginURL'       => FL_ASSISTANT_URL,
			'showUI'          => $user_state['showUI'],
			'taxonomies'      => self::get_taxonomies(),
			'dashboardApp'    => [
				'adminActions' => self::get_admin_actions(),
			],
		);
	}

	/**
	 * Get post type slugs and names.
	 *
	 * @since 0.1
	 * @return array
	 */
	static public function get_post_types() {
		$data  = [];
		$types = get_post_types(
			array(
				'public' => true,
			), 'objects'
		);

		foreach ( $types as $slug => $type ) {
			if ( 'attachment' === $slug ) {
				continue;
			}
			$data[ $slug ] = esc_html( $type->labels->name );
		}

		return $data;
	}

	/**
	 * Get taxonomy slugs and names.
	 *
	 * @since 0.1
	 * @return array
	 */
	static public function get_taxonomies() {
		$data  = [];
		$types = self::get_post_types();

		foreach ( $types as $type_slug => $type_name ) {
			$taxonomies = get_object_taxonomies( $type_slug, 'objects' );
			foreach ( $taxonomies as $taxonomy_slug => $taxonomy ) {
				if ( ! $taxonomy->public || ! $taxonomy->show_ui || 'post_format' == $taxonomy_slug ) {
					continue;
				}
				$data[ $taxonomy_slug ] = $taxonomy->label;
			}
		}

		return $data;
	}

	/**
	 * Get info about the current page view.
	 *
	 * @since 0.1
	 * @return array
	 */
	static public function get_current_view() {
		$data    = [];
		$actions = [];
		$intro   = __( 'Currently Viewing', 'fl-assistant' );
		$name    = __( 'Untitled', 'fl-assistant' );

		$obj                    = get_queried_object();
		$data['queried_object'] = $obj;

		if ( is_404() ) {

			$name = __( 'Page Not Found', 'fl-assistant' );

		} elseif ( is_search() ) {

			$intro = __( 'Currently Viewing Search Results For', 'fl-assistant' );
			$name  = get_search_query();

		} elseif ( is_post_type_archive() ) {

			$post_type = get_post_type_object( 'post' );
			$intro     = __( 'Currently Viewing Post Type Archive', 'fl-assistant' );
			$name      = $post_type->labels->singular;

		} elseif ( is_tax() || is_category() || is_tag() ) {

			$tax    = get_taxonomy( $obj->taxonomy );
			$labels = $tax->labels;

			$intro = sprintf( esc_html__( 'Currently Viewing %s', 'fl-assistant' ), $labels->singular_name );
			$name  = $obj->name;

			$actions[] = [
				'label'      => $labels->edit_item,
				'href'       => get_edit_term_link( $obj->term_id, $obj->taxonomy, null ),
				'capability' => 'manage_categories',
			];

		} elseif ( is_singular() || is_attachment() ) {

			$labels    = $post_type = get_post_type_object( get_post_type() )->labels;
			$post_type = $labels->singular_name;
			$intro     = sprintf( esc_html__( 'Currently Viewing %s', 'fl-assistant' ), $post_type );
			$name      = $obj->post_title;

			if ( is_attachment() ) {
				$meta = wp_get_attachment_metadata( $obj->ID );
				$name = basename( $meta['file'] );
			}

			$actions[] = [
				'label'      => $labels->edit_item,
				'href'       => get_edit_post_link( $obj->ID, '' ),
				'capability' => 'edit_pages',
			];

		} elseif ( is_author() ) {

			$intro = __( 'Currently Viewing Author', 'fl-assistant' );
			$name  = wp_get_current_user()->display_name;

		}

		$data['intro']   = $intro;
		$data['name']    = $name;
		$data['actions'] = self::filter_actions_by_capability( $actions );

		$theme         = wp_get_theme();
		$data['theme'] = [
			'name'       => $theme->get( 'Name' ),
			'team'       => $theme->get( 'Author' ),
			'screenshot' => $theme->get_screenshot(),
			'version'    => $theme->get( 'Version' ),
		];

		return $data;
	}

	/**
	 * Filter an array of actions by their capability
	 *
	 * @since 0.1
	 * @param Array $actions
	 * @return array
	 */
	static public function filter_actions_by_capability( $actions = [], $exclude_unset = true ) {

		foreach ( $actions as $i => $action ) {
			$defaults = [
				'label'      => '',
				'capability' => '',
			];
			$action   = wp_parse_args( $action, $defaults );
			$cap      = $action['capability'];

			// Remove actions without a capability set
			if ( $exclude_unset && ( '' === $cap || empty( $cap ) ) ) {
				unset( $actions[ $i ] );
			}
			// Test capability
			if ( is_string( $cap ) && ! current_user_can( $cap ) ) {
				unset( $actions[ $i ] );
			}

			// Test array of capabilities
			if ( is_array( $cap ) ) {
				foreach ( $cap as $single_cap ) {
					if ( ! current_user_can( $single_cap ) ) {
						unset( $actions[ $i ] );
					}
				}
			}
		}

		return $actions;
	}

	/**
	 * Get an action set for allowed admin links.
	 *
	 * @since 0.1
	 * @return array
	 */
	static public function get_admin_actions() {
		$actions = [];

		// Customize Link
		if ( $customize_url = self::get_customize_url() ) {
			$actions[] = [
				'label'      => __( 'Customize' ),
				'href'       => $customize_url,
				'capability' => 'customize',
			];
		}

		// Your User Profile Link
		$user_id = get_current_user_id();

		if ( current_user_can( 'read' ) ) {
			$profile_url = get_edit_profile_url( $user_id );
		}
		$actions[] = [
			'label'      => __( 'Your Profile' ),
			'href'       => $profile_url,
			'capability' => 'read',
		];

		// About Link
		if ( current_user_can( 'read' ) ) {
			$about_url = self_admin_url( 'about.php' );
		}
		$actions[] = [
			'label'      => __( 'About WordPress' ),
			'href'       => $about_url,
			'capability' => 'read',
		];

		return self::filter_actions_by_capability( $actions );
	}

	/**
	 * Get customize url
	 *
	 * @since 0.1
	 * @return string
	 */
	static public function get_customize_url() {
		global $wp_customize;

		// Don't show for users who can't access the customizer or when in the admin.
		if ( ! current_user_can( 'customize' ) || is_admin() ) {
			return;
		}

		// Don't show if the user cannot edit a given customize_changeset post currently being previewed.
		if ( is_customize_preview() && $wp_customize->changeset_post_id() && ! current_user_can( get_post_type_object( 'customize_changeset' )->cap->edit_post, $wp_customize->changeset_post_id() ) ) {
			return;
		}

		$current_url = ( is_ssl() ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
		if ( is_customize_preview() && $wp_customize->changeset_uuid() ) {
			$current_url = remove_query_arg( 'customize_changeset_uuid', $current_url );
		}

		$customize_url = add_query_arg( 'url', urlencode( $current_url ), wp_customize_url() );
		if ( is_customize_preview() ) {
			$customize_url = add_query_arg( array( 'changeset_uuid' => $wp_customize->changeset_uuid() ), $customize_url );
		}
		return $customize_url;
	}

	/**
	 * Get the saved state for a user.
	 *
	 * @since 0.1
	 * @param int $id
	 * @return array
	 */
	static public function get_user_state( $id ) {
		$saved = get_user_meta( $id, 'fl_assistant_state', true );

		return array_merge(
			self::$default_user_state,
			$saved ? (array) $saved : array()
		);
	}

	/**
	 * Update the saved state for a user.
	 *
	 * @since 0.1
	 * @param int $id
	 * @param array $state
	 * @return void
	 */
	static public function update_user_state( $id, $state ) {
		$saved = self::get_user_state( $id );

		update_user_meta(
			$id, 'fl_assistant_state', array_merge(
				$saved,
				$state ? (array) $state : array()
			)
		);
	}

	/**
	 * Get the saved state for the current user.
	 *
	 * @since 0.1
	 * @return array
	 */
	static public function get_current_user_state() {
		return self::get_user_state( wp_get_current_user()->ID );
	}

	/**
	 * Get info about the current user.
	 *
	 * @since 0.1
	 * @return array
	 */
	static public function get_current_user_data() {
		$user = wp_get_current_user();

		return array(
			'id'   => $user->ID,
			'name' => $user->display_name,
		);
	}
}