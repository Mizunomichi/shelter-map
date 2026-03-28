"""
Utility functions for ShelterMap Edge Functions.

This module provides shared utility functions for capacity status computation
and other common operations used across Edge Functions.
"""

from typing import Literal

CapacityStatus = Literal['GREEN', 'YELLOW', 'RED']


def compute_capacity_status(current_occupancy: int, max_capacity: int) -> CapacityStatus:
    """
    Compute the capacity status of a shelter based on current occupancy and max capacity.
    
    The status is determined by the occupancy percentage:
    - GREEN: < 70% occupancy
    - YELLOW: >= 70% and < 90% occupancy
    - RED: >= 90% occupancy
    
    Args:
        current_occupancy: The current number of people in the shelter (non-negative integer)
        max_capacity: The maximum capacity of the shelter (non-negative integer)
    
    Returns:
        A CapacityStatus string: 'GREEN', 'YELLOW', or 'RED'
    
    Examples:
        >>> compute_capacity_status(0, 100)
        'GREEN'
        >>> compute_capacity_status(70, 100)
        'YELLOW'
        >>> compute_capacity_status(90, 100)
        'RED'
        >>> compute_capacity_status(0, 0)
        'GREEN'
    
    Validates Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
    """
    # Handle edge case where max_capacity is 0
    if max_capacity == 0:
        return 'GREEN'
    
    # Calculate occupancy percentage
    percent = (current_occupancy / max_capacity) * 100
    
    # Determine status based on thresholds
    if percent >= 90:
        return 'RED'
    elif percent >= 70:
        return 'YELLOW'
    else:
        return 'GREEN'
