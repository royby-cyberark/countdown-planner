import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type VideoType = "youtube" | "twitter" | null;

const parseVideoUrl = (url: string): { type: VideoType; id: string | null } => {
  const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/v\/))([^&?]*)/);
  const twitterMatch = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);

  if (youtubeMatch) return { type: "youtube", id: youtubeMatch[1] };
  if (twitterMatch) return { type: "twitter", id: twitterMatch[1] };
  return { type: null, id: null };
};

export default function VideoPlayer() {
  const [videoUrl, setVideoUrl] = useState(localStorage.getItem("videoUrl") || "");
  const [videoType, setVideoType] = useState<VideoType>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (videoUrl) {
      localStorage.setItem("videoUrl", videoUrl);
      const { type, id } = parseVideoUrl(videoUrl);
      setVideoType(type);
      setVideoId(id);
    }
  }, [videoUrl]);

  const renderEmbed = () => {
    if (!videoId || !videoType) return null;

    if (videoType === "youtube") {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (videoType === "twitter") {
      return (
        <iframe
          src={`https://platform.twitter.com/embed/Tweet.html?id=${videoId}`}
          className="w-full h-full rounded-lg"
          allowFullScreen
        />
      );
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Enter YouTube or Twitter/X video URL..."
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="backdrop-blur bg-card/60"
      />
      {videoId && videoType && (
        <div className="aspect-video">
          {renderEmbed()}
        </div>
      )}
    </div>
  );
}
