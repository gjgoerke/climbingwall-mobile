import React, { useEffect } from "react";
import { useWindowDimensions, View, StyleSheet } from "react-native";
import { Canvas, Group } from "@shopify/react-native-skia";
import * as d3 from 'd3';

import BarPath from "./BarPath";
import XAxisText from "./XAxisText";
import YAxis from "./YAxis";
import { useSharedValue, withTiming } from "react-native-reanimated";

export interface BarGraphData {
    label: string;
    value: number;
}

interface BarGraphProps {
    data: BarGraphData[];
}

export default function BarGraph ({ data } : BarGraphProps) {
    const { width } = useWindowDimensions();
    const progress = useSharedValue<number>(0);
    const canvasWidth = width;
    const barWidth = canvasWidth / data.length - 8;
    const canvasHeight = 350;
    const graphWidth = width;
    const bottomMargin = 20;
    const topMargin = 20;
    const leftMargin = 10;
    const graphHeight = canvasHeight - bottomMargin - topMargin;
    const xRange = [leftMargin, graphWidth];
    const xDomain = data.map((dataPoint => dataPoint.label))
    const x = d3.scalePoint().domain(xDomain).range(xRange).padding(1);
    const yRange = [-1 * bottomMargin, graphHeight - topMargin];
    const yDomain = [0, d3.max(data, (dataPoint) => (dataPoint.value))!];
    const y = d3.scaleLinear().domain(yDomain).range(yRange);

    useEffect(() => {
        progress.value = withTiming(1, {duration: 1000})
    },[data])
    return (
        <View style={styles.container}>
            <Canvas style={{width: canvasWidth, height: canvasHeight}}>
            <YAxis
                    height={graphHeight}
                    canvasWidth={canvasWidth}
                    topMargin={topMargin}
                    bottomMargin={bottomMargin}
                    maxValue={d3.max(data, d => d.value) || 10}
                    paddingLeft={0}
            />
                {
                    data.map((dataPoint, index) => (
                        <Group key={index}>
                            <BarPath
                                x={x(dataPoint.label)}
                                y={y(dataPoint.value)}
                                barWidth={barWidth}
                                graphHeight={graphHeight}
                                bottomMargin={bottomMargin}
                                progress={progress}
                            />
                            <XAxisText
                                x={x(dataPoint.label)!}
                                y={canvasHeight}
                                text={dataPoint.label}
                            />
                        </Group>
                    ))
                }
                
            </Canvas>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});