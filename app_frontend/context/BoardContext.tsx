import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Board } from "@/types/models";

interface BoardContextProps {
    selectedBoard: Board | null;
    selectBoard: (board: Board) => Promise<void>;
    clearSelectedBoard: () => Promise<void>;
}

const BoardContext = createContext<BoardContextProps>({
    selectedBoard: null,
    selectBoard: async () => {},
    clearSelectedBoard: async () => {}
});

export const useBoard = () => {
    return useContext(BoardContext);
}

export const BoardProvider = ({ children }: { children: React.ReactNode } ) => {
    const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

    const selectBoard = async (board: Board) => {
        try {
            await AsyncStorage.setItem('selectedBoard', JSON.stringify(board));
            setSelectedBoard(board);
        } catch (error) {
            console.error('Error saving board: ', error);
        }
    };

    const clearSelectedBoard = async () => {
        try {
            await AsyncStorage.removeItem('selectedBoard');
            setSelectedBoard(null);
        } catch (error) {
            console.error('Error clearing board:', error);
        }
    };

    useEffect(() => {
        const loadSavedBoard = async () => {
            try {
                const savedBoard = await AsyncStorage.getItem('selectedBoard');
                if (savedBoard) {
                    setSelectedBoard(JSON.parse(savedBoard));
                }
            } catch (error) {
                console.error('Error loading saved board:', error);
            }
        };
        
        loadSavedBoard();
    }, []);

    const value = {
        selectedBoard,
        selectBoard,
        clearSelectedBoard
    };
    return (
        <BoardContext.Provider value={value as BoardContextProps}>
            {children} 
        </BoardContext.Provider>
    );
}