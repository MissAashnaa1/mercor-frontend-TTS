import React, { useEffect, useLayoutEffect, useState } from "react";
import "./App.css";
import { Box, Button, ButtonGroup, useAlertStyles } from "@chakra-ui/react";
import regeneratorRuntime from "regenerator-runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Chat from "./temp/Chat";

import Bard from "bard-ai";

function App() {
  const [transcriptText, setTranscriptText] = useState("");
  const [quesList, setQuesList] = useState([]);

  let questions = [
    { q: 1 },
    { q: 2 },
    { q: 3 },
    { q: 4 },
    { q: 5 },
    { q: 6 },
    { q: 7 },
  ];

  // speak
  const [text, setText] = useState(
    "During the 1990s and early 2000s a new wave of writers, including Brian Michael Bendis (Daredevil, The Avengers), Jonathan Hickman (Fantastic Four), and Ed Brubaker (Captain America), became well known for their mature and sometimes controversial takes on Marvel’s characters. The 2010s saw the emergence of another new wave of talent, with writer Matt Fraction and artist David Aja turning in a visually arresting run on Hawkeye, longtime Spider-Man writer Dan Slott teaming with artist Mike Allred for a bold take on a classic character in Silver Surfer, and writer G. Willow Wilson and artist Adrian Alphona breaking new ground with their critically acclaimed Ms. Marvel."
  );
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const synth = window.speechSynthesis;

  const voicePackName = "Microsoft Neerja Online (Natural) - English (India)";

  useEffect(() => {
    // read the questions from the local storage
    const quesList = localStorage.getItem("quesList");
    if (quesList) {
      setQuesList(JSON.parse(quesList));
    } else {
      // if no questions are available in the local storage, then set the questions
      localStorage.setItem("quesList", JSON.stringify(questions));
    }
  }, []);

  useEffect(() => {
    // Fetch the list of available voices when the component mounts
    getVoices();

    // Event listener for when voices change
    synth.addEventListener("voiceschanged", getVoices);

    // Cleanup event listener on unmount
    return () => {
      synth.removeEventListener("voiceschanged", getVoices);
    };
  }, []);

  const getVoices = () => {
    const voiceList = synth.getVoices();
    setVoices(voiceList);

    // Set a default voice
    // setSelectedVoice(voiceList[0]);
    setSelectedVoice(voiceList.find((v) => v.name === voicePackName));
  };

  const handleVoiceChange = (event) => {
    const selectedVoiceName = event.target.value;
    const voice = voices.find((v) => v.name === selectedVoiceName);
    setSelectedVoice(voice);
  };

  const handleSpeak = () => {
    if (!selectedVoice || !text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    console.log(selectedVoice);
    synth.speak(utterance);
  };

  //speak

  const func = () => {
    console.log("hi");
  };

  const hanldeResetTranscript = async () => {
    setTranscriptText(transcript);
    console.log(transcriptText);
    console.log(transcript);
    setText(transcript);
    resetTranscript();
  };

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleStopSpeak = () => {
    synth.cancel();
  };

  const bardFunc = async () => {
    const bard = new Bard(
      "aAhmj2rSmSC8jsBQo6G1fuJxG5PvpPFL-q9FZ0EyuWSdKLbD6k6vhkQOpsmeanmkpH9JAw."
    );
    try {
      const response = await bard.query(
        "What is the distance from moon to earth"
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection={"column"}
        gap={4}
        h="100vh"
        w="100vw"
      >
        {true ? (
          <select onChange={handleVoiceChange}>
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        ) : (
          <p>Loading...</p>
        )}
        <p>Microphone: {listening ? "on" : "off"}</p>
        <ButtonGroup spacing={4} direction="row" align="center">
          <Button
            colorScheme="messenger"
            onClick={() =>
              SpeechRecognition.startListening({ continuous: true })
            }
          >
            Start
          </Button>
          <Button
            colorScheme="purple"
            onClick={SpeechRecognition.stopListening}
          >
            Stop
          </Button>
          <Button
            colorScheme="twitter"
            onClick={() => {
              hanldeResetTranscript();
            }}
          >
            Reset
          </Button>
        </ButtonGroup>
        <Button colorScheme="teal" onClick={handleSpeak}>
          Speak
        </Button>
        <Button colorScheme="teal" onClick={handleStopSpeak}>
          Stop Speaking
        </Button>
        <p color="black">{transcript}</p>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection={"column"}
        gap={4}
        h="100vh"
        w="100vw"
      >
        {/* <Chat /> */}
        <Button colorScheme="teal" onClick={bardFunc}>
          BardTest
        </Button>
        <Button
          colorScheme="teal"
          onClick={() => {
            if (questions.length === 0) {
              alert("No more questions available.");
            } else {
              // Get a random index
              const randomIndex = Math.floor(Math.random() * questions.length);
              // Get the random question
              const randomQuestion = questions.splice(randomIndex, 1)[0];
              console.log(randomQuestion);
            }
          }}
        >
          get Ques
        </Button>
      </Box>
    </>
  );
}

export default App;
