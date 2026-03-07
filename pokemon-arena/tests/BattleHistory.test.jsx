import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BattleHistory from '../components/BattleHistory'; 

describe('BattleHistory Component', () => {
    const mockHistory = [
        { id: 1, name: 'bulbasaur', sprite: 'img1.png' },
        { id: 4, name: 'charmander', sprite: 'img2.png' }
    ];

    it('Checks for the label History:', () => {
        render(<BattleHistory history={mockHistory} />);
        expect(screen.getByText(/History:/i)).toBeInTheDocument();
    });

    it('Checks the amount of loaded sprites in the history tab', () => {
        render(<BattleHistory history={mockHistory} />);
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(2);
    });

    it('Checks if there is nothing if history is empty', () => {
        const { container } = render(<BattleHistory history={[]} />);
        expect(container.firstChild).toBeNull();
    });
});