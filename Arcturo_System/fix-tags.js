const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const targetTags = ['span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'section', 'main', 'header', 'footer', 'nav', 'article', 'aside'];

walk('/Users/edmundocabral/Desktop/Arcturoshop/arcturoshop/src', function(filePath) {
    // Exclude Shadcn UI components
    if (filePath.includes('/components/ui/')) return;
    
    if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        targetTags.forEach(tag => {
            const regexOpen = new RegExp(`<${tag}(?=[\\s>])`, 'g');
            const regexClose = new RegExp(`</${tag}>`, 'g');
            content = content.replace(regexOpen, '<div').replace(regexClose, '</div>');
        });
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${filePath}`);
        }
    }
});
