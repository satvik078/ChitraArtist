import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle } from 'lucide-react';
import { uploadAPI, artAPI } from '../utils/api';

const UploadSection = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    isPublic: true,
  });

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadAPI.uploadImage(file);
      setUploadedImage({
        url: response.data.url,
        publicId: response.data.publicId,
      });
    } catch (error) {
      alert('Failed to upload image');
      console.error(error);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: uploading || uploadedImage !== null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uploadedImage) {
      alert('Please upload an image first');
      return;
    }

    if (!formData.title) {
      alert('Please enter a title');
      return;
    }

    try {
      await artAPI.create({
        ...formData,
        // Backend expects `url` (not `imageUrl`) and `publicId`
        url: uploadedImage.url,
        publicId: uploadedImage.publicId,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        isPublic: true,
      });
      setUploadedImage(null);

      onUploadSuccess?.();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create artwork';
      alert(errorMessage);
      console.error(error);
      // If limit reached, close upload form
      if (error.response?.status === 403) {
        onUploadSuccess?.();
      }
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Artwork Image *
        </label>
        
        {!uploadedImage ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-300 hover:border-purple-400 bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-purple-600 font-semibold">Drop the image here</p>
                ) : (
                  <>
                    <p className="text-gray-700 font-semibold mb-2">
                      Drag & drop your artwork here, or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="relative">
            <img
              src={uploadedImage.url}
              alt="Uploaded artwork"
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Image Uploaded</span>
            </div>
          </div>
        )}
      </div>

      {/* Artwork Details */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          placeholder="My Amazing Artwork"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
          placeholder="Tell us about your artwork..."
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        >
          <option value="">Select a category</option>
          <option value="digital">Digital</option>
          <option value="painting">Painting</option>
          <option value="photography">Photography</option>
          <option value="sketch">Sketch</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublic"
          name="isPublic"
          checked={formData.isPublic}
          onChange={handleChange}
          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
        />
        <label htmlFor="isPublic" className="text-sm text-gray-700">
          Make this artwork public on my portfolio
        </label>
      </div>

      <button
        type="submit"
        disabled={uploading || !uploadedImage}
        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Upload className="w-5 h-5" />
        Add Artwork to Portfolio
      </button>
    </form>
  );
};

export default UploadSection;
