'use client';

import { useState } from 'react';
import { SATMathSolutionOutput } from '@/types/schemas';
import SolutionViewer from '@/components/SolutionViewer';
import LoadingState from '@/components/LoadingState';
import LatexRenderer from '@/components/LatexRenderer';

export default function Home() {
  const [problem, setProblem] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [solution, setSolution] = useState<SATMathSolutionOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate image type
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file ảnh');
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Kích thước ảnh không được vượt quá 10MB');
        return;
      }
      setImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSolve = async () => {
    if (!problem.trim() && !image) {
      setError('Vui lòng nhập bài toán hoặc upload ảnh');
      return;
    }

    setLoading(true);
    setError(null);
    setSolution(null);

    try {
      // Convert image to base64 if exists
      let imageBase64: string | null = null;
      if (image) {
        imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            // Remove data:image/...;base64, prefix
            const base64 = result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(image);
        });
      }

      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          problem: problem.trim() || undefined,
          image_base64: imageBase64,
          image_mime_type: image?.type || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể giải bài toán');
      }

      const data = await response.json();
      setSolution(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Giải Bài Toán SAT
          </h1>
          <p className="text-gray-600">
            Nhập bài toán SAT và nhận lời giải từng bước chi tiết với
            hình ảnh minh họa Desmos
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="mb-4">
            <label
              htmlFor="problem"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nhập bài toán SAT của bạn (hoặc upload ảnh):
            </label>
            <textarea
              id="problem"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Ví dụ: Nếu 2x + 5 = 15, giá trị của x là bao nhiêu? Hoặc upload ảnh bài toán có hình vẽ"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={6}
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Hoặc upload ảnh bài toán (nếu có hình vẽ):
            </label>
            <div className="flex items-center gap-4">
              <label
                htmlFor="image"
                className="flex-1 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors"
              >
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium text-blue-600">Click để chọn ảnh</span> hoặc kéo thả
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, WEBP (tối đa 10MB)
                  </p>
                </div>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4 relative">
                <div className="border border-gray-300 rounded-lg p-2 bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full h-auto max-h-64 mx-auto rounded"
                  />
                </div>
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  title="Xóa ảnh"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Đã chọn: {image?.name} ({((image?.size || 0) / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleSolve}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Đang giải...' : 'Giải Bài Toán'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>

        {loading && (
          <LoadingState message="Đang giải bài toán..." />
        )}

        {/* Debug: Uncomment để test LaTeX */}
        {process.env.NODE_ENV === 'development' && false && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">LaTeX Test</h2>
            <div className="space-y-2">
              <LatexRenderer content="$x^2-4x+3=0$" />
              <LatexRenderer content="$(x-1)(x-3)=0$" />
              <LatexRenderer content="$x=1\\;\\text{hoặc}\\;x=3$" />
              <LatexRenderer content="Text với $x^2$ inline" />
            </div>
          </div>
        )}

        {solution && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
            <SolutionViewer
              solution={solution}
              originalProblem={problem || undefined}
            />
          </div>
        )}
      </div>
    </main>
  );
}

