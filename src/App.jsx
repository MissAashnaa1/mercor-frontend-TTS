import React, { useEffect, useLayoutEffect, useState } from "react";
import "./App.css";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import {
  Box,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Button,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import regeneratorRuntime from "regenerator-runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Chat from "./temp/Chat";
import Navbar from "./NavBar";

function App() {
  const [transcriptText, setTranscriptText] = useState("");
  const [quesList, setQuesList] = useState([]);
  const [getStarted, setGetStarted] = useState(true);
  const [skipped, setSkipped] = useState(false);

  // speak
  const [text, setText] = useState("A new wave of writers");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const synth = window.speechSynthesis;

  const voicePackName = "Microsoft Neerja Online (Natural) - English (India)";

  useEffect(() => {
    // welcomeFunc();
    // setTimeout(() => {}, 1000);
    getQuesList();
  }, []);
  useEffect(() => {
    // Fetch the list of available voices when the component mounts
    getVoices();

    // Event listener for when voices change
    synth.addEventListener("voiceschanged", getVoices);
    //

    // Cleanup event listener on unmount
    return () => {
      synth.removeEventListener("voiceschanged", getVoices);
    };
  }, []);
  const welcomeFunc = () => {
    const welcomeText = "Welcome to the test";
    handleSpeak("Welcome to the test");
  };

  const getQuesList = async () => {
    try {
      let res = await fetch("http://localhost:5000/api/get-question");
      let data = await res.json();
      console.log(data);
      setQuesList(data.ques);
    } catch (error) {
      console.log(error);
    }

    const quesList = localStorage.getItem("quesList");
    if (quesList) {
      // setQuesList(JSON.parse(quesList));
    } else {
      // if no questions are available in the local storage, then set the questions
      // localStorage.setItem("quesList", JSON.stringify(questions));
    }
  };

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

  const handleSpeak = (text) => {
    setText(text);
    if (synth.speaking) {
      synth.cancel();
    }
    if (!selectedVoice || !text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    // console.log(selectedVoice);
    synth.speak(utterance);
  };

  //speak

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

  return (
    <>
      {getStarted ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection={"column"}
          gap={4}
          h="100vh"
          w="100vw"
        >
          <Button
            onClick={() => {
              handleSpeak(
                "Welcome to the test. Click on Get Question Button to get a question. Click on Listen button to listen to the question. Click on Answer button and speak clearly to answer. Click on Stop Speaking button to stop speaking. Click on Get Question to get the next question. Click on Submit Test to end the test."
              );
              setGetStarted(false);
            }}
          >
            Get Started
          </Button>
        </Box>
      ) : (
        <>
          <Box bg="facebook.100" px={4}>
            <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
              <HStack spacing={8} alignItems={"center"}>
                <Box>Mercor Assignment</Box>
              </HStack>
              <Flex alignItems={"center"} gap={50}>
                <Text>Username: </Text>
                <Button
                  variant={"solid"}
                  colorScheme={"teal"}
                  size={"sm"}
                  mr={4}
                >
                  Getting Started
                </Button>
                <Box w={"51%"}></Box>
              </Flex>
            </Flex>
          </Box>

          <Box p={4}>
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
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection={"column"}
              gap={4}
              h="100vh"
              w="100vw"
            >
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
              <Button colorScheme="teal" onClick={() => handleSpeak(text)}>
                Speak
              </Button>
              {!skipped && (
                <Button
                  colorScheme="teal"
                  onClick={() => {
                    handleStopSpeak();
                    setSkipped(true);
                  }}
                >
                  Skip Tutorial
                </Button>
              )}
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
              <Button
                colorScheme="teal"
                onClick={() => {
                  console.log(quesList.length);
                  if (quesList.length === 0) {
                    alert("No more questions available.");
                  } else {
                    // Get a random index
                    const randomIndex = Math.floor(
                      Math.random() * quesList.length
                    );
                    // Get the random question
                    let tempQL = quesList;
                    // console.log(tempQL);
                    const randomQuestion = tempQL.splice(randomIndex, 1)[0];
                    setQuesList(tempQL);
                    console.log(randomQuestion);
                    setText(randomQuestion.question);
                    handleSpeak(randomQuestion.question);
                  }
                }}
              >
                Get Ques
              </Button>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}

export default App;
