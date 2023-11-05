import React, { useCallback, useMemo, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { getBodyPart } from "./bodyParts";
import style from "./BodyMap.module.css";
import { Center, Button, Box } from "@chakra-ui/react";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_REPORT } from "../../../../graphql/mutation";
import { userMailtoId } from "../../../../graphql/queries";
import { useUser } from "@auth0/nextjs-auth0/client";

const BodyContainer = ({ children }) => (
  <div
    style={{
      width: "207px",
      height: "500px",
      margin: "30px auto",
    }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375.42 832.97">
      <g>{children}</g>
    </svg>
  </div>
);

const BodyPart = ({
  id,
  d,
  fill,
  onClick,
  onMouseEnter,
  onMouseLeave,
  selectedParts,
  selectedCount,
  number,
  onInjuryDetailsChange,
  injuryDetails,
}) => {
  const handleClick = () => {
    onClick(id);
  };

  const handleMouseEnter = () => {
    onMouseEnter(id);
  };

  const handleMouseLeave = () => {
    onMouseLeave(id);
  };

  const handleInjuryDetailsChange = (e) => {
    onInjuryDetailsChange(id, e.target.value);
  };

  // Calculate text position based on the bounding box of the path
  const calculateTextPosition = () => {
    const path = document.getElementById(id);
    if (path) {
      const bbox = path.getBBox();
      return {
        x: bbox.x + bbox.width + 10, // Adjust these values for proper positioning
        y: bbox.y + bbox.height / 2, // Adjust these values for proper positioning
      };
    }
    return { x: 0, y: 0 }; // Default position if the path is not found
  };

  const textPosition = calculateTextPosition();

  return (
    <g>
      <path
        d={d}
        id={id}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          WebkitTapHighlightColor: "transparent",
          cursor: "pointer",
          fill,
        }}
      />

      {selectedParts.includes(id) ? (
        <text
          x={textPosition.x}
          y={textPosition.y}
          fontFamily="Arial"
          fontSize="24"
          fill="white"
        >
          {selectedParts.indexOf(id) + 1}
        </text>
      ) : null}
    </g>
  );
};

