"""
Example usage of the compute_capacity_status utility function.

This script demonstrates how to use the capacity status computation
in various scenarios.
"""

from utils import compute_capacity_status


def main():
    """Demonstrate capacity status computation with various examples."""
    
    print("ShelterMap Capacity Status Examples")
    print("=" * 50)
    print()
    
    # Example 1: Low occupancy (GREEN)
    print("Example 1: Low occupancy shelter")
    occupancy, capacity = 50, 100
    status = compute_capacity_status(occupancy, capacity)
    print(f"  Occupancy: {occupancy}/{capacity} ({occupancy/capacity*100:.1f}%)")
    print(f"  Status: {status}")
    print()
    
    # Example 2: Medium occupancy (YELLOW)
    print("Example 2: Medium occupancy shelter")
    occupancy, capacity = 75, 100
    status = compute_capacity_status(occupancy, capacity)
    print(f"  Occupancy: {occupancy}/{capacity} ({occupancy/capacity*100:.1f}%)")
    print(f"  Status: {status}")
    print()
    
    # Example 3: High occupancy (RED)
    print("Example 3: High occupancy shelter")
    occupancy, capacity = 95, 100
    status = compute_capacity_status(occupancy, capacity)
    print(f"  Occupancy: {occupancy}/{capacity} ({occupancy/capacity*100:.1f}%)")
    print(f"  Status: {status}")
    print()
    
    # Example 4: Edge case - zero capacity
    print("Example 4: Zero capacity shelter (edge case)")
    occupancy, capacity = 0, 0
    status = compute_capacity_status(occupancy, capacity)
    print(f"  Occupancy: {occupancy}/{capacity}")
    print(f"  Status: {status}")
    print()
    
    # Example 5: Boundary at 70%
    print("Example 5: Exactly 70% occupancy (boundary)")
    occupancy, capacity = 70, 100
    status = compute_capacity_status(occupancy, capacity)
    print(f"  Occupancy: {occupancy}/{capacity} ({occupancy/capacity*100:.1f}%)")
    print(f"  Status: {status}")
    print()
    
    # Example 6: Boundary at 90%
    print("Example 6: Exactly 90% occupancy (boundary)")
    occupancy, capacity = 90, 100
    status = compute_capacity_status(occupancy, capacity)
    print(f"  Occupancy: {occupancy}/{capacity} ({occupancy/capacity*100:.1f}%)")
    print(f"  Status: {status}")
    print()
    
    # Example 7: Different capacity values
    print("Example 7: Small shelter at 80% capacity")
    occupancy, capacity = 40, 50
    status = compute_capacity_status(occupancy, capacity)
    print(f"  Occupancy: {occupancy}/{capacity} ({occupancy/capacity*100:.1f}%)")
    print(f"  Status: {status}")
    print()


if __name__ == '__main__':
    main()
