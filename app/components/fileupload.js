import { useState } from 'react';

export function UploadImageM({ label, onUpload, showPreview }) {
    const [previews, setPreviews] = useState([]);

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        const urls = [];

        for (const file of files) {
            const reader = new FileReader();
            reader.onload = () => {
                urls.push(reader.result); // Add the data URL to the array
                if (urls.length === files.length) {
                    setPreviews(urls);    // Set the previews after all files are processed
                    onUpload(urls);      // Call the callback with the array of data URLs
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-gray-300 text-sm font-bold">{label}</label>
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="block w-full text-gray-400 bg-gray-800 border border-gray-700 rounded-md p-2"
            />
            {(showPreview == undefined || showPreview) && previews.length > 0 && (
                <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-400">Previews:</p>
                    <div className="grid grid-cols-2 gap-2">
                        {previews.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`${label} Preview ${index + 1}`}
                                className="w-full h-auto rounded-lg shadow-md"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}


export function UploadImageS({ label, onUpload, showPreview }) {
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Get the first selected file
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result); // Set the preview to the data URL
                onUpload(reader.result);  // Call the callback with the data URL
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-gray-300 text-sm font-bold">{label}</label>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-gray-400 bg-gray-800 border border-gray-700 rounded-md p-2"
            />
            {(showPreview == undefined || showPreview) && preview && (
                <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-400">Preview:</p>
                    <img
                        src={preview}
                        alt={`${label} Preview`}
                        className="w-full h-auto rounded-lg shadow-md"
                    />
                </div>
            )}
        </div>
    );
}
