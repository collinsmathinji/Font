import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ExternalLink, Loader2 } from "lucide-react";
import { loadGoogleFont, FontData } from "@/lib/fonts";
import { useFontsByDesignerFromSupabase } from "@/hooks/useFontsFromSupabase";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GlobalSearchBar } from "@/components/GlobalSearchBar";

export default function Foundry() {
  const { slug } = useParams<{ slug: string }>();
  const [fontSize, setFontSize] = useState(48);
  const [selectedWeight, setSelectedWeight] = useState<string>("400");
  const [sortBy, setSortBy] = useState<"name" | "popularity">("name");

  const { fonts, designerName, isLoading } = useFontsByDesignerFromSupabase(slug || "");

  // Load all fonts from this designer
  useEffect(() => {
    fonts.forEach(font => loadGoogleFont(font.family, font.weights));
  }, [fonts]);

  const sortedFonts = useMemo(() => {
    const sorted = [...fonts];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.family.localeCompare(b.family));
    } else if (sortBy === "popularity") {
      sorted.sort((a, b) => (a.popularity || 0) - (b.popularity || 0));
    }
    return sorted;
  }, [fonts, sortBy]);

  // Generate a random color for the avatar
  const avatarColor = useMemo(() => {
    const colors = ["#FF6B35", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];
    const hash = (designerName || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }, [designerName]);

  const displayName = designerName || slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || "Designer";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-xl">F</span>
            </div>
          </Link>

          {/* Search */}
          <GlobalSearchBar />

          {/* Spacer */}
          <div className="w-10 flex-shrink-0" />
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border/50">
        <div className="container mx-auto px-6 md:px-12 py-3 flex items-center gap-6">
          <Link 
            to="/pairing" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Font Pairing Tool
          </Link>
        </div>
      </nav>

      {/* Loading state */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && (
        <>
          {/* Foundry Profile */}
          <div className="py-16 text-center border-b border-border/50">
            {/* Avatar */}
            <div 
              className="w-28 h-28 rounded-full mx-auto mb-6"
              style={{ backgroundColor: avatarColor }}
            />
            
            {/* Name */}
            <h1 className="text-3xl font-semibold mb-2 flex items-center justify-center gap-2">
              {displayName}
            </h1>
            
            {/* Font count */}
            <p className="text-muted-foreground mb-6">
              {fonts.length} font{fonts.length !== 1 ? 's' : ''} on Google Fonts
            </p>
            
            {/* Follow Button */}
            <Button variant="outline" className="rounded-full px-8">
              Follow
            </Button>
          </div>

          {/* Tabs */}
          <div className="border-b border-border/50">
            <div className="container mx-auto px-6 md:px-12">
              <div className="flex items-center gap-8">
                <button className="py-4 border-b-2 border-foreground font-medium">
                  Fonts
                </button>
                <button className="py-4 text-muted-foreground hover:text-foreground transition-colors">
                  Collections
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="border-b border-border/50">
            <div className="container mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* Weight Selector */}
                <Select value={selectedWeight} onValueChange={setSelectedWeight}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border">
                    <SelectItem value="100">Thin</SelectItem>
                    <SelectItem value="200">ExtraLight</SelectItem>
                    <SelectItem value="300">Light</SelectItem>
                    <SelectItem value="400">Regular</SelectItem>
                    <SelectItem value="500">Medium</SelectItem>
                    <SelectItem value="600">SemiBold</SelectItem>
                    <SelectItem value="700">Bold</SelectItem>
                    <SelectItem value="800">ExtraBold</SelectItem>
                    <SelectItem value="900">Black</SelectItem>
                  </SelectContent>
                </Select>

                {/* Size Slider */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-8">{fontSize}</span>
                  <Slider
                    value={[fontSize]}
                    onValueChange={([value]) => setFontSize(value)}
                    min={12}
                    max={120}
                    step={1}
                    className="w-40"
                  />
                </div>
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={(v: "name" | "popularity") => setSortBy(v)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border">
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Font List */}
          <main className="flex-1 container mx-auto px-6 md:px-12 py-8">
            <div className="space-y-2">
              {sortedFonts.map((font) => (
                <FontRow 
                  key={font.family} 
                  font={font} 
                  fontSize={fontSize}
                  weight={parseInt(selectedWeight)}
                />
              ))}
            </div>
            
            {fonts.length === 0 && !isLoading && (
              <div className="text-center py-16 text-muted-foreground">
                No fonts found for this designer.
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="border-t border-border/50 mt-auto">
            <div className="container mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span>© 2025 FontPair</span>
                <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                <Link to="/pairing" className="hover:text-foreground transition-colors">Font Pairing</Link>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

interface FontRowProps {
  font: FontData;
  fontSize: number;
  weight: number;
}

function FontRow({ font, fontSize, weight }: FontRowProps) {
  const [sampleText, setSampleText] = useState(font.family);
  
  // Find the closest available weight
  const closestWeight = useMemo(() => {
    if (font.weights.includes(weight)) return weight;
    return font.weights.reduce((prev, curr) => 
      Math.abs(curr - weight) < Math.abs(prev - weight) ? curr : prev
    );
  }, [font.weights, weight]);

  // Generate download URL
  const downloadUrl = `https://fonts.google.com/specimen/${encodeURIComponent(font.family)}`;

  return (
    <div className="group py-6 border-b border-border/30 flex items-center justify-between gap-8">
      <div className="flex-1 min-w-0">
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => setSampleText(e.currentTarget.textContent || font.family)}
          className="outline-none"
          style={{
            fontFamily: `"${font.family}", ${font.category}`,
            fontSize: `${fontSize}px`,
            fontWeight: closestWeight,
            lineHeight: 1.2,
          }}
        >
          {sampleText}
        </div>
      </div>
      
      <a
        href={downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full",
          "text-sm text-muted-foreground hover:text-foreground",
          "border border-border hover:border-foreground",
          "opacity-0 group-hover:opacity-100 transition-all duration-200",
          "flex-shrink-0"
        )}
      >
        Download
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
