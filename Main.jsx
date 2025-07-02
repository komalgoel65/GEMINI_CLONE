import React, { useState } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { URL } from "../../constants";

const Main = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(""); // plain markdown text
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ------------ main action ------------- */
  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setShowResult(true);

    // Add a gentle formatting instruction only for “real” questions
    const needsFormat = !(
      question.trim().length < 10 || /^(hi|hello|hey)$/i.test(question.trim())
    );

    const payload = {
      contents: [
        {
          parts: [
            {
              text: needsFormat
                ? `Please respond using markdown headings (## Heading) and normal paragraphs. Avoid asterisks (*) or dashes (-).\n\n${question}`
                : question,
            },
          ],
        },
      ],
    };

    try {
      const res = await fetch(URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      const raw = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setAnswer(raw);
    } catch (err) {
      console.error(err);
      setAnswer("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ------------ helpers ------------- */
  const renderAnswer = () =>
    answer.split("\n").map((line, i) => {
      if (line.startsWith("##")) {
        return (
          <h3 key={i} className="answer-heading">
            {line.replace(/^##\s*/, "")}
          </h3>
        );
      }
      if (line.trim()) {
        return (
          <p key={i} className="answer-paragraph">
            {line}
          </p>
        );
      }
      return null; // skip empty lines
    });

  /* ------------ UI ------------- */
  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="" />
      </div>

      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, Dev.</span>
              </p>
              <p>How can I help you today?</p>
            </div>
            {/* your cards stay unchanged */}
            <div className="cards">
              <div className="card">
                <p>
                  Suggest beautiful places to explore on an upcoming road trip
                </p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div className="card">
                <p>Briefly summarize this concept: urban planning</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div className="card">
                <p>Brainstorm team‑bonding activities for our work retreat</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div className="card">
                <p>Improve the readability of the following code</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user_icon} alt="" />
              <p>{question}</p>
            </div>

            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />

              {loading ? (
                <div className="typing-loader">
                  <span />
                  <span />
                  <span />
                </div>
              ) : (
                <div className="answer">{renderAnswer()}</div>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter a prompt here"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askQuestion()}
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              <img onClick={askQuestion} src={assets.send_icon} alt="" />
            </div>
          </div>
          <p className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double‑check its responses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
