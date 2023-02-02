import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsSoundwave } from "react-icons/bs";

export const SliderWithTitle = ({
  label,
  name,
  defaultValue,
  min,
  max,
  step,
  setValue,
}: {
  label: string;
  name: any;
  defaultValue: any;
  min: number;
  max: number;
  step: number;
  setValue: any;
}) => {
  const { register } = useForm();
  const [value, setValueState] = useState(defaultValue);
  const { ref } = register(name);
  return (
    <>
      <Text w={"full"} textAlign={"left"}>
        {label}: {value}
      </Text>
      <Slider
        aria-label="slider-ex-4"
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step}
        onChange={(value) => {
          setValueState(value);
          setValue(name, value);
        }}
        ref={ref}
      >
        <SliderTrack bg="gray.100">
          <SliderFilledTrack bg="tomato" />
        </SliderTrack>
        <SliderThumb boxSize={6}>
          <Box color="tomato" as={BsSoundwave} />
        </SliderThumb>
      </Slider>
    </>
  );
};
