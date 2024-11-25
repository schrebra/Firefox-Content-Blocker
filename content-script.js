class TextHider {
    constructor(wordSet) {
        this.words = wordSet;
        this.regex = null;
        this.chunkSize = 1000;
        this.buildRegex();
    }

    buildRegex() {
        const pattern = Array.from(this.words)
            .map(word => {
                const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                return word.startsWith('@') || word.startsWith('#') || word.includes('-') 
                    ? escaped 
                    : `\\b${escaped}\\b`;
            })
            .join('|');
        this.regex = new RegExp(pattern, 'gi');
    }

    processTextNode(node) {
        const text = node.textContent;
        if (this.regex.test(text)) {
            let container = node.parentElement;
            
            if (container.childNodes.length <= 3) {
                container.style.display = 'none';
            } else {
                const newHtml = text.replace(this.regex, 
                    '<span style="display: none;">$&</span>'
                );
                
                const temp = document.createElement('span');
                temp.innerHTML = newHtml;
                
                node.parentNode.replaceChild(temp, node);
            }
        }
    }

    processNodes(nodes) {
        const chunks = [];
        for (let i = 0; i < nodes.length; i += this.chunkSize) {
            chunks.push(nodes.slice(i, i + this.chunkSize));
        }

        for (const chunk of chunks) {
            chunk.forEach(node => this.processTextNode(node));
        }
    }

    hideElements() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    if (node.parentElement.style.display === 'none' ||
                        ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(
                            node.parentElement.tagName
                        )) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        const nodes = [];
        let node;
        while (node = walker.nextNode()) {
            nodes.push(node);
        }

        this.processNodes(nodes);
    }
}

// Initialize and run
const textHider = new TextHider(wordsToHide);

function initialize() {
    textHider.hideElements();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (!mutation.target.isContentEditable) {
                textHider.hideElements();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

// Run on page load and after a short delay to catch dynamic content
document.addEventListener('DOMContentLoaded', initialize);
setTimeout(initialize, 1000);