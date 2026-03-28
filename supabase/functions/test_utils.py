"""
Unit tests for ShelterMap utility functions.

Tests the compute_capacity_status function to ensure it correctly
calculates capacity status based on occupancy thresholds.
"""

import pytest
from utils import compute_capacity_status


class TestComputeCapacityStatus:
    """Test suite for compute_capacity_status function."""
    
    def test_zero_capacity_returns_green(self):
        """Test that zero max_capacity returns GREEN status."""
        # Requirement 2.1: WHEN max_capacity is 0, THE System SHALL return GREEN
        assert compute_capacity_status(0, 0) == 'GREEN'
    
    def test_less_than_70_percent_returns_green(self):
        """Test that occupancy < 70% returns GREEN status."""
        # Requirement 2.2: WHEN occupancy < 70%, THE System SHALL return GREEN
        assert compute_capacity_status(0, 100) == 'GREEN'
        assert compute_capacity_status(50, 100) == 'GREEN'
        assert compute_capacity_status(69, 100) == 'GREEN'
    
    def test_70_to_89_percent_returns_yellow(self):
        """Test that occupancy >= 70% and < 90% returns YELLOW status."""
        # Requirement 2.3: WHEN occupancy >= 70% and < 90%, THE System SHALL return YELLOW
        assert compute_capacity_status(70, 100) == 'YELLOW'
        assert compute_capacity_status(80, 100) == 'YELLOW'
        assert compute_capacity_status(89, 100) == 'YELLOW'
    
    def test_90_percent_or_more_returns_red(self):
        """Test that occupancy >= 90% returns RED status."""
        # Requirement 2.4: WHEN occupancy >= 90%, THE System SHALL return RED
        assert compute_capacity_status(90, 100) == 'RED'
        assert compute_capacity_status(95, 100) == 'RED'
        assert compute_capacity_status(100, 100) == 'RED'
    
    def test_boundary_conditions(self):
        """Test exact boundary values at 70% and 90% thresholds."""
        # Test 69.9% should be GREEN
        assert compute_capacity_status(69, 100) == 'GREEN'
        
        # Test exactly 70% should be YELLOW
        assert compute_capacity_status(70, 100) == 'YELLOW'
        
        # Test 89.9% should be YELLOW
        assert compute_capacity_status(89, 100) == 'YELLOW'
        
        # Test exactly 90% should be RED
        assert compute_capacity_status(90, 100) == 'RED'
    
    def test_always_returns_valid_status(self):
        """Test that function always returns a valid status value."""
        # Requirement 2.5: THE System SHALL never return null or undefined
        valid_statuses = {'GREEN', 'YELLOW', 'RED'}
        
        # Test various occupancy/capacity combinations
        test_cases = [
            (0, 100),
            (50, 100),
            (70, 100),
            (90, 100),
            (100, 100),
            (0, 0),
            (25, 50),
            (35, 50),
            (45, 50),
        ]
        
        for occupancy, capacity in test_cases:
            status = compute_capacity_status(occupancy, capacity)
            assert status in valid_statuses, f"Invalid status for ({occupancy}, {capacity}): {status}"
    
    def test_different_capacity_values(self):
        """Test with various max_capacity values."""
        # Test with capacity of 50
        assert compute_capacity_status(30, 50) == 'GREEN'  # 60%
        assert compute_capacity_status(35, 50) == 'YELLOW'  # 70%
        assert compute_capacity_status(45, 50) == 'RED'  # 90%
        
        # Test with capacity of 200
        assert compute_capacity_status(100, 200) == 'GREEN'  # 50%
        assert compute_capacity_status(140, 200) == 'YELLOW'  # 70%
        assert compute_capacity_status(180, 200) == 'RED'  # 90%
    
    def test_edge_case_small_capacities(self):
        """Test with very small capacity values."""
        # Capacity of 1
        assert compute_capacity_status(0, 1) == 'GREEN'  # 0%
        assert compute_capacity_status(1, 1) == 'RED'  # 100%
        
        # Capacity of 10
        assert compute_capacity_status(6, 10) == 'GREEN'  # 60%
        assert compute_capacity_status(7, 10) == 'YELLOW'  # 70%
        assert compute_capacity_status(9, 10) == 'RED'  # 90%


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
