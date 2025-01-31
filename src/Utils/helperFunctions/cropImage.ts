import { Area } from "react-easy-crop";

export const getCroppedImg = async (imageSrc: string, croppedAreaPixels: Area) => {
    const createImage = (url: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.src = url;
        image.crossOrigin = "anonymous"; 
        image.onload = () => resolve(image);
        image.onerror = (error) => reject(error);
      });
  
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    if (!ctx) {
      throw new Error("Failed to create 2D context");
    }
  
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
  
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );
  
    return new Promise<string>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob)); 
        } else {
          reject(new Error("Failed to generate image blob"));
        }
      }, "image/jpeg");
    });
  };
  