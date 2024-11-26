class TextHider {
    constructor(wordSet) {
        this.words = wordSet;
        this.regex = null;
        this.chunkSize = 1000;
        this.isEnabled = true;
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
        if (!this.isEnabled) return;
        
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
        if (!this.isEnabled) return;
        
        const chunks = [];
        for (let i = 0; i < nodes.length; i += this.chunkSize) {
            chunks.push(nodes.slice(i, i + this.chunkSize));
        }

        for (const chunk of chunks) {
            chunk.forEach(node => this.processTextNode(node));
        }
    }

    hideElements() {
        if (!this.isEnabled) return;
        
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

    setEnabled(enabled) {
        this.isEnabled = enabled;
        if (!enabled) {
            // Remove all hidden elements
            document.querySelectorAll('[style*="display: none"]').forEach(el => {
                el.style.display = '';
            });
        } else {
            // Reprocess the page
            this.hideElements();
        }
    }
}

// Initialize
const textHider = new TextHider(wordsToHide);

function initialize() {
    // Check current state
    const hostname = window.location.hostname;
    browser.storage.local.get(hostname).then(result => {
        textHider.setEnabled(result[hostname] !== false);
        textHider.hideElements();
    });

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

// Listen for storage changes
browser.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
        const hostname = window.location.hostname;
        browser.storage.local.get(hostname).then(result => {
            textHider.setEnabled(result[hostname] !== false);
        });
    }
});

// Run on page load and after a short delay to catch dynamic content
document.addEventListener('DOMContentLoaded', initialize);
setTimeout(initialize, 1000);