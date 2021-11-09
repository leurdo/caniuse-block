
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { CheckboxControl } from '@wordpress/components';
import Select from 'react-select';
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({ attributes, setAttributes, clientId }) {

	const embedAPI = 'https://api.caniuse.bitsofco.de/features';
	const url = 'https://caniuse.bitsofco.de/embed/index.html';
	const [ options, setOptions ] = useState( [] );
	const [ versions, setVersions ] = useState( {
		future_3: false,
		future_2: false,
		future_1: false,
		current: true,
		past_1: false,
		past_2: false,
		past_3: false,
		past_4: false,
		past_5: false,
	});
	const data = [
		{
			label: __( 'Future Version (Current + 3)', 'caniuse-block' ),
			id: 'future_3'
		},
		{
			label: __( 'Future Version (Current + 2)', 'caniuse-block' ),
			id: 'future_2'
		},
		{
			label: __( 'Future Version (Current + 1)', 'caniuse-block' ),
			id: 'future_1'
		},
		{
			label: __( 'Current Version (required)', 'caniuse-block' ),
			id: 'current'
		},
		{
			label: __( 'Past Version (Current - 1)', 'caniuse-block' ),
			id: 'past_1'
		},
		{
			label: __( 'Past Version (Current - 2)', 'caniuse-block' ),
			id: 'past_2'
		},
		{
			label: __( 'Past Version (Current - 3)', 'caniuse-block' ),
			id: 'past_3'
		},
		{
			label: __( 'Past Version (Current - 4)', 'caniuse-block' ),
			id: 'past_4'
		},
		{
			label: __( 'Past Version (Current - 5)', 'caniuse-block' ),
			id: 'past_5'
		},
	];

	useEffect(() => {
		fetch(embedAPI, {
			credentials: 'omit',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(data => setOptions(data))
	}, []);

	const handleChange = ( val ) => {
		setAttributes( {
			feature: val,
		} );
	}

	const handleCheckbox = ( id ) => {
		setVersions(prevState => ({
			...prevState,
			[id]: !versions[ id ]
		}));

		let versionsString = '';
		for ( let prop in versions ) {
			if ( versions[prop] ) {
				versionsString += prop + ',';
			}
		}

		setAttributes( {
			bVersions: versionsString.slice(0, -1),
		} );
	}

	const resizeFrame = () => {
		const eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
		const eventer = window[eventMethod];
		const messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

		eventer( messageEvent,function(e) {
			const data = e.data;
			if (  (typeof data === 'string') && (data.indexOf('ciu_embed') > -1) ) {

				const featureID = data.split(':')[1];
				const height = data.split(':')[2];

				if ( featureID === attributes.feature.id ) {
					const iframeHeight = parseInt(height) + 30;
					document.getElementById( 'frame' + clientId ).height = iframeHeight + 'px';
				}
			}
		}, false );
	}

	return (
		<div { ...useBlockProps({ className: 'components-placeholder' } ) }>
			<h3>{ __( 'Caniuse embed block', 'caniuse-block' ) }</h3>
			<Select
				className="ciu-select"
				placeholder={ __( 'Select feature...', 'caniuse-block' ) }
				isSearchable={ true }
				options={ options }
				getOptionLabel={ option => option.title }
				getOptionValue={ option => option.id }
				onChange={ handleChange }
				defaultValue={ attributes.feature }
			/>
			{ __( 'Browser Versions', 'caniuse-block' ) }
			{ data.map(item => {
				return (
					<CheckboxControl
						label={item.label}
						checked={versions[item.id]}
						onChange={() => handleCheckbox(item.id)}
						disabled={item.id === 'current'}
					/>
				)
			}) }
			{ attributes.feature && (
				<iframe
					src={ url + '?feat=' + attributes.feature.id + '&periods=' + attributes.bVersions + '&accessible-colours=false&image-base=none' }
					id={'frame' + clientId}
					frameBorder="0"
					width="100%"
					height="400px"
					onLoad={ resizeFrame }
				/>
			) }
		</div>
	);
}
