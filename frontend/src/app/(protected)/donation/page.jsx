// donation/page.jsx

"use client";

// donation/page.jsx
import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  Grid,
  LinearProgress,
  Avatar,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  VolunteerActivism,
  Security,
  InfoOutlined,
  Pets,
  ExpandMore
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { styles } from './donation.styles';

const DonationPage = () => {
  const router = useRouter();

  const handleDonateClick = () => {
    router.push('/donation-details');
  };

  return (
    <Box sx={styles.pageWrapper}>
      <Container maxWidth="lg" sx={styles.container}>
        {/* Hero Section */}
        <Box sx={styles.heroSection}>
          <Typography variant="h2" sx={styles.heroTitle}>
            Together, We Protect<br />Canada's Coastlines
          </Typography>
          <Typography variant="body1" sx={styles.heroDescription}>
            Your donation powers AI-driven coastal cleanup, beach restoration projects, 
            and helps protect marine life by preventing harmful pollutants. Every contribution 
            creates a cleaner future, turning dreams into reality for generations.
          </Typography>
          <Box sx={styles.heroCTA}>
            <Button 
              variant="contained" 
              sx={styles.primaryButton}
              onClick={handleDonateClick}
            >
              Donate Now
            </Button>
            <Button 
              variant="outlined" 
              sx={styles.secondaryButton}
            >
              Learn More
            </Button>
          </Box>
        </Box>

        {/* Stats Section */}
        <Grid container spacing={3} sx={styles.statsSection} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={styles.statCard} elevation={0}>
              <Typography variant="h3" sx={styles.statNumber}>
                850,000+
              </Typography>
              <Typography variant="body2" sx={styles.statLabel}>
                TOTAL IMPACT SINCE 2018
              </Typography>
              <Typography variant="caption" sx={styles.statSubtext}>
                Increase of 820 in 2023
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={styles.statCard} elevation={0}>
              <Typography variant="h3" sx={styles.statNumber}>
                $2.4M
              </Typography>
              <Typography variant="body2" sx={styles.statLabel}>
                DONATIONS RAISED
              </Typography>
              <Typography variant="caption" sx={styles.statSubtext}>
                Last 30 days
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={styles.statCard} elevation={0}>
              <Typography variant="h3" sx={styles.statNumber}>
                156
              </Typography>
              <Typography variant="body2" sx={styles.statLabel}>
                ACTIVE ORGANIZATIONS
              </Typography>
              <Typography variant="caption" sx={styles.statSubtext}>
                375 total since inception
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={styles.statCard} elevation={0}>
              <Typography variant="h3" sx={styles.statNumber}>
                98%
              </Typography>
              <Typography variant="body2" sx={styles.statLabel}>
                DONOR SATISFACTION
              </Typography>
              <Typography variant="caption" sx={styles.statSubtext}>
                Based on 2,400+ reviews
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Impact Section */}
        <Box sx={styles.sectionMargin}>
          <Typography variant="h3" sx={styles.sectionTitle}>
            How Your Donation Creates Impact
          </Typography>
          <Typography variant="body1" sx={styles.sectionDescription}>
            Every dollar you contribute goes toward creating real, tangible change to help 
            communities and improve environmental quality.
          </Typography>
          
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Card sx={styles.impactCard} elevation={0}>
                <Box sx={{ ...styles.iconBox, bgcolor: '#dbeafe' }}>
                  <VolunteerActivism sx={{ color: '#3b82f6', fontSize: 36 }} />
                </Box>
                <Typography variant="h6" sx={styles.cardTitle}>
                  Volunteer Support
                </Typography>
                <Typography variant="body2" sx={styles.cardDescription}>
                  Help fund stipends, training materials, and resources for the volunteers 
                  working to make a difference in cleanup programs across Canada.
                </Typography>
                <Button size="small" sx={styles.learnMoreButton}>
                  → Learn how this works
                </Button>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={styles.impactCard} elevation={0}>
                <Box sx={{ ...styles.iconBox, bgcolor: '#f3e8ff' }}>
                  <Security sx={{ color: '#a855f7', fontSize: 36 }} />
                </Box>
                <Typography variant="h6" sx={styles.cardTitle}>
                  AI Technology
                </Typography>
                <Typography variant="body2" sx={styles.cardDescription}>
                  Contribute to AI-led initiatives that optimize AI route planning for cleanup 
                  efforts, making the process smarter and more efficient.
                </Typography>
                <Button size="small" sx={styles.learnMoreButton}>
                  → See our AI impact
                </Button>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={styles.impactCard} elevation={0}>
                <Box sx={{ ...styles.iconBox, bgcolor: '#dcfce7' }}>
                  <InfoOutlined sx={{ color: '#22c55e', fontSize: 36 }} />
                </Box>
                <Typography variant="h6" sx={styles.cardTitle}>
                  Coastline Protection
                </Typography>
                <Typography variant="body2" sx={styles.cardDescription}>
                  Your donations directly support debris cleanup at beaches that protect wildlife 
                  and preserve natural marine environments across Canada.
                </Typography>
                <Button size="small" sx={styles.learnMoreButton}>
                  → Track our success
                </Button>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={styles.impactCard} elevation={0}>
                <Box sx={{ ...styles.iconBox, bgcolor: '#fed7aa' }}>
                  <Pets sx={{ color: '#f97316', fontSize: 36 }} />
                </Box>
                <Typography variant="h6" sx={styles.cardTitle}>
                  Environmental Impact
                </Typography>
                <Typography variant="body2" sx={styles.cardDescription}>
                  Protect wildlife, reduce pollution, and help create clean water for marine life 
                  and coastal communities throughout Canada.
                </Typography>
                <Button size="small" sx={styles.learnMoreButton}>
                  → Explore the impact
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Donation Distribution */}
        <Card sx={styles.distributionCard}>
          <Typography variant="h3" sx={styles.sectionTitle}>
            Where Your Money Goes
          </Typography>
          <Typography variant="body1" sx={styles.sectionDescription}>
            Here is a breakdown of the key areas where your donations make the greatest impact for our nation.
          </Typography>
          
          <Box sx={styles.progressSection}>
            <Box sx={styles.progressItem}>
              <Box sx={styles.progressLabel}>
                <Typography variant="body1" fontWeight={600} color="#1a1a2e">
                  Volunteer Training & Support
                </Typography>
                <Typography variant="body1" sx={styles.progressPercent}>67%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={67} 
                sx={styles.progressBar}
              />
            </Box>

            <Box sx={styles.progressItem}>
              <Box sx={styles.progressLabel}>
                <Typography variant="body1" fontWeight={600} color="#1a1a2e">
                  Technology & AI Infrastructure
                </Typography>
                <Typography variant="body1" sx={styles.progressPercent}>18%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={18} 
                sx={styles.progressBar}
              />
            </Box>

            <Box sx={styles.progressItem}>
              <Box sx={styles.progressLabel}>
                <Typography variant="body1" fontWeight={600} color="#1a1a2e">
                  Operations & Administration
                </Typography>
                <Typography variant="body1" sx={styles.progressPercent}>10%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={10} 
                sx={styles.progressBar}
              />
            </Box>

            <Box sx={styles.progressItem}>
              <Box sx={styles.progressLabel}>
                <Typography variant="body1" fontWeight={600} color="#1a1a2e">
                  Campaign & Sustainability
                </Typography>
                <Typography variant="body1" sx={styles.progressPercent}>5%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={5} 
                sx={styles.progressBar}
              />
            </Box>
          </Box>

          <Typography variant="caption" sx={styles.disclaimer}>
            * Data is being recalculated annually and might be subject to our modalities.
          </Typography>
        </Card>

        {/* Testimonials */}
        <Box sx={styles.sectionMargin}>
          <Typography variant="h3" sx={styles.sectionTitle}>
            What Our Donors Say
          </Typography>
          <Typography variant="body1" sx={styles.sectionDescription}>
            Let testimonials tell the stories for us. Here's what others said about us.
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {[
              { name: 'Jordan Chen', location: 'Vancouver, British Columbia' },
              { name: 'Sarah Mitchell', location: 'Halifax, Nova Scotia' },
              { name: 'Alex Kumar', location: 'Toronto, Ontario' }
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={styles.testimonialCard} elevation={0}>
                  <Rating value={5} readOnly size="small" sx={styles.rating} />
                  <Typography variant="body2" sx={styles.testimonialText}>
                    "WaveGuard transformed the way we approach coastal cleanup. The AI technology 
                    and dedicated volunteers are making a real difference in our community."
                  </Typography>
                  <Box sx={styles.testimonialAuthor}>
                    <Avatar sx={styles.avatar}>
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={styles.authorName}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" sx={styles.authorLocation}>
                        {testimonial.location}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FAQ Section */}
        <Box sx={styles.sectionMargin}>
          <Typography variant="h3" sx={styles.sectionTitle}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="body1" sx={styles.sectionDescription}>
            Everything you need to know about how to donate to WaveGuard.
          </Typography>

          <Box sx={styles.faqContainer}>
            {[
              {
                question: 'How do I make a donation?',
                answer: 'Making a donation is simple! Just click the "Donate Now" button, select your donation type, fill out your information, and complete the secure payment process.'
              },
              {
                question: 'Are donations tax-deductible?',
                answer: 'Yes, donations to WaveGuard Canada are tax-deductible. You\'ll receive a tax receipt via email that you can use for your tax filing.'
              },
              {
                question: 'Can I donate on a specific campaign?',
                answer: 'Absolutely! You can choose to direct your donation to specific campaigns or let us allocate it where it\'s needed most.'
              },
              {
                question: 'How will I know the status of my donation?',
                answer: 'You\'ll receive immediate confirmation via email, and you can track your donation impact through regular updates and our donor dashboard.'
              },
              {
                question: 'Can I donate for monthly donations?',
                answer: 'Yes, you can set up monthly recurring donations. This provides sustainable support and you can modify or cancel at any time through your donor portal.'
              }
            ].map((faq, index) => (
              <Accordion key={index} sx={styles.accordion}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography sx={styles.faqQuestion}>{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={styles.faqAnswer}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default DonationPage;