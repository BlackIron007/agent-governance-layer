class OperationalImpactModel:
    """
    Operational Impact Model: Estimates delivery delays, SLA degradation, and resource impact.
    """
    def estimate_operations(self, delay_probability: float, resource_overhead_pct: float, base_sla_days: int = 14) -> dict:
        # Calculate expected delivery delays
        delay_days = round(delay_probability * 15.0, 1)
        
        # Determine SLA degradation level
        sla_degradation = "None"
        if delay_days > 5.0:
            sla_degradation = "Severe"
        elif delay_days > 2.0:
            sla_degradation = "Moderate"
            
        # Resource capacity strain calculation
        resource_impact = "Optimal"
        if resource_overhead_pct > 30.0:
            resource_impact = "Overallocated"
        elif resource_overhead_pct > 10.0:
            resource_impact = "Managed Overhead"
            
        total_cycle_time = base_sla_days + delay_days

        return {
            "estimated_delay_days": delay_days,
            "sla_degradation_level": sla_degradation,
            "resource_impact_status": resource_impact,
            "projected_cycle_time_days": round(total_cycle_time, 1)
        }
