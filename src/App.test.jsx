import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App Component', () => {
  beforeEach(() => {
    render(<App />)
  })

  afterEach(() => {
    cleanup()
  })

  describe('Initial Rendering', () => {
    it('renders the main title', () => {
      expect(screen.getByText('Validation Demo — Two Sections')).toBeInTheDocument()
    })

    it('renders both sections', () => {
      expect(screen.getByText('Section 1')).toBeInTheDocument()
      expect(screen.getByText('Section 2')).toBeInTheDocument()
    })

    it('renders all form elements for both sections', () => {
      // Section 1 elements
      expect(screen.getByTestId('s1-film-input')).toBeInTheDocument()
      expect(screen.getByTestId('s1-text-field')).toBeInTheDocument()
      expect(screen.getByTestId('s1-checkbox')).toBeInTheDocument()
      expect(screen.getByTestId('s1-validate-btn')).toBeInTheDocument()
      expect(screen.getByTestId('s1-reset-btn')).toBeInTheDocument()

      // Section 2 elements
      expect(screen.getByTestId('s2-film-input')).toBeInTheDocument()
      expect(screen.getByTestId('s2-text-field')).toBeInTheDocument()
      expect(screen.getByTestId('s2-checkbox')).toBeInTheDocument()
      expect(screen.getByTestId('s2-validate-btn')).toBeInTheDocument()
      expect(screen.getByTestId('s2-reset-btn')).toBeInTheDocument()
    })

    it('shows initial state values', () => {
      expect(screen.getByText(/Section 1: checked=false — selected=none — text=""/)).toBeInTheDocument()
      expect(screen.getByText(/Section 2: checked=false — selected=none — text=""/)).toBeInTheDocument()
    })

    it('has unchecked checkboxes initially', () => {
      expect(screen.getByTestId('s1-checkbox').querySelector('input[type="checkbox"]')).not.toBeChecked()
      expect(screen.getByTestId('s2-checkbox').querySelector('input[type="checkbox"]')).not.toBeChecked()
    })

    it('has empty text fields initially', () => {
      expect(screen.getByTestId('s1-text-field').querySelector('input')).toHaveValue('')
      expect(screen.getByTestId('s2-text-field').querySelector('input')).toHaveValue('')
    })
  })

  describe('Text Field Functionality', () => {
    it('updates text field value when typing in section 1', async () => {
      const user = userEvent.setup()
      const textField = screen.getByTestId('s1-text-field').querySelector('input')
      
      await user.type(textField, 'Hello World')
      
      expect(textField).toHaveValue('Hello World')
      expect(screen.getByText(/Section 1: checked=false — selected=none — text="Hello World"/)).toBeInTheDocument()
    })

    it('updates text field value when typing in section 2', async () => {
      const user = userEvent.setup()
      const textField = screen.getByTestId('s2-text-field').querySelector('input')
      
      await user.type(textField, 'Test Text')
      
      expect(textField).toHaveValue('Test Text')
      expect(screen.getByText(/Section 2: checked=false — selected=none — text="Test Text"/)).toBeInTheDocument()
    })

    it('handles special characters in text field', async () => {
      const user = userEvent.setup()
      const textField = screen.getByTestId('s1-text-field').querySelector('input')
      
      await user.type(textField, 'Test@#$%')
      
      expect(textField).toHaveValue('Test@#$%')
    })

    it('handles empty spaces', async () => {
      const user = userEvent.setup()
      const textField = screen.getByTestId('s1-text-field').querySelector('input')
      
      await user.type(textField, '   ')
      
      expect(textField).toHaveValue('   ')
    })
  })

  describe('Checkbox Functionality', () => {
    it('toggles checkbox in section 1', async () => {
      const user = userEvent.setup()
      const checkbox = screen.getByTestId('s1-checkbox').querySelector('input[type="checkbox"]')
      
      await user.click(checkbox)
      
      expect(checkbox).toBeChecked()
      expect(screen.getByText(/Section 1: checked=true/)).toBeInTheDocument()
      
      await user.click(checkbox)
      
      expect(checkbox).not.toBeChecked()
      expect(screen.getByText(/Section 1: checked=false/)).toBeInTheDocument()
    })

    it('toggles checkbox in section 2', async () => {
      const user = userEvent.setup()
      const checkbox = screen.getByTestId('s2-checkbox').querySelector('input[type="checkbox"]')
      
      await user.click(checkbox)
      
      expect(checkbox).toBeChecked()
      expect(screen.getByText(/Section 2: checked=true/)).toBeInTheDocument()
    })

    it('updates checkbox label when checked/unchecked', async () => {
      const user = userEvent.setup()
      const checkbox = screen.getByTestId('s1-checkbox').querySelector('input[type="checkbox"]')
      const section1 = screen.getByTestId('s1-checkbox').closest('.MuiBox-root')
      
      // Initially unchecked - check within section 1 context
      expect(section1.querySelector('.MuiFormControlLabel-label')).toHaveTextContent('Unchecked')
      
      await user.click(checkbox)
      
      // Should show "Checked" when checked
      expect(section1.querySelector('.MuiFormControlLabel-label')).toHaveTextContent('Checked')
    })
  })

  describe('Autocomplete Dropdown Functionality', () => {
    it('opens dropdown when clicking on autocomplete arrow', async () => {
      const user = userEvent.setup()
      const dropdownButton = screen.getByTestId('s1-film-autocomplete').querySelector('[title="Open"]')
      
      await user.click(dropdownButton)
      
      // Should show film options
      await waitFor(() => {
        expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument()
        expect(screen.getByText('The Godfather')).toBeInTheDocument()
        expect(screen.getByText('The Dark Knight')).toBeInTheDocument()
      })
    })

    it('selects a film from dropdown in section 1', async () => {
      const user = userEvent.setup()
      const dropdownButton = screen.getByTestId('s1-film-autocomplete').querySelector('[title="Open"]')
      
      await user.click(dropdownButton)
      
      await waitFor(() => {
        expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument()
      })
      
      await user.click(screen.getByText('The Shawshank Redemption'))
      
      await waitFor(() => {
        expect(screen.getByText(/Section 1: checked=false — selected=The Shawshank Redemption/)).toBeInTheDocument()
      })
    })

    it('selects a film from dropdown in section 2', async () => {
      const user = userEvent.setup()
      const dropdownButton = screen.getByTestId('s2-film-autocomplete').querySelector('[title="Open"]')
      
      await user.click(dropdownButton)
      
      await waitFor(() => {
        expect(screen.getByText('The Dark Knight')).toBeInTheDocument()
      })
      
      await user.click(screen.getByText('The Dark Knight'))
      
      await waitFor(() => {
        expect(screen.getByText(/Section 2: checked=false — selected=The Dark Knight/)).toBeInTheDocument()
      })
    })

    it('filters films when typing in autocomplete', async () => {
      const user = userEvent.setup()
      const autocompleteInput = screen.getByTestId('s1-film-input').querySelector('input')
      
      await user.type(autocompleteInput, 'Dark')
      
      await waitFor(() => {
        expect(screen.getByText('The Dark Knight')).toBeInTheDocument()
        expect(screen.queryByText('The Shawshank Redemption')).not.toBeInTheDocument()
      })
    })
  })

  describe('Validation Functionality', () => {
    describe('Section 1 Validation', () => {
      it('shows error when validating empty form', async () => {
        const user = userEvent.setup()
        const validateBtn = screen.getByTestId('s1-validate-btn')
        
        await user.click(validateBtn)
        
        await waitFor(() => {
          const errorAlert = screen.getByTestId('s1-error-alert')
          expect(errorAlert).toBeInTheDocument()
          expect(errorAlert).toHaveTextContent('Please choose a film. Text field is required. You must check the box')
        })
      })

      it('shows error when film is missing', async () => {
        const user = userEvent.setup()
        
        // Fill text and check checkbox
        await user.type(screen.getByTestId('s1-text-field').querySelector('input'), 'Valid text')
        await user.click(screen.getByTestId('s1-checkbox').querySelector('input[type="checkbox"]'))
        
        await user.click(screen.getByTestId('s1-validate-btn'))
        
        await waitFor(() => {
          const errorAlert = screen.getByTestId('s1-error-alert')
          expect(errorAlert).toHaveTextContent('Please choose a film')
        })
      })

      it('shows error when text field is empty', async () => {
        const user = userEvent.setup()
        
        // Select film and check checkbox
        const dropdownButton = screen.getByTestId('s1-film-autocomplete').querySelector('[title="Open"]')
        await user.click(dropdownButton)
        await waitFor(() => screen.getByText('The Godfather'))
        await user.click(screen.getByText('The Godfather'))
        await user.click(screen.getByTestId('s1-checkbox').querySelector('input[type="checkbox"]'))
        
        await user.click(screen.getByTestId('s1-validate-btn'))
        
        await waitFor(() => {
          const errorAlert = screen.getByTestId('s1-error-alert')
          expect(errorAlert).toHaveTextContent('Text field is required')
        })
      })

      it('shows error when text field contains only spaces', async () => {
        const user = userEvent.setup()
        
        // Select film, add spaces to text, and check checkbox
        const dropdownButton = screen.getByTestId('s1-film-autocomplete').querySelector('[title="Open"]')
        await user.click(dropdownButton)
        await waitFor(() => screen.getByText('The Godfather'))
        await user.click(screen.getByText('The Godfather'))
        await user.type(screen.getByTestId('s1-text-field').querySelector('input'), '   ')
        await user.click(screen.getByTestId('s1-checkbox').querySelector('input[type="checkbox"]'))
        
        await user.click(screen.getByTestId('s1-validate-btn'))
        
        await waitFor(() => {
          const errorAlert = screen.getByTestId('s1-error-alert')
          expect(errorAlert).toHaveTextContent('Text field is required')
        })
      })

      it('shows error when checkbox is not checked', async () => {
        const user = userEvent.setup()
        
        // Select film and fill text
        const dropdownButton = screen.getByTestId('s1-film-autocomplete').querySelector('[title="Open"]')
        await user.click(dropdownButton)
        await waitFor(() => screen.getByText('The Godfather'))
        await user.click(screen.getByText('The Godfather'))
        await user.type(screen.getByTestId('s1-text-field').querySelector('input'), 'Valid text')
        
        await user.click(screen.getByTestId('s1-validate-btn'))
        
        await waitFor(() => {
          const errorAlert = screen.getByTestId('s1-error-alert')
          expect(errorAlert).toHaveTextContent('You must check the box')
        })
      })

      it('shows error when text contains invalid characters', async () => {
        const user = userEvent.setup()
        
        // Select film, add invalid text, and check checkbox
        const dropdownButton = screen.getByTestId('s1-film-autocomplete').querySelector('[title="Open"]')
        await user.click(dropdownButton)
        await waitFor(() => screen.getByText('The Godfather'))
        await user.click(screen.getByText('The Godfather'))
        await user.type(screen.getByTestId('s1-text-field').querySelector('input'), 'Invalid@#$%')
        await user.click(screen.getByTestId('s1-checkbox').querySelector('input[type="checkbox"]'))
        
        await user.click(screen.getByTestId('s1-validate-btn'))
        
        await waitFor(() => {
          const errorAlert = screen.getByTestId('s1-error-alert')
          expect(errorAlert).toHaveTextContent('Text contains invalid characters (only letters, numbers and spaces allowed)')
        })
      })

      it('shows success when all fields are valid', async () => {
        const user = userEvent.setup()
        
        // Fill all fields correctly
        const dropdownButton = screen.getByTestId('s1-film-autocomplete').querySelector('[title="Open"]')
        await user.click(dropdownButton)
        await waitFor(() => screen.getByText('The Godfather'))
        await user.click(screen.getByText('The Godfather'))
        await user.type(screen.getByTestId('s1-text-field').querySelector('input'), 'Valid text 123')
        await user.click(screen.getByTestId('s1-checkbox').querySelector('input[type="checkbox"]'))
        
        await user.click(screen.getByTestId('s1-validate-btn'))
        
        await waitFor(() => {
          const successAlert = screen.getByTestId('s1-success-alert')
          expect(successAlert).toBeInTheDocument()
          expect(successAlert).toHaveTextContent('Section 1 is valid')
          expect(screen.queryByTestId('s1-error-alert')).not.toBeInTheDocument()
        })
      })

      it('accepts text with letters, numbers, and spaces', async () => {
        const user = userEvent.setup()
        
        // Fill all fields correctly with mixed content
        const dropdownButton = screen.getByTestId('s1-film-autocomplete').querySelector('[title="Open"]')
        await user.click(dropdownButton)
        await waitFor(() => screen.getByText('The Godfather'))
        await user.click(screen.getByText('The Godfather'))
        await user.type(screen.getByTestId('s1-text-field').querySelector('input'), 'Test 123 ABC xyz')
        await user.click(screen.getByTestId('s1-checkbox').querySelector('input[type="checkbox"]'))
        
        await user.click(screen.getByTestId('s1-validate-btn'))
        
        await waitFor(() => {
          expect(screen.getByTestId('s1-success-alert')).toBeInTheDocument()
        })
      })
    })

    describe('Section 2 Validation', () => {
      it('shows error when validating empty form', async () => {
        const user = userEvent.setup()
        const validateBtn = screen.getByTestId('s2-validate-btn')
        
        await user.click(validateBtn)
        
        await waitFor(() => {
          const errorAlert = screen.getByTestId('s2-error-alert')
          expect(errorAlert).toBeInTheDocument()
          expect(errorAlert).toHaveTextContent('Please choose a film. Text field is required. You must check the box')
        })
      })

      it('shows success when all fields are valid', async () => {
        const user = userEvent.setup()
        
        // Fill all fields correctly
        const dropdownButton = screen.getByTestId('s2-film-autocomplete').querySelector('[title="Open"]')
        await user.click(dropdownButton)
        await waitFor(() => screen.getByText('12 Angry Men'))
        await user.click(screen.getByText('12 Angry Men'))
        await user.type(screen.getByTestId('s2-text-field').querySelector('input'), 'Another valid text')
        await user.click(screen.getByTestId('s2-checkbox').querySelector('input[type="checkbox"]'))
        
        await user.click(screen.getByTestId('s2-validate-btn'))
        
        await waitFor(() => {
          const successAlert = screen.getByTestId('s2-success-alert')
          expect(successAlert).toBeInTheDocument()
          expect(successAlert).toHaveTextContent('Section 2 is valid')
        })
      })
    })

    describe('Multiple Error Scenarios', () => {
      it('shows multiple errors separated by periods', async () => {
        const user = userEvent.setup()
        
        // Add invalid text only
        await user.type(screen.getByTestId('s1-text-field').querySelector('input'), 'Invalid@text!')
        
        await user.click(screen.getByTestId('s1-validate-btn'))
        
        await waitFor(() => {
          const errorAlert = screen.getByTestId('s1-error-alert')
          expect(errorAlert).toHaveTextContent('Please choose a film. Text contains invalid characters (only letters, numbers and spaces allowed). You must check the box')
        })
      })
    })
  })

  describe('Reset Functionality', () => {
    it('resets section 1 to initial state', async () => {
      const user = userEvent.setup()
      
      // Fill all fields
      const dropdownButton = screen.getByTestId('s1-film-autocomplete').querySelector('[title="Open"]')
      await user.click(dropdownButton)
      await waitFor(() => screen.getByText('The Godfather'))
      await user.click(screen.getByText('The Godfather'))
      await user.type(screen.getByTestId('s1-text-field').querySelector('input'), 'Some text')
      await user.click(screen.getByTestId('s1-checkbox').querySelector('input[type="checkbox"]'))
      
      // Validate to show success
      await user.click(screen.getByTestId('s1-validate-btn'))
      await waitFor(() => screen.getByTestId('s1-success-alert'))
      
      // Reset
      await user.click(screen.getByTestId('s1-reset-btn'))
      
      // Check all fields are reset
      expect(screen.getByTestId('s1-text-field').querySelector('input')).toHaveValue('')
      expect(screen.getByTestId('s1-checkbox').querySelector('input[type="checkbox"]')).not.toBeChecked()
      expect(screen.queryByTestId('s1-success-alert')).not.toBeInTheDocument()
      expect(screen.queryByTestId('s1-error-alert')).not.toBeInTheDocument()
      expect(screen.getByText(/Section 1: checked=false — selected=none — text=""/)).toBeInTheDocument()
    })

    it('resets section 2 to initial state', async () => {
      const user = userEvent.setup()
      
      // Fill all fields
      const dropdownButton = screen.getByTestId('s2-film-autocomplete').querySelector('[title="Open"]')
      await user.click(dropdownButton)
      await waitFor(() => screen.getByText('The Dark Knight'))
      await user.click(screen.getByText('The Dark Knight'))
      await user.type(screen.getByTestId('s2-text-field').querySelector('input'), 'Test text')
      await user.click(screen.getByTestId('s2-checkbox').querySelector('input[type="checkbox"]'))
      
      // Reset
      await user.click(screen.getByTestId('s2-reset-btn'))
      
      // Check all fields are reset
      expect(screen.getByTestId('s2-text-field').querySelector('input')).toHaveValue('')
      expect(screen.getByTestId('s2-checkbox').querySelector('input[type="checkbox"]')).not.toBeChecked()
      expect(screen.getByText(/Section 2: checked=false — selected=none — text=""/)).toBeInTheDocument()
    })

    it('resets errors after showing validation errors', async () => {
      const user = userEvent.setup()
      
      // Trigger validation error
      await user.click(screen.getByTestId('s1-validate-btn'))
      await waitFor(() => screen.getByTestId('s1-error-alert'))
      
      // Reset
      await user.click(screen.getByTestId('s1-reset-btn'))
      
      // Error should be gone
      expect(screen.queryByTestId('s1-error-alert')).not.toBeInTheDocument()
    })

    it('does not affect other section when resetting', async () => {
      const user = userEvent.setup()
      
      // Fill both sections
      await user.type(screen.getByTestId('s1-text-field').querySelector('input'), 'Section 1 text')
      await user.type(screen.getByTestId('s2-text-field').querySelector('input'), 'Section 2 text')
      
      // Reset only section 1
      await user.click(screen.getByTestId('s1-reset-btn'))
      
      // Section 1 should be reset, section 2 should remain
      expect(screen.getByTestId('s1-text-field').querySelector('input')).toHaveValue('')
      expect(screen.getByTestId('s2-text-field').querySelector('input')).toHaveValue('Section 2 text')
    })
  })

    describe('Independent Section Behavior', () => {
      it('validates sections independently', async () => {
        const user = userEvent.setup()
        
        // Make section 1 valid
        const dropdownButton = screen.getByTestId('s1-film-autocomplete').querySelector('[title="Open"]')
        await user.click(dropdownButton)
        await waitFor(() => screen.getByText('The Godfather'))
        await user.click(screen.getByText('The Godfather'))
        await user.type(screen.getByTestId('s1-text-field').querySelector('input'), 'Valid text')
        await user.click(screen.getByTestId('s1-checkbox').querySelector('input[type="checkbox"]'))
        
        // Leave section 2 invalid and validate both
        await user.click(screen.getByTestId('s1-validate-btn'))
        await user.click(screen.getByTestId('s2-validate-btn'))
        
        await waitFor(() => {
          expect(screen.getByTestId('s1-success-alert')).toBeInTheDocument()
          expect(screen.getByTestId('s2-error-alert')).toBeInTheDocument()
        })
      })

    it('maintains separate state for each section', async () => {
      const user = userEvent.setup()
      
      // Set different values for each section
      await user.type(screen.getByTestId('s1-text-field').querySelector('input'), 'Section 1')
      await user.type(screen.getByTestId('s2-text-field').querySelector('input'), 'Section 2')
      await user.click(screen.getByTestId('s1-checkbox').querySelector('input[type="checkbox"]'))
      
      // Check state display
      expect(screen.getByText(/Section 1: checked=true — selected=none — text="Section 1"/)).toBeInTheDocument()
      expect(screen.getByText(/Section 2: checked=false — selected=none — text="Section 2"/)).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles rapid clicking on validate button', async () => {
      const user = userEvent.setup()
      const validateBtn = screen.getByTestId('s1-validate-btn')
      
      // Click multiple times rapidly
      await user.click(validateBtn)
      await user.click(validateBtn)
      await user.click(validateBtn)
      
      // Should still show error (not crash)
      await waitFor(() => {
        expect(screen.getByTestId('s1-error-alert')).toBeInTheDocument()
      })
    })

    it('handles text field with only numbers', async () => {
      const user = userEvent.setup()
      
      const dropdownButton = screen.getByTestId('s1-film-autocomplete').querySelector('[title="Open"]')
      await user.click(dropdownButton)
      await waitFor(() => screen.getByText('The Godfather'))
      await user.click(screen.getByText('The Godfather'))
      await user.type(screen.getByTestId('s1-text-field').querySelector('input'), '12345')
      await user.click(screen.getByTestId('s1-checkbox').querySelector('input[type="checkbox"]'))
      
      await user.click(screen.getByTestId('s1-validate-btn'))
      
      await waitFor(() => {
        expect(screen.getByTestId('s1-success-alert')).toBeInTheDocument()
      })
    })

    it('handles text field with only letters', async () => {
      const user = userEvent.setup()
      
      const dropdownButton = screen.getByTestId('s1-film-autocomplete').querySelector('[title="Open"]')
      await user.click(dropdownButton)
      await waitFor(() => screen.getByText('The Godfather'))
      await user.click(screen.getByText('The Godfather'))
      await user.type(screen.getByTestId('s1-text-field').querySelector('input'), 'OnlyLetters')
      await user.click(screen.getByTestId('s1-checkbox').querySelector('input[type="checkbox"]'))
      
      await user.click(screen.getByTestId('s1-validate-btn'))
      
      await waitFor(() => {
        expect(screen.getByTestId('s1-success-alert')).toBeInTheDocument()
      })
    })

    it('clears previous validation state when new validation occurs', async () => {
      const user = userEvent.setup()
      
      // First validation - should show error
      await user.click(screen.getByTestId('s1-validate-btn'))
      await waitFor(() => screen.getByTestId('s1-error-alert'))
      
      // Fill form correctly
      const dropdownButton = screen.getByTestId('s1-film-autocomplete').querySelector('[title="Open"]')
      await user.click(dropdownButton)
      await waitFor(() => screen.getByText('The Godfather'))
      await user.click(screen.getByText('The Godfather'))
      await user.type(screen.getByTestId('s1-text-field').querySelector('input'), 'Valid text')
      await user.click(screen.getByTestId('s1-checkbox').querySelector('input[type="checkbox"]'))
      
      // Second validation - should show success and clear error
      await user.click(screen.getByTestId('s1-validate-btn'))
      
      await waitFor(() => {
        expect(screen.getByTestId('s1-success-alert')).toBeInTheDocument()
        expect(screen.queryByTestId('s1-error-alert')).not.toBeInTheDocument()
      })
    })
  })
})
