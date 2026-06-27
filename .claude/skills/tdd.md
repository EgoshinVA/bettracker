# @tdd — Test-Driven Development

Always: RED → GREEN → REFACTOR

## Frontend — write test FIRST
```tsx
// features/add-bet/ui/AddBetModal.test.tsx
describe('AddBetModal', () => {
  it('renders all required fields', () => {
    render(<AddBetModal isOpen onClose={jest.fn()} />)
    expect(screen.getByLabelText(/sport/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/odds/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/stake/i)).toBeInTheDocument()
  })

  it('shows validation error when odds is empty on submit', async () => {
    render(<AddBetModal isOpen onClose={jest.fn()} />)
    await userEvent.click(screen.getByText(/confirm bet/i))
    expect(screen.getByText(/odds is required/i)).toBeInTheDocument()
  })
})
```

## Backend — write test FIRST
```ts
describe('BetsService.createBet', () => {
  it('should create and return a bet', async () => {
    const dto: CreateBetDto = { sport: 'Football', odds: 1.85, stake: 100, betType: 'moneyline' }
    const result = await service.createBet(userId, dto)
    expect(result).toMatchObject({ sport: 'Football', odds: 1.85 })
    expect(result.id).toBeDefined()
  })

  it('should throw BadRequestException if odds < 1', async () => {
    const dto = { sport: 'Football', odds: 0.5, stake: 100, betType: 'moneyline' }
    await expect(service.createBet(userId, dto)).rejects.toThrow(BadRequestException)
  })
})
```

## Naming convention
- `it('should <action> when <condition>')`
- Group with `describe('<ClassName>')`
- One clear assertion per test
