// donation-details/donationDetails.styles.js
export const styles = {
  pageWrapper: {
    bgcolor: "#f8f9fb",
    minHeight: "100vh",
    py: 4,
  },

  container: {
    maxWidth: "1200px",
  },

  backButton: {
    textTransform: "none",
    color: "#666",
    mb: 3,
    "&:hover": {
      bgcolor: "transparent",
    },
  },

  pageHeader: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    mb: 2,
  },

  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: "12px",
    bgcolor: "#e0f7f4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  headerIconSvg: {
    fontSize: 32,
    color: "#00bfa5",
  },

  pageTitle: {
    fontWeight: 700,
    color: "#1a1a1a",
  },

  pageSubtitle: {
    color: "#666",
    mt: 0.5,
  },

  securityChips: {
    display: "flex",
    gap: 1,
    mb: 4,
  },

  securityChip: {
    fontSize: "12px",
    height: 24,
    bgcolor: "white",
    border: "1px solid #e0e0e0",
  },

  formSection: {
    bgcolor: "white",
    borderRadius: "12px",
    p: 3,
  },

  sectionTitle: {
    fontWeight: 600,
    fontSize: "14px",
    mb: 2,
    color: "#1a1a1a",
  },

  donationTypeContainer: {
    display: "flex",
    gap: 2,
    mb: 4,
  },

  donationTypeCard: {
    flex: 1,
    p: 2.5,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 2,
    borderRadius: "12px",
    transition: "all 0.2s",
    "&:hover": {
      boxShadow: "0 4px 12px rgba(0,191,165,0.1)",
    },
  },

  donationTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: "8px",
    bgcolor: "#f0fdf9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  radioTitle: {
    fontWeight: 600,
    fontSize: "15px",
    color: "#1a1a1a",
  },

  radioSubtitle: {
    color: "#666",
    fontSize: "13px",
    mt: 0.5,
  },

  recommendedChip: {
    position: "absolute",
    top: 8,
    right: 8,
    bgcolor: "#00bfa5",
    color: "white",
    fontSize: "11px",
    height: 20,
  },

  amountGrid: {
    mb: 3,
  },

  amountCard: {
    p: 2.5,
    cursor: "pointer",
    borderRadius: "12px",
    transition: "all 0.2s",
    "&:hover": {
      boxShadow: "0 4px 12px rgba(0,191,165,0.1)",
    },
  },

  amountIcon: {
    width: 40,
    height: 40,
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mb: 1.5,
  },

  popularChip: {
    position: "absolute",
    top: 8,
    right: 8,
    bgcolor: "#00bfa5",
    color: "white",
    fontSize: "11px",
    height: 20,
  },

  amountValue: {
    fontWeight: 700,
    fontSize: "28px",
    mb: 0.5,
  },

  amountPeriod: {
    fontSize: "16px",
    fontWeight: 400,
    color: "#666",
  },

  amountTitle: {
    fontWeight: 600,
    fontSize: "15px",
    color: "#1a1a1a",
    mb: 0.5,
  },

  amountSubtitle: {
    color: "#666",
    fontSize: "12px",
    display: "block",
    mb: 1.5,
  },

  benefitsList: {
    mt: 1.5,
  },

  benefitItemBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: 0.8,
    mb: 0.8,
  },

  benefitIcon: {
    fontSize: 14,
    color: "#00bfa5",
    mt: 0.2,
  },

  benefitItem: {
    color: "#666",
    fontSize: "12px",
    lineHeight: 1.4,
  },

  customAmountCard: {
    p: 2.5,
    bgcolor: "#f8f9fb",
    borderRadius: "12px",
    mb: 4,
    border: "1px solid #e0e0e0",
  },

  customAmountTitle: {
    fontWeight: 600,
    fontSize: "14px",
    mb: 1.5,
    color: "#1a1a1a",
  },

  customInput: {
    bgcolor: "white",
    mb: 1,
  },

  minimumText: {
    color: "#999",
    fontSize: "12px",
  },

  impactBox: {
    mt: 2,
    p: 2,
    bgcolor: "#f0fdf9",
    borderRadius: "8px",
    display: "flex",
    gap: 1.5,
  },

  impactCheckIcon: {
    fontSize: 20,
    color: "#00bfa5",
    mt: 0.3,
  },

  impactTitle: {
    fontWeight: 600,
    fontSize: "13px",
    color: "#1a1a1a",
    mb: 1,
  },

  impactList: {
    m: 0,
    pl: 2,
  },

  impactListItem: {
    color: "#666",
    fontSize: "12px",
    mb: 0.5,
  },

  paymentMethodBox: {
    mb: 2,
  },

  paymentLabel: {
    fontWeight: 600,
    fontSize: "14px",
    mb: 1.5,
    color: "#1a1a1a",
  },

  paymentButtons: {
    display: "flex",
    gap: 2,
    mb: 3,
  },

  paymentButton: {
    flex: 1,
    textTransform: "none",
    borderRadius: "8px",
    py: 1.2,
    borderColor: "#e0e0e0",
    color: "#666",
  },

  paymentButtonActive: {
    bgcolor: "#00bfa5",
    color: "white",
    borderColor: "#00bfa5",
    "&:hover": {
      bgcolor: "#00a591",
      borderColor: "#00a591",
    },
  },

  textField: {
    mb: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
    },
  },

  checkboxContainer: {
    p: 2,
    bgcolor: "#f8f9fb",
    borderRadius: "8px",
    mb: 2,
  },

  checkboxLabel: {
    fontSize: "13px",
    color: "#666",
  },

  submitButton: {
    bgcolor: "#00bfa5",
    textTransform: "none",
    py: 1.8,
    fontSize: "16px",
    fontWeight: 600,
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,191,165,0.3)",
    "&:hover": {
      bgcolor: "#00a591",
      boxShadow: "0 6px 16px rgba(0,191,165,0.4)",
    },
  },

  securityFooter: {
    display: "flex",
    justifyContent: "center",
    gap: 2,
    mt: 2,
    pt: 2,
    borderTop: "1px solid #e0e0e0",
  },

  securityText: {
    color: "#999",
    fontSize: "12px",
  },

  // Right Column - Summary Card
  summaryCard: {
    p: 3,
    bgcolor: "white",
    borderRadius: "12px",
    position: "sticky",
    top: 20,
  },

  summaryTitle: {
    fontWeight: 700,
    fontSize: "18px",
    color: "#1a1a1a",
    mb: 3,
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 1.5,
  },

  summaryLabel: {
    color: "#666",
    fontSize: "14px",
  },

  summaryValue: {
    fontWeight: 600,
    color: "#1a1a1a",
    fontSize: "14px",
  },

  summaryAmount: {
    fontWeight: 700,
    color: "#00bfa5",
    fontSize: "24px",
  },

  yearlyBox: {
    bgcolor: "#f0fdf9",
    p: 2,
    borderRadius: "8px",
    textAlign: "center",
    my: 2,
  },

  yearlyAmount: {
    fontWeight: 700,
    color: "#00bfa5",
    fontSize: "20px",
  },

  summaryDivider: {
    my: 2.5,
  },

  summaryBenefit: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 1.5,
  },

  summaryBenefitIcon: {
    fontSize: 16,
    color: "#00bfa5",
  },

  summaryBenefitText: {
    color: "#666",
    fontSize: "13px",
  },

  impactSectionTitle: {
    fontWeight: 600,
    fontSize: "14px",
    color: "#1a1a1a",
    mb: 2,
  },

  matterItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 1,
    mb: 1.5,
  },

  matterIcon: {
    fontSize: 16,
    color: "#00bfa5",
    mt: 0.2,
  },

  matterText: {
    color: "#666",
    fontSize: "12px",
    lineHeight: 1.5,
  },

  iconRow: {
    display: "flex",
    justifyContent: "space-around",
    pt: 1,
  },

  iconItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 0.5,
  },

  iconItemSvg: {
    fontSize: 28,
    color: "#00bfa5",
  },

  iconLabel: {
    color: "#666",
    fontSize: "11px",
  },
};
