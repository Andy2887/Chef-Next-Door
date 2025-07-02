"use client"

import React, { useState, useRef, useCallback } from 'react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Crop as CropIcon, X, Check } from "lucide-react"
import 'react-image-crop/dist/ReactCrop.css'

interface ImageCropperProps {
  src: string
  onCropComplete: (croppedImageBlob: Blob) => void
  onCancel: () => void
}

const ImageCropper: React.FC<ImageCropperProps> = ({ src, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  })
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)

  // Generate circular crop with fixed aspect ratio
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    const size = Math.min(width, height) * 0.6 // 60% of the smaller dimension
    const x = (width - size) / 2
    const y = (height - size) / 2
    
    setCrop({
      unit: 'px',
      width: size,
      height: size,
      x,
      y,
    })
  }, [])

  const getCroppedImg = useCallback((image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No 2d context')
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    // Set canvas size to crop size
    canvas.width = crop.width
    canvas.height = crop.height

    // Create circular clip
    ctx.beginPath()
    ctx.arc(crop.width / 2, crop.height / 2, crop.width / 2, 0, 2 * Math.PI)
    ctx.clip()

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        }
      }, 'image/jpeg', 0.9)
    })
  }, [])

  const handleCropComplete = useCallback(async () => {
    if (completedCrop && imgRef.current) {
      try {
        const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop)
        onCropComplete(croppedImageBlob)
      } catch (error) {
        console.error('Error cropping image:', error)
      }
    }
  }, [completedCrop, getCroppedImg, onCropComplete])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CropIcon className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-900">Crop Profile Image</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Select the area you want to use as your profile picture. The crop will be circular.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1} // Force square aspect ratio for circular crop
              circularCrop // Enable circular crop overlay
              className="max-w-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={src}
                alt="Crop preview"
                className="max-w-full max-h-96 object-contain"
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCropComplete}
              className="bg-[#e85d04] hover:bg-orange-700 text-white"
              disabled={!completedCrop}
            >
              <Check className="h-4 w-4 mr-2" />
              Apply Crop
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ImageCropper
