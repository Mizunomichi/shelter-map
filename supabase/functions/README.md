# ShelterMap Edge Functions Utilities

This directory contains Python utility functions used by Supabase Edge Functions for the ShelterMap application.

## Files

- **`utils.py`**: Core utility functions for capacity status computation
- **`test_utils.py`**: Unit tests for utility functions
- **`example_usage.py`**: Example usage demonstrations
- **`requirements.txt`**: Python dependencies

## Capacity Status Computation

The `compute_capacity_status()` function calculates the capacity status of a shelter based on current occupancy and maximum capacity.

### Function Signature

```python
def compute_capacity_status(current_occupancy: int, max_capacity: int) -> CapacityStatus
```

### Parameters

- `current_occupancy` (int): The current number of people in the shelter (non-negative)
- `max_capacity` (int): The maximum capacity of the shelter (non-negative)

### Returns

- `CapacityStatus`: One of `'GREEN'`, `'YELLOW'`, or `'RED'`

### Status Thresholds

| Status | Condition | Occupancy Percentage |
|--------|-----------|---------------------|
| GREEN  | Low occupancy | < 70% |
| YELLOW | Medium occupancy | >= 70% and < 90% |
| RED    | High occupancy | >= 90% |

### Edge Cases

- **Zero capacity**: When `max_capacity` is 0, the function returns `'GREEN'`
- **Boundary values**: 
  - Exactly 70% occupancy returns `'YELLOW'`
  - Exactly 90% occupancy returns `'RED'`

### Usage Example

```python
from utils import compute_capacity_status

# Low occupancy (50%)
status = compute_capacity_status(50, 100)
print(status)  # Output: 'GREEN'

# Medium occupancy (75%)
status = compute_capacity_status(75, 100)
print(status)  # Output: 'YELLOW'

# High occupancy (95%)
status = compute_capacity_status(95, 100)
print(status)  # Output: 'RED'

# Edge case: zero capacity
status = compute_capacity_status(0, 0)
print(status)  # Output: 'GREEN'
```

## Running Tests

To run the unit tests:

```bash
# Activate virtual environment
source venv/bin/activate  # On Unix/macOS
# or
.\venv\Scripts\Activate.ps1  # On Windows PowerShell

# Run tests
pytest test_utils.py -v
```

All tests should pass:
- `test_zero_capacity_returns_green`: Validates edge case handling
- `test_less_than_70_percent_returns_green`: Validates GREEN status
- `test_70_to_89_percent_returns_yellow`: Validates YELLOW status
- `test_90_percent_or_more_returns_red`: Validates RED status
- `test_boundary_conditions`: Validates exact threshold boundaries
- `test_always_returns_valid_status`: Validates return value is always valid
- `test_different_capacity_values`: Validates with various capacities
- `test_edge_case_small_capacities`: Validates with small capacity values

## Requirements Validation

This module validates the following requirements from the ShelterMap specification:

- **Requirement 2.1**: WHEN max_capacity is 0, THE System SHALL return GREEN
- **Requirement 2.2**: WHEN occupancy < 70%, THE System SHALL return GREEN
- **Requirement 2.3**: WHEN occupancy >= 70% and < 90%, THE System SHALL return YELLOW
- **Requirement 2.4**: WHEN occupancy >= 90%, THE System SHALL return RED
- **Requirement 2.5**: THE System SHALL never return null or undefined capacity status

## Integration with Edge Functions

This utility module is designed to be imported and used by Supabase Edge Functions written in TypeScript/Deno. The Edge Functions can call Python scripts as subprocesses or use a Python-to-TypeScript bridge.

Example integration in an Edge Function:

```typescript
// In update-shelter/index.ts
import { exec } from "https://deno.land/x/exec/mod.ts";

async function computeCapacityStatus(occupancy: number, capacity: number): Promise<string> {
  const result = await exec(`python -c "from utils import compute_capacity_status; print(compute_capacity_status(${occupancy}, ${capacity}))"`);
  return result.output.trim();
}
```

## Development Setup

1. Create virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate virtual environment:
   ```bash
   source venv/bin/activate  # Unix/macOS
   .\venv\Scripts\Activate.ps1  # Windows PowerShell
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run tests:
   ```bash
   pytest test_utils.py -v
   ```

5. Run example:
   ```bash
   python example_usage.py
   ```

## Dependencies

- **bcrypt**: For PIN hashing and verification
- **supabase**: Supabase Python client
- **python-dotenv**: Environment variable management
- **pytest**: Testing framework

See `requirements.txt` for specific versions.
