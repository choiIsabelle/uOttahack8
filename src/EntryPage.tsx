import React, { useState } from "react";
import LandingPage from "./LandingPage";
import ResultsPage from "./ResultsPage";
import { translateText, type TranslateResponse } from "./api/translate";

const EntryPage: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  type FinishData = {
    role: string | null;
    from: string | null;
    to: string | null;
    file?: File | null;
    text?: string | null;
  };

  const [translationResult, setTranslationResult] = useState<TranslateResponse | null>(null);

  const handleFinish = async (data: FinishData) => {
    console.log("LandingPage finished:", data);

    // Get text content (from text input or file)
    let textContent = data.text || "";

    if (data.file && !textContent) {
      // Read file content
      textContent = await data.file.text();
    }

    if (!textContent.trim()) {
      setError("Please provide text to translate");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await translateText({
        role: data.role,
        from: data.from,
        to: data.to,
        text: textContent,
      });
      setTranslationResult(result);
      setStarted(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation failed");
    } finally {
      setLoading(false);
    }
  };

  // Show results page after successful translation
  if (translationResult) {
    return (
      <ResultsPage
        original={translationResult.original}
        translation={translationResult.translation}
        from={translationResult.from}
        to={translationResult.to}
        role={translationResult.role}
        onBack={() => setTranslationResult(null)}
      />
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="bg-white/90 dark:bg-gray-900/70 rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-800 dark:text-white">
            Translating...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      {!started ? (
        <div className="text-center text-white max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold">
            Find the best AI model for translation!
          </h1>
          <p className="mt-4 text-lg opacity-90">
            Quickly pick your role, languages, and upload a file or paste text
            to translate.
          </p>

          <div className="mt-8">
            <button
              onClick={() => setStarted(true)}
              className="px-6 py-3 bg-white text-blue-600 rounded-full font-semibold shadow hover:scale-105 transition-transform"
            >
              Let's go!
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/80 rounded-lg text-white">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full">
          <LandingPage
            onBack={() => setStarted(false)}
            onFinish={handleFinish}
          />
        </div>
      )}
    </div>
  );
};

export default EntryPage;
