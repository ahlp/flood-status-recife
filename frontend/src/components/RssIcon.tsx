import React from "react";
import { Rss } from "lucide-react";
import { Link } from "react-router-dom";

export const RssIcon: React.FC = () => {
  return (
    <Link
      to="/rss"
      title="Feed RSS"
      aria-label="Acessar Feed RSS"
      className="inline-flex items-center gap-1.5 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full transition-all focus-visible:ring-2 focus-visible:ring-white"
    >
      <Rss className="w-5 h-5" />
    </Link>
  );
};
