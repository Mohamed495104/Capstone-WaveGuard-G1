"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import withAuth from "@/components/auth/withAuth";
import { Box, Typography, Grid } from "@mui/material";
import {
  HeroSection,
  HeroOverlay,
  HeroTag,
  HeroTitle,
  HeroDesc,
  HeroButtons,
  PrimaryButton,
  OutlineButton,
  StatsBox,
  WorkSection,
  WorkBadge,
  WorkGrid,
  WorkCard,
  MissionSection,
  MissionContent,
  MissionButton,
  TipsSection,
  TipsGrid,
  TipCard,
} from "./landing.styles";

function LandingPage() {
  const router = useRouter();

  return (
    <>
      {/* HERO SECTION */}
      <HeroSection>
        <HeroOverlay>
          <HeroTag>Eco-System</HeroTag>
          <HeroTitle>
            Protect Canada’s <br />
            <span style={{ color: "#67e8c3" }}>Shorelines Together</span>
          </HeroTitle>
          <HeroDesc>
            Turn your cleanup efforts into measurable impact. WaveGuard uses AI
            to classify waste, track progress, and connect volunteers across
            Canada’s <span style={{ color: "#67e8c3" }}>243,042 km</span> of
            coastline.
          </HeroDesc>
          <HeroButtons>
            <PrimaryButton onClick={() => router.push("/challenge")}>
              Join a Challenge
            </PrimaryButton>
            <OutlineButton
              onClick={() =>
                document
                  .getElementById("platform-features")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Know More
            </OutlineButton>
          </HeroButtons>

          <StatsBox>
            <Box>
              <Typography variant="h5" color="#fff">
                12,547
              </Typography>
              <Typography color="#d0eaf0">Items Collected</Typography>
            </Box>
            <Box>
              <Typography variant="h5" color="#fff">
                2,891
              </Typography>
              <Typography color="#d0eaf0">Active Volunteers</Typography>
            </Box>
            <Box>
              <Typography variant="h5" color="#fff">
                47
              </Typography>
              <Typography color="#d0eaf0">Active Challenges</Typography>
            </Box>
          </StatsBox>
        </HeroOverlay>
      </HeroSection>

      {/* PLATFORM FEATURES SECTION */}
      <WorkSection id="platform-features">
        <WorkBadge>Platform Features</WorkBadge>
        <Typography variant="h4" fontWeight={700} color="#003554" mb={1}>
          How WaveGuard Works
        </Typography>
        <Typography color="#004b63" mb={6}>
          Making cleanup efforts measurable, engaging, and impactful through
          technology and community.
        </Typography>

        <WorkGrid>
          {[
            {
              img: "/images/ai-detection.png",
              title: "AI Trash Detection",
              desc: "Instantly identifies waste types from photos using advanced AI technology.",
            },
            {
              img: "/images/challenge.png",
              title: "Local Challenges",
              desc: "Join cleanup events in your community and make a real impact.",
            },
            {
              img: "/images/track.png",
              title: "Track Your Impact",
              desc: "View personal stats and see how your efforts contribute to the bigger picture.",
            },
            {
              img: "/images/community.png",
              title: "Community Driven",
              desc: "Connect with volunteers across Canada and compete on leaderboards.",
            },
          ].map((card, i) => (
            <WorkCard key={i}>
              <Image src={card.img} alt={card.title} width={64} height={64} />
              <Typography variant="h6" color="#0077b6" mt={1}>
                {card.title}
              </Typography>
              <Typography color="#004b63" fontSize="14px">
                {card.desc}
              </Typography>
            </WorkCard>
          ))}
        </WorkGrid>
      </WorkSection>

      {/* 🌿 SUSTAINABILITY TIPS SECTION */}
      <TipsSection>
        <Typography variant="h4" fontWeight={700} color="#003554" mb={1}>
          Simple Ways to Protect Our Oceans 🌿
        </Typography>
        <Typography color="#004b63" mb={6}>
          Small lifestyle changes make a big impact on ocean health and marine life.
        </Typography>

        <TipsGrid>
          {[
            {
              icon: "🚯",
              tip: "Avoid single-use plastics — carry your own bottles and cutlery.",
            },
            {
              icon: "🛍️",
              tip: "Use reusable bags and containers for shopping and takeout.",
            },
            {
              icon: "🧴",
              tip: "Choose reef-safe sunscreen to protect marine ecosystems.",
            },
            {
              icon: "🚴",
              tip: "Use eco-friendly transport or carpool to reduce emissions.",
            },
          ].map((tip, i) => (
            <TipCard key={i}>
              <Typography fontSize="36px" mb={1}>
                {tip.icon}
              </Typography>
              <Typography color="#004b63" fontSize="14px" sx={{ lineHeight: 1.6 }}>
                {tip.tip}
              </Typography>
            </TipCard>
          ))}
        </TipsGrid>
      </TipsSection>

      {/* 🌊 MISSION SECTION */}
      <MissionSection>
        <MissionContent>
          <span className="badge">Our Mission</span>
          <h3>Protecting the World’s Longest Coastline</h3>
          <p>
            Canada’s 243,042 km coastline faces increasing plastic pollution
            threatening marine life and local ecosystems. WaveGuard coordinates
            volunteers, tracks meaningful data, and motivates ongoing
            participation to protect our shores for future generations.
          </p>
          <MissionButton onClick={() => router.push("/challenge")}>
            Get Started Today
          </MissionButton>
        </MissionContent>
      </MissionSection>

      {/*  VOLUNTEER STORIES SECTION */}
      <Box
        sx={{
          backgroundColor: "#f9fafb",
          py: { xs: 6, md: 10 },
          px: { xs: 3, md: 8 },
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight={700} color="#003554" mb={1}>
          Voices of Change 💬
        </Typography>
        <Typography color="#004b63" mb={6}>
          Real stories from volunteers who are making a difference across Canada.
        </Typography>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
          maxWidth="1100px"
          margin="0 auto"
        >
          {[
            {
              img: "/images/story1.jpg",
              name: "Emma – Vancouver",
              text: "I joined WaveGuard last summer, and it completely changed how I see ocean waste. Our group collected 1,200 items in one day — teamwork made it fun!",
            },
            {
              img: "/images/story2.jpg",
              name: "Ravi – Toronto",
              text: "Our college team removed 900+ bottles in a weekend. WaveGuard made organizing and tracking everything super easy — we could actually see our impact!",
            },
            {
              img: "/images/story3.jpg",
              name: "Mia – Halifax",
              text: "I joined WaveGuard as a challenge, but it became a lifestyle. Every cleanup reminds me that small actions can create waves of change.",
            },
          ].map((story, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  p: 3,
                  height: "100%",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 18px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Image
                  src={story.img}
                  alt={story.name}
                  width={80}
                  height={80}
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: 16,
                  }}
                />
                <Typography variant="h6" color="#0077b6" mb={1}>
                  {story.name}
                </Typography>
                <Typography color="#475569" fontSize="14px">
                  {story.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default withAuth(LandingPage);
