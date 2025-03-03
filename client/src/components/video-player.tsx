import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VideoPlayer() {
  const [videoUrl, setVideoUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");

  const handleVideoSubmit = () => {
    const videoId = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/v\/))([^&?]*)/)?.[1];
    if (videoId) {
      setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter YouTube URL..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleVideoSubmit();
            }
          }}
          className="backdrop-blur bg-card/60"
        />
        <Button
          onClick={handleVideoSubmit}
          className="bg-primary/80 hover:bg-primary shadow-sm shadow-primary/20"
        >
          Load
        </Button>
      </div>
      {embedUrl && (
        <div className="aspect-video">
          <iframe
            src={embedUrl}
            className="w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
