# ckeditor5-iswordcount [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Check%20out%20ckeditor5-iswordcount%20on%20GitHub&url=https://github.com/isatria/ckeditor5-iswordcount)

[![npm version](https://badge.fury.io/js/ckeditor5-iswordcount.svg)](https://www.npmjs.com/package/ckeditor5-iswordcount)
[![npm download](https://img.shields.io/npm/dt/ckeditor5-iswordcount.svg)](https://www.npmjs.com/package/ckeditor5-iswordcount)

This package implements characters count support for CKEditor 5.

![alt text](https://i.ibb.co/2K7L2pD/Screenshot-2019-05-31-at-11-51-37-PM.png)

This code is a code refactor from [Word Count & Char Count Plugin](https://ckeditor.com/cke4/addon/wordcount) for CKEditor4. This plugin is far from perfect so it is expected to understand the limitations of the features.

## **Feature**

- ✓ Char Count
- 𐄂 Word Count
- 𐄂 Paragraph Count

## **Installation**

To add this feature to your editor, install the _ckeditor5-iswordcount_ package:

```javascript
npm i ckeditor5-iswordcount
```

And add it to your plugin list and toolbar configuration:

```javascript
import ISWordCount from 'ckeditor5-iswordcount';

ClassicEditor
    .create( document.querySelector( '#editor' ), {
        plugins: [ ISWordCount, ... ],
        toolbar: [ 'iswordcount', ... ]
        iswordcount: { maxCharCount: 10 }
    } )
    .then( ... )
    .catch( ... );
```

## **External links**

- [ckeditor5-build-inline-alignment on npm](https://www.npmjs.com/package/ckeditor5-build-inline-alignment)
- [ckeditor5-build-inline-alignment on Github](https://github.com/isatria/ckeditor5-build-inline-alignment)

## **License**

**ckeditor5-iswordcount** 5 is an Open Source plugin
