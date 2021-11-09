import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save( { attributes } ) {
	return (
		<div { ...useBlockProps.save() }>
			<p className="ciu_embed" data-feature={ attributes.feature.id }
			   data-periods="future_1,current,past_1,past_2" data-accessible-colours="false" />
		</div>
	);
}
