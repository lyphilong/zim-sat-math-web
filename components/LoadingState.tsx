'use client';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Đang giải bài toán...' }: LoadingStateProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Animated spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading message */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{message}</h3>
          <p className="text-gray-600 text-sm">
            Hệ thống đang phân tích bài toán và tạo lời giải chi tiết...
          </p>
        </div>

        {/* Progress steps */}
        <div className="w-full max-w-md mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-600">Đang xử lý</span>
            <span className="text-xs text-gray-500">Vui lòng đợi</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-600 h-2 rounded-full animate-progress"></div>
          </div>

          {/* Steps */}
          <div className="mt-4 space-y-2">
            <LoadingStep 
              step="Phân tích bài toán" 
              icon="📝"
              delay={0}
            />
            <LoadingStep 
              step="Tạo chiến lược giải" 
              icon="🧮"
              delay={500}
            />
            <LoadingStep 
              step="Tính toán từng bước" 
              icon="🔢"
              delay={1000}
            />
            <LoadingStep 
              step="Tạo hình ảnh minh họa" 
              icon="📊"
              delay={1500}
            />
            <LoadingStep 
              step="Hoàn thiện lời giải" 
              icon="✅"
              delay={2000}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingStep({ 
  step, 
  icon, 
  delay 
}: { 
  step: string; 
  icon: string; 
  delay: number;
}) {
  return (
    <div 
      className="flex items-center space-x-2 text-sm text-gray-600"
      style={{ 
        animation: `fadeIn 0.6s ease-in-out ${delay}ms forwards`,
        opacity: 0
      }}
    >
      <span className="text-lg">{icon}</span>
      <span>{step}</span>
      <div className="ml-auto">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}

