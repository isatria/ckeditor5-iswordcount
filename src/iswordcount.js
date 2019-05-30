/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module wordcount/wordcount
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import ISWordCountEditing from './iswordcountediting';
import ISWordCountUI from './iswordcountui';

import '../theme/iswordcount.css';


export default class ISWordCount extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ISWordCountEditing, ISWordCountUI];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ISWordCount';
	}
}
