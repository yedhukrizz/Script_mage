export type ElementType = "text" | "image" | "shape" | "video" | "audio";

export interface EditorElement {
  id: string;
  type: ElementType;
  content: string; // text content, image URL, or shape type (e.g., "rectangle", "circle")
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  startTime: number;
  endTime: number;
  animationIn: string; // "none", "fade", "slide", "scale"
  animationOut: string; // "none", "fade", "slide", "scale"
  easing: string; // "linear", "ease-in", "ease-out", "ease-in-out"
  color?: string; // For text/shapes
  fontSize?: number; // For text
  fontFamily?: string; // For text
  textEffect?: string; // For text
  fontWeight?: number; // For text
  trackColor?: string; // Color in timeline
  isPlaceholder?: boolean; // For placeholder elements behind grids
  mediaEffect?: string; // For continuous media effects like parallax
  mediaDimness?: number; // 0 to 1, opacity of a black overlay on media
  volume?: number; // 0 to 1, volume for audio/video
  ttsVoice?: string; // Voice URI for text-to-speech
  ttsAudioUrl?: string; // Audio URL if generated
}
