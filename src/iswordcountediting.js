import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import env from '@ckeditor/ckeditor5-utils/src/env';

class ISWordCountEditing extends Plugin {
	constructor( editor ) {
		super( editor );

		editor.config.define( 'iswordcount', {} );
	}

	init() {
        const editor = this.editor;

		const ignoredKeycodes = [37, 38, 39, 40];

		var defaultFormat = "",
            lastWordCount = -1,
            lastCharCount = -1,
            lastParagraphs = -1,
            limitReachedNotified = false,
            limitRestoredNotified = false,
            timeoutId = 0,
            notification = null;

		// Default Config
        var defaultConfig = {
        	showRemaining: false,
        	showCharCount: true,
        	showWordCount: false,
        	showParagraphs: false,
        	countBytesAsChars: false,
        	countSpacesAsChars: false,
        	countHTML: false,
        	countLineBreaks: false,
        	hardLimit: true,
        	warnOnLimitOnly: false,
        	
        	// Max Length Properties
        	maxCharCount: -1,
        	maxWordCount: -1,
        	maxParagraphs: -1,
        	
        	// Filter
        	filter: null
        };

        // Get Config & Lang
        var config = Object.assign(defaultConfig, editor.config.get('iswordcount') || {}, true);

        var format = defaultFormat;
        
        /*
		const filter = html => {
			if (config.filter instanceof CKEDITOR.htmlParser.filter) {
                var fragment = CKEDITOR.htmlParser.fragment.fromHtml(html),
                    writer = new CKEDITOR.htmlParser.basicWriter();
                config.filter.applyTo(fragment);
                fragment.writeHtml(writer);
                return writer.getHtml();
            }
			return html;
		}
		*/

		const counterID = (id) => {
			return 'ck ck-label ' + id;
		}

		const counterElement = () => {

            // document.body.appendChild( parent.element );
            return document.getElementsByClassName(
                counterID(editor.ui.view.body.id)
            );
		}

		const strip = html => {
			/*
			if (bbcodePluginLoaded) {
        		// stripping out BBCode tags [...][/...]
        		return html.replace(/\[.*?\]/gi, '');
        	}
        	*/

        	var tmp = document.createElement("div");

        	// Add filter before strip
        	// html = filter(html);
        	tmp.innerHTML = html;

        	if (tmp.textContent == "" && typeof tmp.innerText == "undefined") {
        		return "";
        	}

        	return tmp.textContent || tmp.innerText;
        }

		const countCharacters = text => {
			/*
			if (config.countHTML) {
                return config.countBytesAsChars ? countBytes(filter(text)) : filter(text).length;
            }
            */

			var normalizedText;

			/*
			// strip body tags
            if (editor.config.fullPage) {
                var i = text.search(new RegExp("<body>", "i"));
                if (i != -1) {
                    var j = text.search(new RegExp("</body>", "i"));
                    text = text.substring(i + 6, j);
                }

            }
            */

            normalizedText = text;

            /*
            if (!config.countSpacesAsChars) {
                normalizedText = text.replace(/\s/g, "").replace(/&nbsp;/g, "");
            }

            if (config.countLineBreaks) {
                normalizedText = normalizedText.replace(/(\r\n|\n|\r)/gm, " ");
            } else {
                normalizedText = normalizedText.replace(/(\r\n|\n|\r)/gm, "").replace(/&nbsp;/gi, " ");
            }

            normalizedText = strip(normalizedText).replace(/^([\t\r\n]*)$/, "");
            */
            normalizedText = normalizedText.replace(/(\r\n|\n|\r)/gm, "").replace(/&nbsp;/gi, " ");
            normalizedText = strip(normalizedText).replace(/^([\t\r\n]*)$/, "");
			// return config.countBytesAsChars ? countBytes(normalizedText) : normalizedText.length;

			return normalizedText.length;
		}

		const limitReached = (editorInstance, notify) => {
			limitReachedNotified = true;
            limitRestoredNotified = false;
			/*
            if (!config.warnOnLimitOnly) {
                if (config.hardLimit) {
                    editorInstance.execCommand('undo');
                }
            }

            if (!notify) {
                counterElement(editorInstance).className = "cke_path_item cke_wordcountLimitReached";
                editorInstance.fire("limitReached", { firedBy: "wordCount.limitReached" }, editor);
            }
			*/
			editorInstance.execute('delete');
		}

		const updateCounter = (editorInstance) => {

            if (!counterElement()) {
                return;
            }
            

			var charCount = 0,
				wordCount = 0,
				text;

			text = editor.getData();

			if (text) {
				if (config.showCharCount) {
					charCount = countCharacters(text);
				}
				/*
				if (config.showParagraphs) {
                    paragraphs = countParagraphs(text);
                }

                if (config.showWordCount) {
                    wordCount = countWords(text);
                }
				*/
			}

			var html = format;
			
			if (config.showRemaining) {
                // html = 'Characters: ' + charCount + '/' + config.maxCharCount;
                // if (config.maxCharCount >= 0) {
                //     html = 'Characters: ' + charCount + '/' + config.maxCharCount;
                // } else {
                //     html = html.replace("%charCount%", charCount);
                // }

                /*
                if (config.maxWordCount >= 0) {
                    html = html.replace("%wordCount%", config.maxWordCount - wordCount);
                } else {
                    html = html.replace("%wordCount%", wordCount);
                }

                if (config.maxParagraphs >= 0) {
                    html = html.replace("%paragraphsCount%", config.maxParagraphs - paragraphs);
                } else {
                    html = html.replace("%paragraphsCount%", paragraphs);
                }
                */

            } else {
            	html = 'Characters: ' + charCount + '/' + config.maxCharCount;
            	/*
                html = html.replace("%wordCount%", wordCount);
                html = html.replace("%paragraphsCount%", paragraphs);
                */
            }
        
            (editorInstance.config.iswordcount || (editorInstance.config.iswordcount = {})).wordCount = wordCount;
            (editorInstance.config.iswordcount || (editorInstance.config.iswordcount = {})).charCount = charCount;

            const counterLabel = counterElement();
            if (counterLabel.length > 0) {
                if (env.isGecko) {
                    counterLabel[0].innerHTML = html;
                } else {
                    counterLabel[0].innerText = html;
                }
                
            }

            /*
            if (charCount == lastCharCount && wordCount == lastWordCount && paragraphs == lastParagraphs) {
                if (charCount == config.maxCharCount || wordCount == config.maxWordCount || paragraphs > config.maxParagraphs) {
                    editorInstance.fire('saveSnapshot');
                }
                return true;
            }
            */

            if (charCount == config.maxCharCount) {
            	// console.log('OK Save');
            	//editor.fire('save');
            	// editor.execute('saveSnapshot');
            }


			//If the limit is already over, allow the deletion of characters/words. Otherwise,
            //the user would have to delete at one go the number of offending characters
            // var deltaWord = wordCount - lastWordCount;
            var deltaChar = charCount - lastCharCount;
            // var deltaParagraphs = paragraphs - lastParagraphs;

			// lastWordCount = wordCount;
            lastCharCount = charCount;
            // lastParagraphs = paragraphs;

            /*
            console.log('editor ', editorInstance.config);
            console.log('CHAR COUNT => ', charCount);
            console.log('Max Char Count => ', config.maxCharCount);
            console.log('Text => ', text);
            */

            if (config.maxCharCount > -1 && charCount > config.maxCharCount) {
            	limitReached(editor, limitReachedNotified);
            } else {
            	editor.fire('saveSnapshot')
                // console.log(editor.fire('saveSnapshot'));
            }


            return true;

            // Set result counter to element.
            /*
            if (CKEDITOR.env.gecko) {
                counterElement(editorInstance).innerHTML = html;
            } else {
                counterElement(editorInstance).innerText = html;
            }
            */
            
		}

		editor.editing.view.document.on('keyup', (e, data) => {
			if (!ignoredKeycodes.some(x => x == data.keyCode)) {
				updateCounter(editor);	
			}
		});

		editor.editing.view.document.on("paste", (e, data) => { 
			// if (!config.warnOnLimitOnly && (config.maxWordCount > 0 || config.maxCharCount > 0 || config.maxParagraphs > 0)) {
			if (!config.warnOnLimitOnly && config.maxCharCount > 0) {
				// Check if pasted content is above the limits
                var wordCount = -1,
                    charCount = -1,
                    paragraphs = -1;

                var text = editor.getData();
                text += data.dataTransfer.getData('text/plain')
                
                if (config.showCharCount) {
                    charCount = countCharacters(text);
                }

                if (config.maxCharCount > 0 && charCount > config.maxCharCount && config.hardLimit) {
                    e.stop();
                    data.preventDefault();
                }
			}
        }, editor, null, 100);

        editor.data.on('ready', e => {
            updateCounter(editor);
        }, editor, null, 100);
	}
}

export default ISWordCountEditing;