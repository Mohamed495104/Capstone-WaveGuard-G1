// donation-details/page.jsx 
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Divider,
  Chip,
  Alert,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Favorite,
  CheckCircle,
  ArrowBack,
  Lock,
  Shield,
  Verified,
  Download,
  CheckCircleOutline
} from '@mui/icons-material';
import { styles } from './donationDetails.styles';

// Charity configuration constants
const CHARITY_CONFIG = {
  registrationNumber: '123456789 RR0001',
  businessNumber: '123456789',
  name: 'MarineCare',
  directImpactPercentage: 87
};

const DonationDetailsPage = () => {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState('50');
  const [donationType, setDonationType] = useState('monthly');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paypal'); 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [receiveUpdates, setReceiveUpdates] = useState(true);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  //  PayPal-related state
  const [showPaypalDialog, setShowPaypalDialog] = useState(false);
  const paypalContainerRef = React.useRef(null);
  const [paypalSdkLoaded, setPaypalSdkLoaded] = useState(false);

  const donationAmounts = [
    {
      amount: '$25',
      value: '25',
      title: 'Ocean Protector',
      subtitle: 'Support our mission',
      benefits: [
        'Collaborate with 4 cleanups',
        'Remove ~50 waste items',
        'Quarterly impact reports'
      ],
      color: '#00bcd4'
    },
    {
      amount: '$50',
      value: '50',
      title: 'Shoreline Guardian',
      subtitle: 'Make a real difference',
      benefits: [
        'Equip 10 volunteers with supplies',
        'Remove ~500 waste items',
        'Monthly impact updates'
      ],
      color: '#00bfa5',
      popular: true
    },
    {
      amount: '$100',
      value: '100',
      title: 'Coast Champion',
      subtitle: 'Lead the change',
      benefits: [
        'Equip 20 volunteers',
        'Remove ~1,000 waste items',
        'Weekly impact dashboard access'
      ],
      color: '#00bfa5'
    },
    {
      amount: '$250',
      value: '250',
      title: 'Marine Defender',
      subtitle: 'Champion our cause',
      benefits: [
        'Sponsor entire cleanup event',
        'Remove ~2,500 waste items',
        'Full volunteer tracking'
      ],
      color: '#00bfa5'
    }
  ];

  const getSelectedAmountValue = () => {
    return customAmount || selectedAmount;
  };

  const calculateYearly = () => {
    const amount = parseFloat(getSelectedAmountValue());
    return donationType === 'monthly' ? (amount * 12).toFixed(0) : amount.toFixed(0);
  };

  // Generate transaction ID using crypto for better uniqueness
  const generateTransactionId = () => {
    const randomPart = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID().replace(/-/g, '').substring(0, 12).toUpperCase()
      : Date.now().toString(36) + Math.random().toString(36).substring(2, 11).toUpperCase();
    return 'WG' + randomPart;
  };

  // Generate PDF Receipt with jsPDF - Enhanced Design
  const generatePDFReceipt = async () => {
    const { jsPDF } = await import('jspdf');
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let y = 20;

    // Brand Colors
    const brandColor = [0, 191, 165];
    const lightBrand = [240, 253, 249];
    const darkGray = [26, 26, 26];
    const mediumGray = [102, 102, 102];
    const lightGray = [230, 230, 230];
    const accentBlue = [0, 188, 212];

    // === HEADER SECTION ===
    // Header gradient background (simulated with layered rectangles)
    doc.setFillColor(brandColor[0], brandColor[1], brandColor[2]);
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    doc.setFillColor(0, 171, 145);
    doc.rect(0, 50, pageWidth, 10, 'F');

    // Add MarineCare Logo (optional - continues without logo if unavailable)
    const logoImg = '/images/1.png';
    try {
      doc.addImage(logoImg, 'PNG', pageWidth / 2 - 12, 10, 24, 24);
    } catch (error) {
      // Logo is optional - PDF generation continues without it
      console.warn('PDF logo not available, generating receipt without logo');
    }
    
    // Brand name
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'bold');
    doc.text('MarineCare', pageWidth / 2, 42, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('Ocean Conservation Through Community Action', pageWidth / 2, 48, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('OFFICIAL DONATION RECEIPT', pageWidth / 2, 56, { align: 'center' });

    y = 60;

    // === THANK YOU SECTION ===
    doc.setFillColor(lightBrand[0], lightBrand[1], lightBrand[2]);
    doc.setFillColor(lightBrand[0], lightBrand[1], lightBrand[2]);
    doc.roundedRect(margin, y, pageWidth - 2 * margin, 18, 3, 3, 'F');
    
    doc.setDrawColor(brandColor[0], brandColor[1], brandColor[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, pageWidth - 2 * margin, 18, 3, 3, 'S');
    
    doc.setFontSize(12);
    doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
    doc.setFont(undefined, 'bold');
    doc.text('Thank you for your generous support!', pageWidth / 2, y + 11, { align: 'center' });

    y += 28;

    // === TRANSACTION DETAILS BOX ===
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(margin, y, pageWidth - 2 * margin, 38, 3, 3, 'F');
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, pageWidth - 2 * margin, 38, 3, 3, 'S');
    
    y += 10;
    
    // Receipt details in two columns
    const col1X = margin + 5;
    const col2X = pageWidth / 2 + 5;
    
    doc.setFontSize(10);
    doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
    doc.setFont(undefined, 'normal');
    
    // Left column
    doc.text('Receipt Number:', col1X, y);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont(undefined, 'bold');
    doc.text(transactionId, col1X, y + 6);
    
    // Right column
    doc.setFont(undefined, 'normal');
    doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
    doc.text('Date Issued:', col2X, y);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont(undefined, 'bold');
    doc.text(new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }), col2X, y + 6);
    
    y += 14;
    
    // Payment method
    doc.setFont(undefined, 'normal');
    doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
    doc.text('Payment Method:', col1X, y);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont(undefined, 'bold');
    doc.text('PayPal', col1X, y + 6);

    y += 20;

    // === DONOR INFORMATION ===
    doc.setFontSize(12);
    doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
    doc.setFont(undefined, 'bold');
    doc.text('DONOR INFORMATION', margin, y);
    
    y += 2;
    doc.setDrawColor(brandColor[0], brandColor[1], brandColor[2]);
    doc.setLineWidth(1);
    doc.line(margin, y, margin + 48, y);
    
    y += 10;
    doc.setFontSize(11);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont(undefined, 'bold');
    doc.text(`${firstName} ${lastName}`, margin, y);
    
    y += 7;
    doc.setFont(undefined, 'normal');
    doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
    doc.text(`Email: ${email}`, margin, y);

    y += 18;

    // === DONATION AMOUNT HIGHLIGHT BOX ===
    doc.setFillColor(brandColor[0], brandColor[1], brandColor[2]);
    doc.roundedRect(margin, y, pageWidth - 2 * margin, 42, 3, 3, 'F');
    
    // Decorative accent line
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, y, 4, 42, 'F');
    
    y += 12;
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'normal');
    doc.text('DONATION AMOUNT', pageWidth / 2, y, { align: 'center' });
    
    y += 13;
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.text(`$${getSelectedAmountValue()}.00 CAD`, pageWidth / 2, y, { align: 'center' });
    
    y += 9;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`${donationType === 'monthly' ? 'Monthly Recurring' : 'One-Time'} Donation`, pageWidth / 2, y, { align: 'center' });
    
    if (donationType === 'monthly') {
      y += 6;
      doc.setFontSize(9);
      doc.text(`Estimated annual impact: $${calculateYearly()}.00 CAD`, pageWidth / 2, y, { align: 'center' });
    }

    y += 18;

    // === YOUR IMPACT SECTION ===
    doc.setFontSize(12);
    doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
    doc.setFont(undefined, 'bold');
    doc.text('YOUR IMPACT', margin, y);
    
    y += 2;
    doc.setDrawColor(brandColor[0], brandColor[1], brandColor[2]);
    doc.setLineWidth(1);
    doc.line(margin, y, margin + 32, y);
    
    y += 10;
    
    const impactItems = [
      `Equips ${donationType === 'monthly' ? '10' : '5'} volunteers with cleanup supplies`,
      `Removes approximately ${donationType === 'monthly' ? '500' : '50'} waste items from shorelines`,
      `Supports ${donationType === 'monthly' ? '25' : '10'} AI-powered waste classifications`,
      `Prevents approximately ${donationType === 'monthly' ? '33' : '10'} kg of CO2 emissions`
    ];
    
    doc.setFontSize(9);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont(undefined, 'normal');
    
    impactItems.forEach(item => {
      // Bullet point
      doc.setFillColor(brandColor[0], brandColor[1], brandColor[2]);
      doc.circle(margin + 2, y - 1.5, 1, 'F');
      
      doc.text(item, margin + 7, y);
      y += 7;
    });

    y += 8;

    // === TAX INFORMATION BOX ===
    doc.setFillColor(255, 248, 225);
    doc.roundedRect(margin, y, pageWidth - 2 * margin, 28, 3, 3, 'F');
    doc.setDrawColor(255, 193, 7);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, pageWidth - 2 * margin, 28, 3, 3, 'S');
    
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont(undefined, 'bold');
    doc.text('TAX RECEIPT INFORMATION', margin + 5, y);
    
    y += 6;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
    doc.text('This is an official receipt for income tax purposes.', margin + 5, y);
    
    y += 4;
    doc.text(`Charity Registration Number: ${CHARITY_CONFIG.registrationNumber}`, margin + 5, y);
    
    y += 4;
    doc.text(`Business Number: ${CHARITY_CONFIG.businessNumber}`, margin + 5, y);
    
    y += 5;
    doc.setFont(undefined, 'italic');
    doc.setFontSize(7.5);
    doc.text(`${CHARITY_CONFIG.directImpactPercentage}% of your donation directly supports ocean cleanup initiatives`, margin + 5, y);

    // === FOOTER ===
    y = pageHeight - 25;
    
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    
    y += 5;
    doc.setFontSize(9);
    doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
    doc.setFont(undefined, 'bold');
    doc.text('MarineCare', pageWidth / 2, y, { align: 'center' });
    
    y += 4;
    doc.setFontSize(7.5);
    doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
    doc.setFont(undefined, 'normal');
    doc.text('Protecting oceans through community action and AI technology', pageWidth / 2, y, { align: 'center' });
    
    y += 4;
    doc.setFontSize(7);
    doc.text('donations@marinecare.org  |  Phone: 1-800-MARINE-CARE', pageWidth / 2, y, { align: 'center' });
    
    y += 3.5;
    doc.setFontSize(6.5);
    doc.text(`Copyright ${new Date().getFullYear()} MarineCare. All rights reserved.  |  www.MarineCare.org`, pageWidth / 2, y, { align: 'center' });

    // Save PDF
    doc.save(`MarineCare_Receipt_${transactionId}.pdf`);
  };

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    // Common validations
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const amount = parseFloat(getSelectedAmountValue());
    if (!amount || amount < 5) {
      newErrors.amount = 'Minimum donation is $5';
    }

    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Utility: dynamically load PayPal SDK
  const loadPayPalSdk = (clientId) => {
    return new Promise((resolve, reject) => {
      if (window.paypal) {
        setPaypalSdkLoaded(true);
        return resolve(window.paypal);
      }
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=CAD`;
      script.async = true;
      script.onload = () => {
        setPaypalSdkLoaded(true);
        resolve(window.paypal);
      };
      script.onerror = (err) => reject(err);
      document.body.appendChild(script);
    });
  };

  // PayPal flow: open dialog and render buttons
  const handlePayPalCheckout = async () => {
    if (validateForm()) {
      setIsProcessing(true);
      // Open the PayPal dialog - SDK loading & rendering handled in useEffect below
      setShowPaypalDialog(true);
    }
  };

  // Render PayPal buttons when dialog opens
  React.useEffect(() => {
    if (!showPaypalDialog) return;

    // PayPal Client ID from environment variable
    const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    
    if (!CLIENT_ID) {
      console.error('PayPal Client ID not configured');
      setErrors({ ...errors, paypal: 'Payment service not configured. Please try again later.' });
      setShowPaypalDialog(false);
      setIsProcessing(false);
      return;
    }

    let paypalButtons;
    let isMounted = true;

    loadPayPalSdk(CLIENT_ID).then((paypal) => {
      if (!isMounted || !paypalContainerRef.current) return;
      
      if (paypalContainerRef.current) {
        paypalContainerRef.current.innerHTML = '';
      }

      paypalButtons = paypal.Buttons({
        style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'donate' },
        createOrder: function(data, actions) {
          const amount = parseFloat(getSelectedAmountValue()).toFixed(2);
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount,
                currency_code: 'CAD'
              },
              description: `MarineCare Donation (${donationType === 'monthly' ? 'monthly' : 'one-time'})`
            }],
            application_context: {
              brand_name: 'MarineCare',
              landing_page: 'NO_PREFERENCE'
            }
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            if (!isMounted) return;
            const txId = details.id || (details.purchase_units && details.purchase_units[0].payments && details.purchase_units[0].payments.captures && details.purchase_units[0].payments.captures[0].id) || generateTransactionId();
            setTransactionId(txId);
            setShowPaypalDialog(false);
            setShowSuccessDialog(true);
            setIsProcessing(false);
          });
        },
        onError: function(err) {
          console.error('PayPal Buttons error', err);
          if (!isMounted) return;
          setErrors({ ...errors, paypal: 'PayPal payment failed. Please try again.' });
          setShowPaypalDialog(false);
          setIsProcessing(false);
        },
        onCancel: function(data) {
          if (!isMounted) return;
          setShowPaypalDialog(false);
          setIsProcessing(false);
        }
      });

      if (paypalContainerRef.current && isMounted) {
        paypalButtons.render(paypalContainerRef.current).catch((err) => {
          console.error('PayPal render error', err);
          if (isMounted) {
            setErrors({ ...errors, paypal: 'Unable to load PayPal. Try again later.' });
            setShowPaypalDialog(false);
            setIsProcessing(false);
          }
        });
      }
    }).catch((err) => {
      console.error('Failed to load PayPal SDK', err);
      if (isMounted) {
        setErrors({ ...errors, paypal: 'Unable to load PayPal. Try again later.' });
        setShowPaypalDialog(false);
        setIsProcessing(false);
      }
    });

    return () => {
      isMounted = false;
      if (paypalButtons) {
        try {
          if (typeof paypalButtons.close === 'function') {
            paypalButtons.close();
          }
        } catch (e) {
          console.log('PayPal cleanup - buttons already closed');
        }
      }
    };
    
  }, [showPaypalDialog]);

  const handleSubmit = () => {
    handlePayPalCheckout();
  };

  const handleCloseDialog = () => {
    setShowSuccessDialog(false);
    // Reset all form fields
    resetForm();
  };

  // Reset form function
  const resetForm = () => {
    setSelectedAmount('50');
    setDonationType('monthly');
    setCustomAmount('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setAgreeTerms(false);
    setReceiveUpdates(true);
    setErrors({});
    setIsProcessing(false);
    setTransactionId('');
  };

  const handleBackToDonation = () => {
    router.push('/donation');
  };

  return (
    <Box sx={styles.pageWrapper}>
      <Container maxWidth="xl" sx={styles.container}>
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start' }}>
          {/* Left Column - Donation Form */}
          <Box sx={{ flex: { xs: '1', md: '0 0 62%' }, width: '100%' }}>
            {/* Back Button */}
            <Button 
              startIcon={<ArrowBack />} 
              sx={styles.backButton}
              onClick={handleBackToDonation}
            >
              Back to Donation Info
            </Button>

            {/* Page Header */}
            <Box sx={styles.pageHeader}>
              <Box sx={styles.headerIcon}>
                <Favorite sx={styles.headerIconSvg} />
              </Box>
              <Box>
                <Typography variant="h5" sx={styles.pageTitle}>
                  Complete Your Donation
                </Typography>
                <Typography variant="body2" sx={styles.pageSubtitle}>
                  Choose your plan and payment method
                </Typography>
              </Box>
            </Box>

            <Box sx={styles.securityChips}>
              <Chip 
                icon={<Lock sx={{ fontSize: 14 }} />} 
                label="Secure checkout" 
                size="small" 
                sx={styles.securityChip} 
              />
              <Chip 
                icon={<Shield sx={{ fontSize: 14 }} />} 
                label="SSL encrypted" 
                size="small" 
                sx={styles.securityChip} 
              />
              <Chip 
                icon={<Verified sx={{ fontSize: 14 }} />} 
                label="PCI compliant" 
                size="small" 
                sx={styles.securityChip} 
              />
            </Box>

            {errors.terms && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errors.terms}
              </Alert>
            )}

            {errors.amount && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errors.amount}
              </Alert>
            )}

            {errors.paypal && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errors.paypal}
              </Alert>
            )}

            <Box sx={styles.formSection}>
              {/* Donation Type Selection */}
              <Typography variant="subtitle2" sx={styles.sectionTitle}>
                Select Donation Type
              </Typography>
              <Box sx={styles.donationTypeContainer}>
                <Card
                  sx={{
                    ...styles.donationTypeCard,
                    border: donationType === 'one-time' ? '2px solid #00bfa5' : '1px solid #e0e0e0',
                    bgcolor: donationType === 'one-time' ? '#f0fdf9' : 'white'
                  }}
                  onClick={() => setDonationType('one-time')}
                >
                  <Box sx={styles.donationTypeIcon}>
                    <Favorite sx={{ fontSize: 28, color: '#00bfa5' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={styles.radioTitle}>
                      One-Time Donation
                    </Typography>
                    <Typography variant="caption" sx={styles.radioSubtitle}>
                      Make an immediate impact today
                    </Typography>
                  </Box>
                </Card>
                <Card
                  sx={{
                    ...styles.donationTypeCard,
                    border: donationType === 'monthly' ? '2px solid #00bfa5' : '1px solid #e0e0e0',
                    bgcolor: donationType === 'monthly' ? '#f0fdf9' : 'white',
                    position: 'relative'
                  }}
                  onClick={() => setDonationType('monthly')}
                >
                  <Chip 
                    label="Recommended" 
                    size="small" 
                    sx={styles.recommendedChip} 
                  />
                  <Box sx={styles.donationTypeIcon}>
                    <Box sx={{ fontSize: 28 }}>📈</Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={styles.radioTitle}>
                      Monthly Donation
                    </Typography>
                    <Typography variant="caption" sx={styles.radioSubtitle}>
                      Sustain our mission long-term
                    </Typography>
                  </Box>
                </Card>
              </Box>

              {/* Amount Selection */}
              <Typography variant="subtitle2" sx={styles.sectionTitle}>
                Choose Your Impact Level
              </Typography>
              <Grid container spacing={2} sx={styles.amountGrid}>
                {donationAmounts.map((item) => (
                  <Grid item xs={12} sm={6} key={item.value}>
                    <Card
                      sx={{
                        ...styles.amountCard,
                        border: selectedAmount === item.value ? `2px solid ${item.color}` : '1px solid #e0e0e0',
                        bgcolor: selectedAmount === item.value ? '#f0fdf9' : 'white',
                        position: 'relative'
                      }}
                      onClick={() => {
                        setSelectedAmount(item.value);
                        setCustomAmount('');
                        setErrors({ ...errors, amount: '' });
                      }}
                    >
                      {item.popular && (
                        <Chip 
                          label="Most Popular" 
                          size="small" 
                          sx={styles.popularChip} 
                        />
                      )}
                      <Box sx={{ ...styles.amountIcon, bgcolor: `${item.color}15` }}>
                        <Box sx={{ fontSize: 24 }}>💙</Box>
                      </Box>
                      <Typography variant="h5" sx={{ ...styles.amountValue, color: item.color }}>
                        {item.amount}
                        <Typography component="span" sx={styles.amountPeriod}>
                          /{donationType === 'monthly' ? 'mo' : 'one-time'}
                        </Typography>
                      </Typography>
                      <Typography variant="body2" sx={styles.amountTitle}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" sx={styles.amountSubtitle}>
                        {item.subtitle}
                      </Typography>
                      <Box sx={styles.benefitsList}>
                        {item.benefits.map((benefit, idx) => (
                          <Box key={idx} sx={styles.benefitItemBox}>
                            <CheckCircle sx={styles.benefitIcon} />
                            <Typography variant="caption" sx={styles.benefitItem}>
                              {benefit}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Custom Amount */}
              <Card sx={styles.customAmountCard}>
                <Typography variant="body2" sx={styles.customAmountTitle}>
                  Or enter a custom amount
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, '');
                    setCustomAmount(value);
                    if (value) {
                      setSelectedAmount('');
                      setErrors({ ...errors, amount: '' });
                    }
                  }}
                  size="small"
                  sx={styles.customInput}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1, color: '#666' }}>$</Typography>
                  }}
                  error={!!errors.amount}
                />
                <Typography variant="caption" sx={styles.minimumText}>
                  Minimum donation: $5
                </Typography>
                
                {(customAmount || selectedAmount) && donationType === 'monthly' && (
                  <Box sx={styles.impactBox}>
                    <CheckCircle sx={styles.impactCheckIcon} />
                    <Box>
                      <Typography variant="body2" sx={styles.impactTitle}>
                        Your ${getSelectedAmountValue()} monthly donation will:
                      </Typography>
                      <Box component="ul" sx={styles.impactList}>
                        <Typography component="li" variant="caption" sx={styles.impactListItem}>
                          Equip 10 volunteers with cleanup supplies
                        </Typography>
                        <Typography component="li" variant="caption" sx={styles.impactListItem}>
                          Remove approximately 500 waste items from shores
                        </Typography>
                        <Typography component="li" variant="caption" sx={styles.impactListItem}>
                          Support 25 AI-powered classifications
                        </Typography>
                        <Typography component="li" variant="caption" sx={styles.impactListItem}>
                          Prevent ~33 kg of CO₂ emissions
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Card>

              {/* Payment Information */}
              <Typography variant="subtitle2" sx={styles.sectionTitle}>
                Payment Information
              </Typography>

              <Box sx={styles.paymentMethodBox}>
                <Alert severity="info" icon={<Box component="span">🅿️</Box>} sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Secure PayPal Checkout
                  </Typography>
                  <Typography variant="caption">
                    Your donation will be processed securely through PayPal. You can use your PayPal balance, bank account, or credit/debit card.
                  </Typography>
                </Alert>
              </Box>

              {/* Common Fields */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name *"
                    placeholder="John"
                    size="small"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setErrors({ ...errors, firstName: '' });
                    }}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    sx={styles.textField}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name *"
                    placeholder="Doe"
                    size="small"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setErrors({ ...errors, lastName: '' });
                    }}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    sx={styles.textField}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Email Address *"
                placeholder="john@example.com"
                size="small"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: '' });
                }}
                error={!!errors.email}
                helperText={errors.email || "Tax receipt will be sent here"}
                sx={styles.textField}
              />

              <Box sx={styles.checkboxContainer}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      size="small" 
                      checked={agreeTerms}
                      onChange={(e) => {
                        setAgreeTerms(e.target.checked);
                        setErrors({ ...errors, terms: '' });
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={styles.checkboxLabel}>
                      I agree to the Terms of Service and Privacy Policy. I understand my PayPal account will be charged {donationType === 'monthly' ? 'monthly' : 'once'} and I can cancel anytime.
                    </Typography>
                  }
                />
              </Box>

              <FormControlLabel
                control={
                  <Checkbox 
                    checked={receiveUpdates}
                    onChange={(e) => setReceiveUpdates(e.target.checked)}
                    size="small" 
                  />
                }
                label={
                  <Typography variant="body2" sx={styles.checkboxLabel}>
                    Send me impact updates, cleanup event notifications, and quarterly reports.
                  </Typography>
                }
                sx={{ mb: 3 }}
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={styles.submitButton}
                startIcon={<Box component="span">{paymentMethod === 'paypal' ? '🅿️' : '💰'}</Box>}
                onClick={handleSubmit}
                disabled={isProcessing}
              >
                {isProcessing 
                  ? 'Processing...' 
                  : paymentMethod === 'paypal' 
                    ? `Proceed to PayPal - ${getSelectedAmountValue()}`
                    : `Donate ${getSelectedAmountValue()} ${donationType === 'monthly' ? 'Monthly' : 'Now'}`
                }
              </Button>

              <Box sx={styles.securityFooter}>
                <Typography variant="caption" sx={styles.securityText}>
                  🔒 256-bit SSL
                </Typography>
                <Typography variant="caption" sx={styles.securityText}>
                  • PCI Compliant
                </Typography>
                <Typography variant="caption" sx={styles.securityText}>
                  • Secure Payment
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Column - Summary Card - Desktop Only */}
          <Box sx={{ flex: { xs: '1', md: '0 0 35%' }, width: '100%', display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ position: { md: 'sticky' }, top: 24 }}>
              <Card sx={styles.summaryCard}>
                <Typography variant="h6" sx={styles.summaryTitle}>
                  Donation Summary
                </Typography>

                <Box sx={styles.summaryRow}>
                  <Typography variant="body2" sx={styles.summaryLabel}>
                    Type
                  </Typography>
                  <Typography variant="body2" sx={styles.summaryValue}>
                    {donationType === 'monthly' ? 'Monthly' : 'One-Time'}
                  </Typography>
                </Box>

                <Box sx={styles.summaryRow}>
                  <Typography variant="body2" sx={styles.summaryLabel}>
                    Amount
                  </Typography>
                  <Typography variant="h6" sx={styles.summaryAmount}>
                    ${getSelectedAmountValue()}.00
                  </Typography>
                </Box>

                <Box sx={styles.yearlyBox}>
                  <Typography variant="h6" sx={styles.yearlyAmount}>
                    ${calculateYearly()}/year
                  </Typography>
                </Box>

                <Divider sx={styles.summaryDivider} />

                <Box sx={styles.summaryBenefit}>
                  <CheckCircle sx={styles.summaryBenefitIcon} />
                  <Typography variant="caption" sx={styles.summaryBenefitText}>
                    Tax receipt issued automatically
                  </Typography>
                </Box>

                <Box sx={styles.summaryBenefit}>
                  <CheckCircle sx={styles.summaryBenefitIcon} />
                  <Typography variant="caption" sx={styles.summaryBenefitText}>
                    Secure encrypted payment
                  </Typography>
                </Box>

                <Box sx={styles.summaryBenefit}>
                  <CheckCircle sx={styles.summaryBenefitIcon} />
                  <Typography variant="caption" sx={styles.summaryBenefitText}>
                    Cancel anytime
                  </Typography>
                </Box>

                <Divider sx={styles.summaryDivider} />

                <Typography variant="subtitle2" sx={styles.impactSectionTitle}>
                  Why Your Support Matters
                </Typography>

                <Box sx={styles.matterItem}>
                  <CheckCircle sx={styles.matterIcon} />
                  <Typography variant="caption" sx={styles.matterText}>
                    87% goes directly to cleanup initiatives
                  </Typography>
                </Box>

                <Box sx={styles.matterItem}>
                  <CheckCircle sx={styles.matterIcon} />
                  <Typography variant="caption" sx={styles.matterText}>
                    Registered Canadian charity (CRA)
                  </Typography>
                </Box>

                <Box sx={styles.matterItem}>
                  <CheckCircle sx={styles.matterIcon} />
                  <Typography variant="caption" sx={styles.matterText}>
                    Real-time impact tracking
                  </Typography>
                </Box>

                <Box sx={styles.matterItem}>
                  <CheckCircle sx={styles.matterIcon} />
                  <Typography variant="caption" sx={styles.matterText}>
                    Annual transparency reports
                  </Typography>
                </Box>

                <Divider sx={styles.summaryDivider} />

                <Box sx={styles.iconRow}>
                  <Box sx={styles.iconItem}>
                    <Shield sx={styles.iconItemSvg} />
                    <Typography variant="caption" sx={styles.iconLabel}>
                      Secure
                    </Typography>
                  </Box>
                  <Box sx={styles.iconItem}>
                    <Lock sx={styles.iconItemSvg} />
                    <Typography variant="caption" sx={styles.iconLabel}>
                      Encrypted
                    </Typography>
                  </Box>
                  <Box sx={styles.iconItem}>
                    <Verified sx={styles.iconItemSvg} />
                    <Typography variant="caption" sx={styles.iconLabel}>
                      Verified
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* PayPal Dialog (renders PayPal buttons inside) */}
      <Dialog
        open={showPaypalDialog}
        onClose={() => setShowPaypalDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Complete Payment with PayPal</Typography>
          <Box ref={paypalContainerRef} id="paypal-button-container" sx={{ minHeight: 80 }} />
          <Typography variant="caption" display="block" sx={{ mt: 2, color: '#666' }}>
            You will be redirected to PayPal to complete the donation of ${getSelectedAmountValue()} CAD.
          </Typography>
          <Button onClick={() => setShowPaypalDialog(false)} sx={{ mt: 2 }} variant="outlined">Cancel</Button>
        </Box>
      </Dialog>

      {/* Success Dialog with PDF Download */}
      <Dialog 
        open={showSuccessDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ textAlign: 'center', pt: 4, px: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CheckCircleOutline sx={{ fontSize: 80, color: '#00bfa5' }} />
          </Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 3 }}>
            Thank You for Your Donation!
          </Typography>
        </Box>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography variant="body1" sx={{ mb: 2, color: '#666' }}>
            Your generous contribution of <strong>${getSelectedAmountValue()}</strong> will help protect our oceans and coastlines.
          </Typography>
          
          <Box sx={{ bgcolor: '#f0fdf9', p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#1a1a1a' }}>
              Transaction Details
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
              Transaction ID: <strong>{transactionId}</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
              Type: <strong>{donationType === 'monthly' ? 'Monthly Recurring' : 'One-Time'}</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Date: <strong>{new Date().toLocaleDateString('en-CA')}</strong>
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
            A tax receipt has been sent to <strong>{email}</strong>
          </Typography>

          <Box sx={{ 
            bgcolor: '#fff3e0', 
            p: 2, 
            borderRadius: 2, 
            border: '1px solid #ff9800',
            mb: 3 
          }}>
            <Typography variant="body2" sx={{ color: '#e65100', fontWeight: 600 }}>
              🌊 Your Impact
            </Typography>
            <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 1 }}>
              Your donation will help remove approximately {donationType === 'monthly' ? '500' : '50'} waste items from our shores and equip volunteers with necessary cleanup supplies.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={generatePDFReceipt}
            fullWidth
            sx={{
              bgcolor: '#00bfa5',
              color: 'white',
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              mb: 2,
              '&:hover': {
                bgcolor: '#00a591'
              }
            }}
          >
            Download Receipt PDF
          </Button>

          <Typography variant="caption" sx={{ color: '#999', display: 'block' }}>
            {CHARITY_CONFIG.name} is a registered Canadian charity
            <br />
            Registration #: {CHARITY_CONFIG.registrationNumber}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: '#00bfa5',
              color: '#00bfa5',
              px: 4,
              '&:hover': {
                borderColor: '#00a591',
                bgcolor: '#f0fdf9'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DonationDetailsPage;