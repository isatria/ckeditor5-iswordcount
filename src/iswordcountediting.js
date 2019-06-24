/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import env from '@ckeditor/ckeditor5-utils/src/env';

class ISWordCountEditing extends Plugin {
	constructor(
		editor
	) {
		super(
			editor
		);

		editor.config.define(
			'iswordcount',
			{}
		);
	}

	init() {
		const editor = this
			.editor;

		const ignoredKeycodes = [
			37,
			38,
			39,
			40,
		];

		const defaultFormat =
			'';
		let lastCharCount = -1;
		let limitReachedNotified = false;
		let limitRestoredNotified = false;
		const timeoutId = 0;
		const notification = null;

		// Default Config
		const defaultConfig = {
			showRemaining: false,
			showCharCount: true,
			countBytesAsChars: false,
			countSpacesAsChars: false,
			countHTML: false,
			countLineBreaks: false,
			hardLimit: true,
			warnOnLimitOnly: false,

			// Max Length Properties
			maxCharCount: -1,
			maxHandler: () => {},

			// Filter
			filter: null,
		};

		// Get Config & Lang
		const config = Object.assign(
			defaultConfig,
			editor.config.get(
				'iswordcount'
			) ||
				{},
			true
		);

		const format = defaultFormat;

		const counterID = id => {
			return (
				'ck ck-label ' +
				id
			);
		};

		const counterElement = () => {
			return document.getElementsByClassName(
				counterID(
					editor
						.ui
						.view
						.body
						.id
				)
			);
		};

		const strip = html => {
			const tmp = document.createElement(
				'div'
			);

			tmp.innerHTML = html;

			if (
				tmp.textContent ==
					'' &&
				typeof tmp.innerText ==
					'undefined'
			) {
				return '';
			}

			return (
				tmp.textContent ||
				tmp.innerText
			);
		};

		const limitReached = status => {
			limitReachedNotified = status;
			limitRestoredNotified = !status;
		};

		const charCounter = text => {
			let normalizedText;

			normalizedText = text;

			normalizedText = normalizedText
				.replace(
					/(\r\n|\n|\r)/gm,
					''
				)
				.replace(
					/&nbsp;/gi,
					' '
				);
			normalizedText = strip(
				normalizedText
			).replace(
				/^([\t\r\n]*)$/,
				''
			);

			return normalizedText ==
				' ' &&
				normalizedText.length ==
					1 ?
				0 :
				normalizedText.length;
		};

		const updateCounterLabel = (
			current,
			max
		) => {
			let html = format;

			if (
				!config.showRemaining &&
				max !==
					-1
			) {
				html =
					'Characters: ' +
					current +
					'/' +
					max;
			}

			const counterLabel = counterElement();

			if (
				counterLabel.length >
				0
			) {
				if (
					env.isGecko
				) {
					counterLabel[ 0 ].innerHTML = html;
				} else {
					counterLabel[ 0 ].innerText = html;
				}
			}
		};

		const updateCounter = (
			event,
			data
		) => {
			let charCount = 0;

			const text = editor.getData(
				{
					trim:
						'none',
				}
			);

			if (
				text &&
				config.showCharCount
			) {
				charCount = charCounter(
					text
				);
			}

			(
				editor
					.config
					.iswordcount ||
				( editor.config.iswordcount = {} )
			).charCount = charCount;

			lastCharCount = charCount;

			if (
				lastCharCount ==
				-1
			) {
				lastCharCount = charCount;
			}

			if (
				config.maxCharCount >
					-1 &&
				charCount >
					config.maxCharCount
			) {
				limitReached(
					true
				);
				event.stop();
				data.preventDefault();
				charCount -= 1;
			} else if (
				config.maxCharCount ==
					-1 ||
				charCount <=
					config.maxCharCount
			) {
				limitReached(
					false
				);
			}

			editor.config = {
				charCount,
			};

			updateCounterLabel(
				charCount,
				config.maxCharCount
			);
		};

		editor.editing.view.document.on(
			'keyup',
			(
				event,
				data
			) => {
				if (
					ignoredKeycodes.some(
						keyCode =>
							keyCode !=
							data.keyCode
					)
				) {
					updateCounter(
						event,
						data
					);
				}
			},
			{
				priority:
					'highest',
			}
		);

		editor.editing.view.document.on(
			'keydown',
			(
				event,
				data
			) => {
				let charCount = -1;
				const text = editor.getData(
					{
						trim:
							'none',
					}
				);

				if (
					config.showCharCount
				) {
					charCount =
						charCounter(
							text
						) +
						1;
				}

				if (
					ignoredKeycodes.some(
						keyCode =>
							keyCode ==
								data.keyCode ||
							data.ctrlKey ==
								true
					)
				) {
					return true;
				} else {
					if (
						( config.maxCharCount >
							-1 &&
							charCount >
								config.maxCharCount &&
							config.hardLimit ) ||
						data.altKey ==
							true
					) {
						data.preventDefault();
					}
				}
			},
			{
				priority:
					'highest',
			}
		);

		editor.editing.view.document.on(
			'paste',
			(
				event,
				data
			) => {
				let charCount = -1;

				let text = editor.getData(
					{
						trim:
							'none',
					}
				);
				text += data.dataTransfer.getData(
					'text/plain'
				);

				if (
					config.showCharCount
				) {
					charCount = charCounter(
						text
					);
				}

				if (
					config.maxCharCount >
						-1 &&
					charCount >
						config.maxCharCount &&
					config.hardLimit
				) {
					const { maxHandler } = config
					if (typeof(maxHandler) === 'function') { maxHandler(charCount, config.maxCharCount) };
					
					event.stop();
					data.preventDefault();
				}
			},
			{
				priority:
					'highest',
			}
		);

		editor.data.on(
			'ready',
			(
				event,
				data
			) => {
				updateCounter(
					event,
					data
				);
			},
			editor,
			null,
			100
		);

		editor.keystrokes.set(
			'Ctrl+Z',
			(
				data,
				cancel
			) => {
				// Prevent default (native) action and stop the underlying keydown event
				// so no other editor feature will interfere.
				cancel();
			}
		);

		editor.keystrokes.set(
			'Ctrl+Y',
			(
				data,
				cancel
			) => {
				// Prevent default (native) action and stop the underlying keydown event
				// so no other editor feature will interfere.
				cancel();
			}
		);
	}
}

export default ISWordCountEditing;
