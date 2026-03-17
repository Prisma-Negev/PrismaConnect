import { useState } from "react";
import { useShowContext } from "ra-core";
import { Brain, Loader2, Star, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Contact } from "../types";
import {
  analyzeContact,
  hasAIProvider,
  getActiveProvider,
  type ContactAnalysis,
} from "../ai/aiService";

// ─── Score badge color helper ─────────────────────────────────────────────────
function scoreColor(score: number): string {
  if (score >= 8) return "bg-green-100 text-green-800 border-green-200";
  if (score >= 5) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  return "bg-red-100 text-red-800 border-red-200";
}

function potentialLabel(potential: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    high: { label: "פוטנציאל גבוה", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    medium: { label: "פוטנציאל בינוני", color: "bg-blue-100 text-blue-800 border-blue-200" },
    low: { label: "פוטנציאל נמוך", color: "bg-gray-100 text-gray-700 border-gray-200" },
  };
  return map[potential] ?? { label: potential, color: "bg-gray-100 text-gray-700 border-gray-200" };
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * AI Analysis panel shown inside the ContactShow page.
 * Analyzes the contact's CRIS score, keywords, and recommended next action.
 */
export const ContactAIPanel = () => {
  const { record, isPending } = useShowContext<Contact>();
  const [analysis, setAnalysis] = useState<ContactAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isPending || !record) return null;

  const hasKey = hasAIProvider();

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeContact({
        first_name: record.first_name,
        last_name: record.last_name,
        title: record.title,
        department: record.department,
        research_focus: record.research_focus,
        background: record.background,
        cris_profile: record.cris_profile,
        academic_title: record.academic_title,
        sector: record.sector,
      });
      if (result) {
        setAnalysis(result);
      } else {
        setError("לא ניתן לקבל תגובה מספק ה-AI. בדוק את מפתח ה-API.");
      }
    } catch (e) {
      setError("שגיאה בניתוח AI. נסה שוב.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="size-5 text-primary" />
          ניתוח AI — פריזמה נגב
          <Badge variant="outline" className="text-xs ml-auto opacity-60">
            {getActiveProvider()}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* No API key warning */}
        {!hasKey && (
          <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <AlertCircle className="size-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">מפתח AI לא מוגדר</p>
              <p className="text-xs mt-0.5">
                הגדר <code>VITE_GEMINI_API_KEY</code> ב-<code>.env.local</code> או
                דרך הגדרות המערכת.
              </p>
            </div>
          </div>
        )}

        {/* Analysis result */}
        {analysis && (
          <div className="space-y-3">
            {/* Score + potential */}
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={`text-sm font-bold px-3 py-1 ${scoreColor(analysis.cris_score)}`}
              >
                <Star className="size-3 mr-1" />
                ציון CRIS: {analysis.cris_score}/10
              </Badge>
              <Badge
                variant="outline"
                className={`text-sm ${potentialLabel(analysis.collaboration_potential).color}`}
              >
                {potentialLabel(analysis.collaboration_potential).label}
              </Badge>
            </div>

            {/* Summary */}
            <div className="text-sm leading-relaxed text-foreground/85 bg-muted/40 rounded-lg p-3 border">
              {analysis.summary}
            </div>

            {/* Keywords */}
            {analysis.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {analysis.keywords.map((kw, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {kw}
                  </Badge>
                ))}
              </div>
            )}

            {/* Recommended action */}
            <div className="text-sm">
              <span className="font-semibold text-primary">פעולה מומלצת: </span>
              <span className="text-foreground/80">{analysis.recommended_action}</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Action button */}
        <Button
          onClick={handleAnalyze}
          disabled={loading || !hasKey}
          variant={analysis ? "outline" : "default"}
          size="sm"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              מנתח...
            </>
          ) : analysis ? (
            <>
              <RefreshCw className="size-4 mr-2" />
              נתח מחדש
            </>
          ) : (
            <>
              <Brain className="size-4 mr-2" />
              נתח עם AI
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
