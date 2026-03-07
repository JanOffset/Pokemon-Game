import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Scoreboard from '../components/Scoreboard'; 

describe('Scoreboard Component', () => {
    it('Check if the scoreboard show the results correctly', () => {
        render(<Scoreboard typeMatches={2} previousWins={1} newWins={5} />);
        
        expect(screen.getByText(/Type Matches: 2/i)).toBeInTheDocument();
        expect(screen.getByText(/Previous Wins: 1/i)).toBeInTheDocument();
        expect(screen.getByText(/New Wins: 5/i)).toBeInTheDocument();
    });
});