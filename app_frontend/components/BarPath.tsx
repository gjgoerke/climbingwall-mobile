import React from "react";
import { Path } from "@shopify/react-native-skia";
import { Skia } from "@shopify/react-native-skia";
import { useDerivedValue, SharedValue } from "react-native-reanimated";
 
interface BarPathProps {
    x: number | undefined;
    y: number;
    barWidth: number;
    graphHeight: number;
    bottomMargin: number;
    progress: SharedValue<number>;
};

const BarPath = ({x, y, barWidth, graphHeight, bottomMargin, progress}: BarPathProps) => {
    const path = useDerivedValue(() => {
        const barPath = Skia.Path.Make();
        barPath.addRRect({
            rect: {
                x: x! - barWidth / 2,
                y: graphHeight + bottomMargin,
                width: barWidth,
                height: (y * - 1 - bottomMargin) * progress.value,
            },
            rx: 8,
            ry: 8
        });
        return barPath;
    });
    return (
        <Path path={path} color={'#b798fa'}/>
    );
}

export default BarPath;