const BodyMap = () => {
  const [lang, setLang] = useState("en");
  const [selectedParts, setSelectedParts] = useState([]);
  const [hovered, setHovered] = useState(null);
  const toast = useToast();
  const [partNumbers, setPartNumbers] = useState({});
  const [selectedCount, setSelectedCount] = useState(0);
  const [injuryDetails, setInjuryDetails] = useState({});
  const { user } = useUser();
  const { data, loading } = useQuery(userMailtoId, {
    variables: {
      email: user?.email,
    },
    skip: !user,
  });
  const [addReport, { error }] = useMutation(ADD_REPORT);

  const getSelectedCount = useCallback(() => {
    return Object.keys(selectedParts).length;
  }, [selectedParts]);

  const antBodyParts = useMemo(() => {
    return getBodyPart(lang).filter(({ face }) => face === "ant");
  }, [lang]);

  const postBodyPart = useMemo(() => {
    return getBodyPart(lang).filter(({ face }) => face === "post");
  }, [lang]);

  const clickedNames = useMemo(() => {
    return selectedParts.map((id) => {
      const part = getBodyPart(lang).find((d) => id === d.id);
      return part?.name || "";
    });
  }, [lang, selectedParts]);

  const handleInjuryDetailsChange = (bodyPart, details) => {
    setInjuryDetails({ ...injuryDetails, [bodyPart]: details });
  };

  const getSelected = useCallback(
    (bodyPartId) => {
      setSelectedCount((prevCount) => prevCount + 1);
    },
    [selectedParts]
  );

  const getFill = useCallback(
    (bodyPartId) => {
      if (selectedParts.includes(bodyPartId)) {
        return "rgb(255, 59, 48)"; // Fill color for selected body parts (red)
      } else if (hovered === bodyPartId) {
        return "rgb(87, 87, 85)"; // Fill color for hovered body parts
      } else {
        return "rgb(75, 75, 77)"; // Default fill color
      }
    },
    [selectedParts, hovered]
  );

  const getNumber = useCallback(
    (bodyPartId) => {
      return partNumbers[bodyPartId];
    },
    [partNumbers]
  );

  const handleChangeLang = (e) => {
    setLang(e.target.value);
  };

  const handleClick = (id) => {
    if (selectedParts.includes(id)) {
      // Deselect the body part if it's already selected
      setSelectedParts(selectedParts.filter((part) => part !== id));
      // Remove the number for the deselected part
      setPartNumbers((prevNumbers) => {
        const { [id]: removedNumber, ...restNumbers } = prevNumbers;
        return restNumbers;
      });
      setSelectedCount((prevCount) => prevCount - 1);
    } else {
      // Select the body part if it's not already selected
      setSelectedParts([...selectedParts, id]);
      // Add the number for the selected part
      setPartNumbers((prevNumbers) => ({
        ...prevNumbers,
        [id]: selectedParts.length + 1,
      }));
      setSelectedCount((prevCount) => prevCount + 1);
    }
  };

  const handleMouseEnter = (id) => {
    if ("ontouchstart" in window) return;
    setHovered(id);
  };

  const handleMouseLeave = () => {
    if ("ontouchstart" in window) return;
    setHovered(null);
  };

  const submitReport = (part) => {
    const report = {
      content: injuryDetails[part],
      bodyPart: part,
      userId: data?.userMailtoId,
    };
    addReport({ variables: report });
    toast({
      title: "Report submitted.",
      description: "Your report has been submitted.",
      position: "top-right",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    if (error) {
      toast({
        title: "Error",
        description: "Your report has not been submitted.",
        position: "top-right",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  console.log(injuryDetails);

  return (
    <>
      <div className={style.header}>
        <p>Selected Parts: {clickedNames.join(", ")}</p>
      </div>
      <div className={style.bodies}>
        <div>
          <p>{txt[lang][1]}</p>
          <BodyContainer>
            {antBodyParts.map((bodyPart, index) => (
              <BodyPart
                key={index}
                id={bodyPart.id}
                d={bodyPart.d}
                fill={getFill(bodyPart.id)}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                selectedParts={selectedParts}
                number={partNumbers}
                selectedCount={selectedCount}
              />
            ))}
          </BodyContainer>
        </div>
        <div>
          <p>{txt[lang][2]}</p>
          <BodyContainer>
            {postBodyPart.map((bodyPart, index) => (
              <BodyPart
                key={index}
                id={bodyPart.id}
                d={bodyPart.d}
                fill={getFill(bodyPart.id)}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                selectedParts={selectedParts}
                selectedCount={selectedCount}
                number={partNumbers}
              />
            ))}
          </BodyContainer>
        </div>
      </div>
      <Center mb="6">
        {selectedParts.length === 0 ? (
          <h3> Click on the body </h3>
        ) : (
          <div className={style.injuryDetails}>
            {selectedParts.map((id) => {
              const part = getBodyPart(lang).find((d) => id === d.id);

              return (
                <div key={id}>
                  <Center mb="2">
                    {part?.name} ({selectedParts.indexOf(part?.id) + 1})
                  </Center>
                  <Box display>
                    <textarea
                      row
                      cols="50"
                      onChange={(e) => {
                        handleInjuryDetailsChange(part.name, e.target.value);
                      }}
                    />
                    <Button
                      mb={7}
                      ml={3}
                      onClick={() => submitReport(part?.name)}
                    >
                      Submit
                    </Button>
                  </Box>
                </div>
              );
            })}
          </div>
        )}
      </Center>
    </>
  );
};

const txt = {
  en: {
    0: "Click on the body!",
    1: "Anterior side",
    2: "Posterior side",
  },
};

export default BodyMap;
