import { Dispatch } from "react";
import { SetStateAction } from "react";
import type { Hold } from "@/app/(app)/(tabs)/(boards)/board_configuration";
import CircleGestureHandler from "./CircleGestureHandler";

interface Props {
    holds: Hold[];
    enabledHolds: boolean[];
    selectedLed: number;
    setSelectedLed: Dispatch<SetStateAction<number>>;
    canvasHeight: number;
    canvasWidth: number;
    deleteHoldCircle: (index: number) => void;
}
export default function AnimatedCircleGestureHandlers ({ holds, enabledHolds, selectedLed, setSelectedLed, canvasHeight, canvasWidth, deleteHoldCircle } : Props) {
    
    return(
        <>
            {holds.map((hold, index) => (
                enabledHolds[index] && (
                    <CircleGestureHandler
                        key={index}
                        index={index}
                        hold={hold}
                        isActive={index == selectedLed - 1}
                        setSelectedLed={setSelectedLed}
                        canvasHeight={canvasHeight}
                        canvasWidth={canvasWidth}
                        deleteHoldCircle={deleteHoldCircle}
                    />
                )
            ))}
        </>
    );
}