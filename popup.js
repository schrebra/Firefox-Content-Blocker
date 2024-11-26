document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('blockingToggle');
    
    // Get current tab's hostname
    browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
        const url = new URL(tabs[0].url);
        const hostname = url.hostname;
        
        // Get current state
        browser.storage.local.get(hostname).then(result => {
            toggle.checked = result[hostname] !== false;
        });
    });

    // Handle toggle changes
    toggle.addEventListener('change', function() {
        browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
            const url = new URL(tabs[0].url);
            const hostname = url.hostname;
            
            // Save state
            let save = {};
            save[hostname] = toggle.checked;
            browser.storage.local.set(save).then(() => {
                // Reload the current tab
                browser.tabs.reload(tabs[0].id);
            });
        });
    });
});