import { useState } from 'react';
import CustomizableSection from './CustomizableSection';

const ExportableSection = () => {
    const [htmlContent, setHtmlContent] = useState('');

    const handleExport = () => {
        const section = document.getElementById('custom-section');
        const html = section.outerHTML;
        setHtmlContent(html);
        downloadHTML(html, 'custom-section.html');
    };

    const downloadHTML = (html, filename) => {
        const blob = new Blob([html], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    return (
        <div>
            <div id="custom-section">
                <CustomizableSection />
            </div>
            <button onClick={handleExport}>Export to HTML</button>
            {htmlContent && (
                <textarea readOnly value={htmlContent} rows={10} cols={50}></textarea>
            )}
        </div>
    );
};

export default ExportableSection;
