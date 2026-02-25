import { useRef, useState, useCallback, useEffect } from "react";
import type { Emotion, HeadGesture } from "@/data/gameData";

interface BlendShapeScores {
  [key: string]: number;
}

export interface FaceDetectionResult {
  emotion: Emotion;
  confidence: number;
  blendShapes: BlendShapeScores;
}

export function useFaceDetection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const faceLandmarkerRef = useRef<any>(null);
  const animFrameRef = useRef<number>(0);
  const lastVideoTimeRef = useRef<number>(-1);
  const headPosHistory = useRef<{ x: number; y: number; t: number }[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>("neutral");
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastHeadGesture, setLastHeadGesture] = useState<HeadGesture | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [lastLandmarks, setLastLandmarks] = useState<any[] | null>(null);

  const detectEmotion = useCallback((blendShapes: any[]): FaceDetectionResult => {
    if (!blendShapes || blendShapes.length === 0) {
      return { emotion: "neutral", confidence: 0, blendShapes: {} };
    }

    const shapes: BlendShapeScores = {};
    blendShapes[0].categories.forEach((s: any) => {
      shapes[s.categoryName] = s.score;
    });

    const scores: Record<Emotion, number> = {
      happy: ((shapes["mouthSmileLeft"] || 0) + (shapes["mouthSmileRight"] || 0)) / 2,
      sad: ((shapes["mouthFrownLeft"] || 0) + (shapes["mouthFrownRight"] || 0)) / 2 + ((shapes["browInnerUp"] || 0) * 0.3),
      angry: ((shapes["browDownLeft"] || 0) + (shapes["browDownRight"] || 0)) / 2 + ((shapes["mouthShrugUpper"] || 0) * 0.2) + ((shapes["jawForward"] || 0) * 0.2),
      disgusted: ((shapes["noseSneerLeft"] || 0) + (shapes["noseSneerRight"] || 0)) / 2 + ((shapes["mouthUpperUpLeft"] || 0) * 0.3),
      surprised: ((shapes["eyeWideLeft"] || 0) + (shapes["eyeWideRight"] || 0)) / 2 + ((shapes["browOuterUpLeft"] || 0) + (shapes["browOuterUpRight"] || 0)) / 4 + ((shapes["jawOpen"] || 0) * 0.3),
      neutral: 0,
    };

    const maxNonNeutral = Math.max(scores.happy, scores.sad, scores.angry, scores.disgusted, scores.surprised);
    scores.neutral = Math.max(0, 0.5 - maxNonNeutral);

    let bestEmotion: Emotion = "neutral";
    let bestScore = 0;
    for (const [emotion, score] of Object.entries(scores)) {
      if (score > bestScore) {
        bestScore = score;
        bestEmotion = emotion as Emotion;
      }
    }

    if (bestEmotion !== "neutral" && bestScore < 0.1) {
      bestEmotion = "neutral";
      bestScore = scores.neutral;
    }

    // Light smoothing to avoid flicker
    const smoothedEmotion = bestEmotion === currentEmotion ? bestEmotion : bestEmotion;
    const smoothedScore = (confidence * 0.4) + (bestScore * 0.6);

    return { emotion: smoothedEmotion, confidence: Math.min(smoothedScore * 2, 1), blendShapes: shapes };
  }, [confidence, currentEmotion]);

  const detectHeadGesture = useCallback((landmarks: any[]): void => {
    if (!landmarks || landmarks.length === 0) return;
    const nose = landmarks[0][1]; // nose tip
    if (!nose) return;

    const now = Date.now();
    headPosHistory.current.push({ x: nose.x, y: nose.y, t: now });
    // Keep last 500ms
    headPosHistory.current = headPosHistory.current.filter(p => now - p.t < 600);

    if (headPosHistory.current.length < 5) return;

    const positions = headPosHistory.current;
    const yRange = Math.max(...positions.map(p => p.y)) - Math.min(...positions.map(p => p.y));
    const xRange = Math.max(...positions.map(p => p.x)) - Math.min(...positions.map(p => p.x));

    // Slightly lower thresholds to improve detection reliability
    if (yRange > 0.035 && yRange > xRange * 1.4) {
      setLastHeadGesture("nod");
    } else if (xRange > 0.035 && xRange > yRange * 1.4) {
      setLastHeadGesture("shake");
    }
  }, []);

  const clearHeadGesture = useCallback(() => {
    setLastHeadGesture(null);
    headPosHistory.current = [];
  }, []);

  const initFaceLandmarker = useCallback(async () => {
    try {
      setIsLoading(true);
      const vision = await import("@mediapipe/tasks-vision");
      const { FaceLandmarker, FilesetResolver } = vision;

      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );

      faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1,
      });

      setIsModelReady(true);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to load FaceLandmarker:", err);
      setError("Failed to load face detection model. Please refresh.");
      setIsLoading(false);
    }
  }, []);

  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: "user" }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
        setHasPermission(true);
        setIsCameraOn(true);
      }
    } catch (err) {
      console.error("Webcam access denied:", err);
      setError("Camera access denied. This game needs your camera to detect facial expressions!");
      setHasPermission(false);
      setIsCameraOn(false);
    }
  }, []);

  const startDetection = useCallback(() => {
    if (!faceLandmarkerRef.current || !videoRef.current || !isCameraOn || !isModelReady) return;
    setIsRunning(true);

    const predict = () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(predict);
        return;
      }

      if (lastVideoTimeRef.current !== video.currentTime) {
        lastVideoTimeRef.current = video.currentTime;
        const results = faceLandmarkerRef.current.detectForVideo(video, performance.now());

        if (results?.faceBlendshapes) {
          const detection = detectEmotion(results.faceBlendshapes);
          setCurrentEmotion(detection.emotion);
          setConfidence(detection.confidence);
        }

        if (results?.faceLandmarks) {
          setLastLandmarks(results.faceLandmarks);
          detectHeadGesture(results.faceLandmarks);
        }
      }

      animFrameRef.current = requestAnimationFrame(predict);
    };

    predict();
  }, [detectEmotion, detectHeadGesture, isCameraOn, isModelReady]);

  const stopDetection = useCallback(() => {
    setIsRunning(false);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    lastVideoTimeRef.current = -1;
  }, []);

  const stopWebcam = useCallback(() => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsRunning(false);
    setIsCameraOn(false);
    setLastLandmarks(null);
    headPosHistory.current = [];
  }, []);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (isCameraOn && isModelReady) {
      startDetection();
    }
  }, [isCameraOn, isModelReady, startDetection]);

  return {
    videoRef,
    isLoading,
    hasPermission,
    currentEmotion,
    confidence,
    error,
    isRunning,
    lastHeadGesture,
    clearHeadGesture,
    initFaceLandmarker,
    startWebcam,
    startDetection,
    stopDetection,
    stopWebcam,
    isCameraOn,
    isModelReady,
    lastLandmarks,
  };
}
