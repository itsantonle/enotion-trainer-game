import { Github, BookOpen, ExternalLink } from "lucide-react";

export function FooterLinks() {
  return (
    <div className="absolute bottom-1 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full px-3 py-1 md:gap-4 md:px-4"
      style={{ background: "hsla(25, 30%, 15%, 0.6)", backdropFilter: "blur(4px)" }}
    >
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-[9px] transition-opacity hover:opacity-100 md:text-[11px]"
        style={{ color: "hsl(0, 0%, 75%)", opacity: 0.7 }}
      >
        <Github className="h-3 w-3" />
        GitHub
      </a>
      <a
        href="https://opencv.org"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-[9px] transition-opacity hover:opacity-100 md:text-[11px]"
        style={{ color: "hsl(0, 0%, 75%)", opacity: 0.7 }}
      >
        <ExternalLink className="h-3 w-3" />
        OpenCV
      </a>
      <a
        href="https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-[9px] transition-opacity hover:opacity-100 md:text-[11px]"
        style={{ color: "hsl(0, 0%, 75%)", opacity: 0.7 }}
      >
        <BookOpen className="h-3 w-3" />
        MediaPipe
      </a>
    </div>
  );
}
