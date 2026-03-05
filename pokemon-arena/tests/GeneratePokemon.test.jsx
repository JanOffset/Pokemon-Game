import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import GeneratePokemon from '../components/GeneratePokemon';

describe('GeneratePokemon Component', () => {
    it('показва бутона за генериране при начално зареждане', () => {
        render(<GeneratePokemon />);
        const button = screen.getByRole('button', { name: /generate pokemon/i });
        expect(button).toBeInTheDocument();
    });

    it('показва началните текстове за празна арена', () => {
        render(<GeneratePokemon />);
        expect(screen.getByText('Empty throne.')).toBeInTheDocument();
        expect(screen.getByText('Waiting for opponent...')).toBeInTheDocument();
    });
});