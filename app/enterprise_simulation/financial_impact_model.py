class FinancialImpactModel:
    """
    Financial Impact Model: Computes cost savings, capital losses, implementation overruns, and ROI metrics.
    """
    def estimate_financials(self, proposed_saving_pct: float, rejections: int, base_value: float = 100000.0) -> dict:
        # Saving margins
        savings = (proposed_saving_pct / 100.0) * base_value
        # Losses based on historical rejection counts/delays
        losses = rejections * 12000.0
        net_value = savings - losses
        
        # Calculate trend index
        roi_trend = "Stable"
        if net_value > 30000:
            roi_trend = "Appreciating"
        elif net_value < 0:
            roi_trend = "Depreciating"

        return {
            "estimated_savings": round(savings, 2),
            "estimated_losses": round(losses, 2),
            "net_financial_value": round(net_value, 2),
            "roi_trend": roi_trend
        }
