import React, { useState, useRef } from 'react'
import Head from 'next/head'

export default function HomePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [images, setImages] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages: string[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const result = e.target?.result as string
            newImages.push(result)
            if (newImages.length === files.length) {
              setImages(prev => [...prev, ...newImages])
              if (selectedImage === null) {
                setSelectedImage(newImages[0])
                setCurrentIndex(0)
              }
            }
          }
          reader.readAsDataURL(file)
        }
      }
    }
  }

  const nextImage = () => {
    if (images.length > 0) {
      const nextIndex = (currentIndex + 1) % images.length
      setCurrentIndex(nextIndex)
      setSelectedImage(images[nextIndex])
    }
  }

  const prevImage = () => {
    if (images.length > 0) {
      const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
      setCurrentIndex(prevIndex)
      setSelectedImage(images[prevIndex])
    }
  }

  const resetZoom = () => {
    setZoom(1)
  }

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3))
  }

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5))
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <React.Fragment>
      <Head>
        <title>画像ビューアー</title>
      </Head>

      <div className="min-h-screen bg-gray-100 p-4">
        {/* ヘッダー */}
        <div className="max-w-6xl mx-auto mb-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
            📸 画像ビューアー
          </h1>

          {/* コントロールボタン */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={openFileDialog}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              📁 画像を選択
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {images.length > 0 && (
              <>
                <button
                  onClick={prevImage}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  ⬅️ 前へ
                </button>
                <button
                  onClick={nextImage}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  次へ ➡️
                </button>
              </>
            )}
          </div>

          {/* ズームコントロール */}
          {selectedImage && (
            <div className="flex justify-center gap-2 mb-4">
              <button
                onClick={zoomOut}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                🔍-
              </button>
              <button
                onClick={resetZoom}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
              >
                🔄 リセット
              </button>
              <button
                onClick={zoomIn}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                🔍+
              </button>
              <span className="px-3 py-1 bg-gray-200 rounded">
                {Math.round(zoom * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* メインコンテンツエリア */}
        <div className="max-w-6xl mx-auto">
          {selectedImage ? (
            <div className="bg-white rounded-lg shadow-lg p-4">
              {/* 画像表示エリア */}
              <div className="flex justify-center items-center min-h-[400px] overflow-auto">
                <img
                  src={selectedImage}
                  alt="Selected image"
                  style={{
                    transform: `scale(${zoom})`,
                    transition: 'transform 0.2s ease-in-out'
                  }}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* 情報表示 */}
              <div className="mt-4 text-center text-gray-600">
                <p>画像 {currentIndex + 1} / {images.length}</p>
                <p>ズーム: {Math.round(zoom * 100)}%</p>
              </div>
            </div>
          ) : (
            /* 初期表示 */
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">📸</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                画像を選択してください
              </h2>
              <p className="text-gray-500 mb-6">
                画像ファイルをドラッグ&ドロップするか、ボタンをクリックして画像を選択してください
              </p>
              <button
                onClick={openFileDialog}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg"
              >
                📁 画像を選択
              </button>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  )
}
