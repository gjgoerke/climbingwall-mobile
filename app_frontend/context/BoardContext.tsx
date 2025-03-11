import { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Board, LedConfig } from "@/types/models";

interface BoardContextProps {
    selectedBoard: Board | null;
    boardLedConfig: LedConfig | null;
    selectBoard: (board: Board, ledConfigData: LedConfig) => Promise<void>;
    clearSelectedBoard: () => Promise<void>;
}

const BoardContext = createContext<BoardContextProps>({
    selectedBoard: null,
    boardLedConfig: null,
    selectBoard: async () => {},
    clearSelectedBoard: async () => {}
});

export const useBoard = () => {
    return useContext(BoardContext);
}

export const BoardProvider = ({ children }: { children: React.ReactNode } ) => {
    const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
    const [boardLedConfig, setBoardLedConfig] = useState<LedConfig | null>(null);

    const selectBoard = useCallback(async (board: Board, ledConfigData: LedConfig ) => {
        try {
            await AsyncStorage.setItem('selectedBoard', JSON.stringify(board));
            await AsyncStorage.setItem('boardLedConfig', JSON.stringify(ledConfigData))
            setSelectedBoard(board);
            setBoardLedConfig(ledConfigData);
        } catch (error) {
            console.error('Error saving board: ', error);
        }
    }, []); 

    const clearSelectedBoard = useCallback(async () => {
        try {
            await AsyncStorage.removeItem('selectedBoard');
            await AsyncStorage.removeItem('boardLedConfig');
            setSelectedBoard(null);
        } catch (error) {
            console.error('Error clearing board:', error);
        }
    }, []);

    useEffect(() => {
        console.log('loadSavedBoard')
        const loadSavedBoard = async () => {
            try {
                const savedBoard = await AsyncStorage.getItem('selectedBoard');
                const savedConfigData = await AsyncStorage.getItem('boardLedConfig');
                if (savedBoard && savedConfigData) {
                    setSelectedBoard(JSON.parse(savedBoard));
                    setBoardLedConfig(JSON.parse(savedConfigData));
                }
            } catch (error) {
                console.error('Error loading saved board:', error);
            }
        };
        
        loadSavedBoard();
    }, []);

    const value = {
        selectedBoard,
        boardLedConfig,
        selectBoard,
        clearSelectedBoard
    };
    return (
        <BoardContext.Provider value={value as BoardContextProps}>
            {children} 
        </BoardContext.Provider>
    );
}