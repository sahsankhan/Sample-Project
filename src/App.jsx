import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Button,
  Stack,
  Alert,
  Divider
} from '@mui/material'

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 }
]

const top100seasons = [
  { title: 'Wednesday', year: 1994 },
  { title: 'Stranger Things', year: 1972 },
  { title: 'Squid Game', year: 2008 },
  { title: 'The Witcher', year: 1957 },
  { title: "Daredevil", year: 1993 }
]

const initialState = { checked: false, value: null, text: '' }

export default function App() {
  const [s1, setS1] = useState(initialState)
  const [s2, setS2] = useState(initialState)
  const [errors, setErrors] = useState({ s1: null, s2: null })
  const [success, setSuccess] = useState({ s1: false, s2: false })

  function validateSection(which) {
    const sec = which === 's1' ? s1 : s2
    const problems = []
    if (!sec.value) problems.push(which === 's1' ? 'Please choose a film' : 'Please choose a Season')
    if (!sec.text || !sec.text.trim()) problems.push('Review field is required')
    // Disallow special characters: only letters, numbers and spaces allowed
    const allowedRegex = /^[A-Za-z0-9\s]+$/
    if (sec.text && !allowedRegex.test(sec.text)) problems.push('Text contains invalid characters (only letters, numbers and spaces allowed)')
    if (!sec.checked) problems.push('You must check the box')

    if (problems.length) {
      setErrors((p) => ({ ...p, [which]: problems.join('. ') }))
      setSuccess((p) => ({ ...p, [which]: false }))
    } else {
      setErrors((p) => ({ ...p, [which]: null }))
      setSuccess((p) => ({ ...p, [which]: true }))
    }
  }

  function resetSection(which) {
    if (which === 's1') setS1({ ...initialState })
    else setS2({ ...initialState })
    setErrors((p) => ({ ...p, [which]: null }))
    setSuccess((p) => ({ ...p, [which]: false }))
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mainteny — QA Demo
      </Typography>

      {/* Section 1 */}
      <Box sx={{ mb: 4, p: 3, background: '#fff', borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>
          Film Review 
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Autocomplete
            data-testid="s1-film-autocomplete"
            value={s1.value}
            onChange={(event, newValue) => setS1((p) => ({ ...p, value: newValue }))}
            options={top100Films}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => <TextField {...params} label="Choose a film" data-testid="s1-film-input" />}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            data-testid="s1-text-field"
            label="Write your review"
            variant="outlined"
            fullWidth
            value={s1.text}
            onChange={(e) => setS1((p) => ({ ...p, text: e.target.value }))}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={<Checkbox data-testid="s1-checkbox" checked={s1.checked} onChange={(e) => setS1((p) => ({ ...p, checked: e.target.checked }))} />}
            label={s1.checked ? 'Terms and Conditions (accepted)' : 'Terms and Conditions (not accepted)'}
          />
        </Box>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button data-testid="s1-validate-btn" variant="contained" onClick={() => validateSection('s1')}>
            Submit
          </Button>
          <Button data-testid="s1-reset-btn" variant="outlined" onClick={() => resetSection('s1')}>
            Reset
          </Button>
        </Stack>

        {errors.s1 && (
          <Alert data-testid="s1-error-alert" severity="error" sx={{ mt: 1 }}>
            {errors.s1}
          </Alert>
        )}

        {success.s1 && (
          <Alert data-testid="s1-success-alert" severity="success" sx={{ mt: 1 }}>
            Film Review is valid
          </Alert>
        )}
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Section 2 */}
      <Box sx={{ mb: 4, p: 3, background: '#fff', borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>
          Season Review
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Autocomplete
            data-testid="s2-film-autocomplete"
            value={s2.value}
            onChange={(event, newValue) => setS2((p) => ({ ...p, value: newValue }))}
            options={top100seasons}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => <TextField {...params} label="Choose a Season" data-testid="s2-film-input" />}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            data-testid="s2-text-field"
            label="Write your review"
            variant="outlined"
            fullWidth
            value={s2.text}
            onChange={(e) => setS2((p) => ({ ...p, text: e.target.value }))}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={<Checkbox data-testid="s2-checkbox" checked={s2.checked} onChange={(e) => setS2((p) => ({ ...p, checked: e.target.checked }))} />}
            label={s2.checked ? 'Terms and Conditions (accepted)' : 'Terms and Conditions (not accepted)'}
          />
        </Box>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button data-testid="s2-validate-btn" variant="contained" onClick={() => validateSection('s2')}>
            Submit
          </Button>
          <Button data-testid="s2-reset-btn" variant="outlined" onClick={() => resetSection('s2')}>
            Reset
          </Button>
        </Stack>

        {errors.s2 && (
          <Alert data-testid="s2-error-alert" severity="error" sx={{ mt: 1 }}>
            {errors.s2}
          </Alert>
        )}

        {success.s2 && (
          <Alert data-testid="s2-success-alert" severity="success" sx={{ mt: 1 }}>
            Season Review is valid
          </Alert>
        )}
      </Box>

      
    </Container>
  )
}
