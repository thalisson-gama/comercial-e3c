const fs = require('fs');
const path = require('path');

const rootDir = "c:\\Users\\Pedro Rafachine\\Downloads\\E3C";
const htmlPath = path.join(rootDir, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// 1. Delete Unused Directories entirely
const dirsToDelete = [
    'Consigaz Brasilia',
    'consigaz duque de caxias',
    'consigaz maua',
    'Consigaz Paulina SP',
    'shopping flamingo',
    'node_modules',
    '.claude'
];

dirsToDelete.forEach(d => {
    const p = path.join(rootDir, d);
    if (fs.existsSync(p)) {
        fs.rmSync(p, { recursive: true, force: true });
        console.log(`Deleted dir: ${d}`);
    }
});

// 2. Delete Unused Root Files
const rootFilesToDelete = [
    'convert-extras.js',
    'convert-images.js',
    'convert-logo.js',
    'Logo 3D -  E3C .png',
    'Logo 3D.png',
    'Logo E3C.jpg',
    'Logotipo E3C.jpg',
    'marcas (1).png',
    'marcas (2).png',
    'quem somos.png',
    'REUNIÃO DE ONBOARDING - E3C ENGENHARIA LTDA - 2026_04_28 09_00 GMT-03_00 - Anotações do Gemini.pdf',
    'WhatsApp Image 2026-05-04 at 11.15.57 (1).jpeg',
    'WhatsApp Image 2026-05-04 at 11.15.57 (2).jpeg',
    'WhatsApp Image 2026-05-04 at 11.15.57 (3).jpeg',
    'WhatsApp Image 2026-05-04 at 11.15.57 (4).jpeg'
];

rootFilesToDelete.forEach(f => {
    const p = path.join(rootDir, f);
    if (fs.existsSync(p)) {
        fs.unlinkSync(p);
        console.log(`Deleted root file: ${f}`);
    }
});

// 3. Delete Unused files in the USED directories
const dirsToCheck = ['img', 'Consigaz Campinas', 'Consigaz Curitiba', 'Consigaz Porto Belo', 'Consigaz Ribeirão Preto'];

dirsToCheck.forEach(dirName => {
    const dirPath = path.join(rootDir, dirName);
    if (!fs.existsSync(dirPath)) return;
    
    const readFilesRecursive = (dir) => {
        let results = [];
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat && stat.isDirectory()) {
                results = results.concat(readFilesRecursive(filePath));
            } else {
                results.push(filePath);
            }
        });
        return results;
    };
    
    const files = readFilesRecursive(dirPath);
    
    files.forEach(file => {
        const fileName = path.basename(file);
        const encodedFileName = encodeURIComponent(fileName);
        
        if (!htmlContent.includes(fileName) && !htmlContent.includes(encodedFileName)) {
            fs.unlinkSync(file);
            console.log(`Deleted unused file inside ${dirName}: ${fileName}`);
        }
    });
});

// 4. Finally delete the check scripts
const scripts = ['check_unused.js', 'check_e3c.js', 'check_e3c_sub.js', 'cleanup.js'];
scripts.forEach(s => {
    const p = path.join(rootDir, s);
    if (fs.existsSync(p) && s !== 'cleanup.js') { // cleanup.js can't delete itself while running on Windows sometimes
        try { fs.unlinkSync(p); } catch(e){}
    }
});

console.log('Cleanup complete!');
