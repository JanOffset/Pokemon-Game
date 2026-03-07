import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import GeneratePokemon from '../components/GeneratePokemon';

describe('GeneratePokemon Component', () => {
    it('Checks the generate pokemon button if it appears on the document', () => {
        render(<GeneratePokemon />);
        const button = screen.getByRole('button', { name: /generate pokemon/i });
        expect(button).toBeInTheDocument();
    });

    it('Checks the entry texts below each box', () => {
        render(<GeneratePokemon />);
        expect(screen.getByText('Empty throne.')).toBeInTheDocument();
        expect(screen.getByText('Waiting for opponent...')).toBeInTheDocument();
    });
});