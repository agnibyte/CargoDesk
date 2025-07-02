import TabComponent from "@/components/common/tabComponent";
import { useState, useEffect } from "react";

export default function Home() {
  const [note, setNote] = useState(""); // Current note being recorded
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");

  const handleSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false; // Stop recognition after a single phrase
    recognition.interimResults = true;
    recognition.lang = "en-US"; // Change to "mr-IN" for Marathi

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }

      setNote(transcript);
    };

    recognition.onerror = (event) => {
      setError("Error occurred in recognition: " + event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Note submitted: ${note}`);
    setNote("");
  };
  const tabsData = [
    { title: "Tab 1", content: "Content for the first tab." },
    { title: "Tab 2", content: "Content for the second tab." },
    { title: "Tab 3", content: "Content for the third tab." },
  ];
  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Add a Note</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="flex items-center border rounded p-2 shadow-sm">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Type or speak your note here..."
              className="flex-1 outline-none p-2"
            />
            <button
              type="button"
              onClick={handleSpeechRecognition}
              disabled={isListening}
              className="ml-2 text-gray-500 hover:text-blue-500"
            >
              {isListening ? (
                <span className="animate-pulse">🎤</span>
              ) : (
                <span>🎙️</span>
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-500"
          >
            Submit Note
          </button>
        </form>
      </div>
    </div>
  );
}
