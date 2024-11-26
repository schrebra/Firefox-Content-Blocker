
# Content Filter Firefox Extension

## Overview
This Firefox extension automatically filters and hides sensitive content from web pages, including violent/abusive language, political references, and mentions of specific public figures. It works in real-time and continuously monitors page changes.

## Features
- Filters violent and abusive terminology
- Hides political content and references
- Removes mentions of specific public figures
- Works dynamically on page updates
- Preserves page structure while hiding sensitive content
- Handles common misspellings and variations
- Supports Unicode and special characters

## Installation

### Temporary Installation (for Development)
1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Navigate to the extension directory and select `manifest.json`

### Permanent Installation
1. Package the extension by zipping the contents
2. Submit to [Firefox Add-ons](https://addons.mozilla.org/developers/) for review
3. Once approved, users can install directly from Firefox Add-ons website

## Extension Structure
```
firefox-content-filter/
├── manifest.json
├── content-script.js
├── popup.html
├── popup.js
└── words.js

```

## Configuration
To modify the filter list, edit the `wordsToHide` array in `content.js`. Each entry can be:
- Simple word: `'example'`
- Phrase: `'example phrase'`
- Handle: `'@handle'`
- Special character variations: `'example\u2019s'`

## Technical Details
- Uses MutationObserver for dynamic content monitoring
- Implements regex-based pattern matching
- Preserves DOM structure while hiding content
- Handles edge cases like contentEditable elements
- Processes text nodes individually to maintain page stability

## Development
The extension uses vanilla JavaScript and requires no build process. To modify:
1. Edit the source files
2. Load the extension in Firefox using the temporary installation method
3. Make changes and reload the extension to test

## Contributing
Feel free to submit issues and enhancement requests through GitHub's issue tracker.
