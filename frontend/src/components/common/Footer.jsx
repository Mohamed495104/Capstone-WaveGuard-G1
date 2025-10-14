"use client";
import Image from "next/image";
import { styled } from "@mui/material/styles";

/* Styled Components */
const FooterContainer = styled("footer")(() => ({
  background: "#ffffff",
  padding: "80px 100px 60px",
  color: "#003554",
  fontFamily: "Inter, sans-serif",
  "@media (max-width: 1024px)": {
    padding: "60px 40px 40px",
  },
  "@media (max-width: 768px)": {
    padding: "50px 24px 30px",
  },
}));

const TopSection = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  flexWrap: "wrap",
  gap: "60px",
  maxWidth: "1217px",
  margin: "0 auto 60px",
}));

const About = styled("div")(() => ({
  maxWidth: 340,
  "@media (max-width: 768px)": {
    maxWidth: "100%",
  },
}));

const LogoRow = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 12,
}));

const LinksSection = styled("div")(() => ({
  display: "flex",
  gap: 80,
  flexWrap: "wrap",
  "@media (max-width: 1024px)": {
    gap: 50,
  },
  "@media (max-width: 768px)": {
    gap: 32,
    justifyContent: "flex-start",
  },
}));

const ContactArea = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "40px",
  paddingTop: "24px",
  borderTop: "1px solid rgba(0,0,0,0.08)",
  maxWidth: "1200px",
  margin: "0 auto",
  "@media (max-width: 768px)": {
    flexDirection: "column",
    gap: "20px",
  },
}));

const ContactCard = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  gap: 15,
  background: "#F8FCFD",
  borderRadius: 12,
  padding: "16px 26px",
  boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "@media (max-width: 768px)": {
    width: "100%",
    justifyContent: "center",
  },
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
  },
}));

/* Component */
export default function Footer() {
  return (
    <FooterContainer>
      {/* Top Section */}
      <TopSection>
        {/* About Section */}
        <About>
          <LogoRow>
            <Image
              src="/images/logo.png"
              alt="WaveGuard Logo"
              width={36}
              height={36}
            />
            <h4 style={{ color: "#0891B2", fontWeight: 700, fontSize: 20 }}>
              WaveGuard
            </h4>
          </LogoRow>

          <p
            style={{
              color: "#004b63",
              lineHeight: 1.6,
              fontSize: 15,
              marginBottom: 20,
            }}
          >
            AI-powered platform connecting volunteers across Canada to protect
            our 243,042 km of coastline. Together, we’re making cleanup efforts
            measurable and impactful.
          </p>

          {/* Newsletter */}
          <div style={{ marginTop: 20 }}>
            <h5
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#003554",
                marginBottom: 10,
              }}
            >
              Subscribe to our newsletter
            </h5>

            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <input
                type="email"
                placeholder="your@email.com"
                style={{
                  flex: 1,
                  border: "1px solid #cce7f0",
                  borderRadius: 8,
                  padding: "10px 12px",
                  fontSize: 14,
                  color: "#003554",
                  background: "#ffffff",
                  outline: "none",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                }}
              />
              <button
                style={{
                  background: "#0891b2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 16px",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "background 0.3s ease, transform 0.2s ease",
                }}
              >
                →
              </button>
            </div>
            <span style={{ fontSize: 12, color: "#004b63" }}>
              Get updates on cleanup challenges and impact reports.
            </span>
          </div>
        </About>

        {/* Links Section */}
        <LinksSection>
          {[
            {
              title: "Platform",
              items: ["Challenges", "Upload Cleanup", "Dashboard", "Achievements"],
            },
            {
              title: "Resources",
              items: ["How It Works", "AI Detection", "Impact Reports"],
            },
            {
              title: "Company",
              items: ["About Us", "Our Mission", "Contact"],
            },
            {
              title: "Legal",
              items: [
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "Accessibility",
              ],
            },
          ].map((group, idx) => (
            <div key={idx}>
              <h5
                style={{
                  color: "#003554",
                  fontWeight: 600,
                  fontSize: 18,
                  marginBottom: 16,
                }}
              >
                {group.title}
              </h5>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {group.items.map((item) => (
                  <li
                    key={item}
                    style={{
                      color: "#58696e",
                      fontSize: 14,
                      marginBottom: 14,
                      cursor: "pointer",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#0077b6")}
                    onMouseLeave={(e) => (e.target.style.color = "#58696e")}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </LinksSection>
      </TopSection>

      {/* Contact Information */}
      <ContactArea>
        <ContactCard>
          <Image
            src="/images/mail.png"
            alt="Mail Icon"
            width={22}
            height={22}
          />
          <div>
            <p style={{ fontWeight: 600, color: "#0077b6", marginBottom: 2 }}>
              Email Us
            </p>
            <p style={{ color: "#003554", fontSize: 14 }}>
              support@waveguard.ca
            </p>
          </div>
        </ContactCard>

        <ContactCard>
          <Image
            src="/images/phone.png"
            alt="Phone Icon"
            width={22}
            height={22}
          />
          <div>
            <p style={{ fontWeight: 600, color: "#0077b6", marginBottom: 2 }}>
              Call Us
            </p>
            <p style={{ color: "#003554", fontSize: 14 }}>
              1-800-WAVE-GUARD
            </p>
          </div>
        </ContactCard>

        <ContactCard>
          <Image
            src="/images/location.png"
            alt="Location Icon"
            width={22}
            height={22}
          />
          <div>
            <p style={{ fontWeight: 600, color: "#0077b6", marginBottom: 2 }}>
              Location
            </p>
            <p style={{ color: "#003554", fontSize: 14 }}>
              Coast to Coast, Canada
            </p>
          </div>
        </ContactCard>
      </ContactArea>
    </FooterContainer>
  );
}
