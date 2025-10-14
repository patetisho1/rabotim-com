import { render, screen } from '@testing-library/react'
import Header from '@/components/Header'

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: null, loading: false, signOut: vi.fn() }) }))

describe('Header', () => {
  it('renders logo and nav buttons', () => {
    render(<Header />)
    expect(screen.getByText('Rabotim.com')).toBeInTheDocument()
    expect(screen.getAllByText('Пусни обява')[0]).toBeInTheDocument()
    expect(screen.getByText('Как работи')).toBeInTheDocument()
  })
})
