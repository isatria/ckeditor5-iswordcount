import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import LabelView from '@ckeditor/ckeditor5-ui/src/label/labelview';

const ISWORDCOUNT = 'iswordcount';

/**
 * The word counter UI feature. It introduces the Word Counter Label.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ISWordCountUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;

		// Register UI component.
		editor.ui.componentFactory.add( ISWORDCOUNT, locale => {
			const view = new LabelView(locale);

			view.set({ text: 'Characters: 0/0',
				tooltip: false
			});
		
		view.extendTemplate({
			attributes: { class: editor.ui.view.body.id }
		});
		return view;
	});

	}
}
