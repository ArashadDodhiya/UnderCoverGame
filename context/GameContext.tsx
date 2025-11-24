"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'citizen' | 'undercover' | 'mr_white';

export interface Player {
    id: string;
    name: string;
    role: Role;
    word: string;
    isEliminated: boolean;
}

interface GameState {
    players: Player[];
    playerCount: number;
    undercoverCount: number;
    mrWhiteCount: number;
    currentTurnIndex: number;
    phase: 'setup' | 'reveal' | 'clue' | 'vote' | 'result' | 'winner';
    words: { citizen: string; undercover: string } | null;
    winner: 'citizen' | 'undercover' | 'mr_white' | null;
    lastEliminatedPlayer: Player | null;
}

interface GameContextType extends GameState {
    setPlayers: (names: string[], undercoverCount: number, mrWhiteCount: number) => void;
    startGame: (names: string[], undercoverCount: number, mrWhiteCount: number, words: { citizen: string; undercover: string }) => void;
    nextTurn: () => void;
    eliminatePlayer: (playerId: string) => void;
    resetGame: () => void;
    setPhase: (phase: GameState['phase']) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<GameState>({
        players: [],
        playerCount: 0,
        undercoverCount: 0,
        mrWhiteCount: 0,
        currentTurnIndex: 0,
        phase: 'setup',
        words: null,
        winner: null,
        lastEliminatedPlayer: null,
    });

    const setPlayers = (names: string[], undercoverCount: number, mrWhiteCount: number) => {
        const players: Player[] = names.map((name, index) => ({
            id: `player-${index}`,
            name,
            role: 'citizen', // Placeholder, assigned in startGame
            word: '',
            isEliminated: false,
        }));
        setState(prev => ({ ...prev, players, playerCount: names.length, undercoverCount, mrWhiteCount }));
    };

    const startGame = (names: string[], undercoverCount: number, mrWhiteCount: number, words: { citizen: string; undercover: string }) => {
        // Create initial players
        const initialPlayers: Player[] = names.map((name, index) => ({
            id: `player-${index}`,
            name,
            role: 'citizen', // Placeholder
            word: '',
            isEliminated: false,
        }));

        const newPlayers = [...initialPlayers];

        // Shuffle indices
        const indices = Array.from({ length: newPlayers.length }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        let uCount = undercoverCount;
        let wCount = mrWhiteCount;

        indices.forEach(index => {
            if (uCount > 0) {
                newPlayers[index].role = 'undercover';
                newPlayers[index].word = words.undercover;
                uCount--;
            } else if (wCount > 0) {
                newPlayers[index].role = 'mr_white';
                newPlayers[index].word = ''; // Mr White gets blank
                wCount--;
            } else {
                newPlayers[index].role = 'citizen';
                newPlayers[index].word = words.citizen;
            }
        });

        setState(prev => ({
            ...prev,
            players: newPlayers,
            playerCount: names.length,
            undercoverCount,
            mrWhiteCount,
            words,
            phase: 'reveal',
            currentTurnIndex: 0,
            lastEliminatedPlayer: null,
        }));
    };

    const nextTurn = () => {
        setState(prev => {
            let nextIndex = (prev.currentTurnIndex + 1) % prev.players.length;
            // Skip eliminated players
            while (prev.players[nextIndex].isEliminated) {
                nextIndex = (nextIndex + 1) % prev.players.length;
            }
            return { ...prev, currentTurnIndex: nextIndex };
        });
    };

    const eliminatePlayer = (playerId: string) => {
        setState(prev => {
            const newPlayers = prev.players.map(p =>
                p.id === playerId ? { ...p, isEliminated: true } : p
            );

            const eliminatedPlayer = newPlayers.find(p => p.id === playerId) || null;

            // Check win condition
            const activePlayers = newPlayers.filter(p => !p.isEliminated);
            const activeUndercovers = activePlayers.filter(p => p.role === 'undercover');
            const activeCitizens = activePlayers.filter(p => p.role === 'citizen');
            const activeMrWhite = activePlayers.filter(p => p.role === 'mr_white');

            let winner: GameState['winner'] = null;
            let phase: GameState['phase'] = 'result';

            const impostorCount = activeUndercovers.length + activeMrWhite.length;
            const citizenCount = activeCitizens.length;

            if (impostorCount === 0) {
                winner = 'citizen';
                phase = 'winner';
            } else if (impostorCount >= citizenCount) {
                winner = 'undercover';
                phase = 'winner';
            }

            return { ...prev, players: newPlayers, winner, phase, lastEliminatedPlayer: eliminatedPlayer };
        });
    };

    const resetGame = () => {
        setState({
            players: [],
            playerCount: 0,
            undercoverCount: 0,
            mrWhiteCount: 0,
            currentTurnIndex: 0,
            phase: 'setup',
            words: null,
            winner: null,
            lastEliminatedPlayer: null,
        });
    };

    const setPhase = (phase: GameState['phase']) => {
        setState(prev => ({ ...prev, phase }));
    };

    return (
        <GameContext.Provider value={{ ...state, setPlayers, startGame, nextTurn, eliminatePlayer, resetGame, setPhase }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}
