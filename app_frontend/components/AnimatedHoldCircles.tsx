import { Group } from "@shopify/react-native-skia";

import type { Hold } from "@/app/(app)/(tabs)/(boards)/board_configuration";
import HoldCircle from "./HoldCircle";

interface Props {
    holds: Hold[];
    enabledHolds: boolean[];
    selectedLed: number;
}

export default function AnimatedHoldCircles ({ holds, enabledHolds, selectedLed } : Props) {
    return(
        <Group>
            {holds.map((hold, index) => (
                enabledHolds[index] && (
                    <HoldCircle
                        key={index}
                        hold={hold}
                        isActive={index == selectedLed - 1}
                    />
                )
                ))}
        </Group>
    );
}