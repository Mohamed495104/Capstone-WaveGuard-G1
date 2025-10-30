"use client";
import Image from "next/image";
import { styled } from "@mui/material/styles";

/* Styled Components */
const FooterContainer = styled("footer")(() => ({
<<<<<<< HEAD
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
=======
    background: "#F5F9FA",
    padding: "80px 100px 40px",
    color: "#003554",
    fontFamily: "Inter, sans-serif",
    "@media (max-width: 1024px)": {
        padding: "60px 40px 30px",
    },
    "@media (max-width: 768px)": {
        padding: "40px 20px 100px",
        marginBottom: 0,
    },
}));

const TopSection = styled("div")(() => ({
    display: "grid",
    gridTemplateColumns: "400px 1fr",
    gap: "80px",
    maxWidth: "1400px",
    margin: "0 auto 50px",
    "@media (max-width: 1200px)": {
        gridTemplateColumns: "350px 1fr",
        gap: "60px",
    },
    "@media (max-width: 1024px)": {
        gridTemplateColumns: "1fr",
        gap: "40px",
        marginBottom: "40px",
    },
    "@media (max-width: 768px)": {
        gap: "32px",
        marginBottom: "32px",
    },
}));

const About = styled("div")(() => ({
    maxWidth: "100%",
    "@media (max-width: 768px)": {
        maxWidth: "100%",
    },
}));

const LogoRow = styled("div")(() => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
}));

const LogoText = styled("h4")(() => ({
    color: "#0891B2",
    fontWeight: 700,
    fontSize: 22,
    margin: 0,
    "@media (max-width: 768px)": {
        fontSize: 20,
    },
}));

const Description = styled("p")(() => ({
    color: "#5A7B8A",
    lineHeight: 1.7,
    fontSize: 15,
    marginBottom: 24,
    "@media (max-width: 768px)": {
        fontSize: 14,
        lineHeight: 1.6,
    },
}));

const NewsletterSection = styled("div")(() => ({
    marginTop: 24,
}));

const NewsletterTitle = styled("h5")(() => ({
    fontSize: 15,
    fontWeight: 600,
    color: "#003554",
    marginBottom: 12,
    "@media (max-width: 768px)": {
        fontSize: 14,
    },
}));

const NewsletterForm = styled("div")(() => ({
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginBottom: 8,
}));

const EmailInput = styled("input")(() => ({
    flex: 1,
    border: "1px solid #D1E5ED",
    borderRadius: 8,
    padding: "11px 14px",
    fontSize: 14,
    color: "#003554",
    background: "#ffffff",
    outline: "none",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    "&:focus": {
        borderColor: "#0891B2",
        boxShadow: "0 0 0 3px rgba(8, 145, 178, 0.1)",
    },
    "&::placeholder": {
        color: "#9BB5C0",
    },
}));

const SubmitButton = styled("button")(() => ({
    background: "#0891B2",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "11px 18px",
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.3s ease, transform 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
        background: "#0077A3",
        transform: "translateY(-1px)",
    },
    "&:active": {
        transform: "translateY(0)",
    },
}));

const NewsletterHint = styled("span")(() => ({
    fontSize: 12,
    color: "#6B8C98",
    lineHeight: 1.4,
}));

const LinksSection = styled("div")(() => ({
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "50px",
    "@media (max-width: 1200px)": {
        gap: "40px",
    },
    "@media (max-width: 1024px)": {
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "30px",
    },
    "@media (max-width: 768px)": {
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "24px 16px",
    },
}));

const LinkColumn = styled("div")(() => ({
    "@media (max-width: 768px)": {
        minWidth: "unset",
    },
}));

const ColumnTitle = styled("h5")(() => ({
    color: "#003554",
    fontWeight: 600,
    fontSize: 16,
    marginBottom: 16,
    "@media (max-width: 768px)": {
        fontSize: 15,
        marginBottom: 12,
    },
}));

const LinkList = styled("ul")(() => ({
    listStyle: "none",
    padding: 0,
    margin: 0,
}));

const LinkItem = styled("li")(() => ({
    color: "#6B8C98",
    fontSize: 14,
    marginBottom: 12,
    cursor: "pointer",
    transition: "color 0.2s ease, transform 0.2s ease",
    "&:hover": {
        color: "#0891B2",
        transform: "translateX(2px)",
    },
    "@media (max-width: 768px)": {
        fontSize: 13,
        marginBottom: 10,
    },
}));

const ContactArea = styled("div")(() => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "30px",
    paddingTop: "32px",
    borderTop: "1px solid #D1E5ED",
    maxWidth: "1400px",
    margin: "0 auto",
    "@media (max-width: 1024px)": {
        gap: "20px",
    },
    "@media (max-width: 768px)": {
        flexDirection: "column",
        gap: "16px",
        paddingTop: "24px",
    },
}));

const ContactCard = styled("div")(() => ({
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "#FFFFFF",
    borderRadius: 12,
    padding: "18px 28px",
    boxShadow: "0 2px 8px rgba(0, 83, 116, 0.06)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    minWidth: 280,
    "@media (max-width: 1024px)": {
        minWidth: 240,
        padding: "16px 24px",
    },
    "@media (max-width: 768px)": {
        width: "100%",
        minWidth: "unset",
        justifyContent: "flex-start",
        padding: "16px 20px",
    },
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(0, 83, 116, 0.12)",
    },
}));

const IconWrapper = styled("div")(() => ({
    width: 44,
    height: 44,
    borderRadius: 10,
    background: "#E6F7FA",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    "@media (max-width: 768px)": {
        width: 40,
        height: 40,
    },
}));

const ContactInfo = styled("div")(() => ({
    display: "flex",
    flexDirection: "column",
    gap: 2,
}));

const ContactLabel = styled("p")(() => ({
    fontWeight: 600,
    color: "#0891B2",
    margin: 0,
    fontSize: 14,
    "@media (max-width: 768px)": {
        fontSize: 13,
    },
}));

const ContactValue = styled("p")(() => ({
    color: "#003554",
    fontSize: 15,
    margin: 0,
    fontWeight: 500,
    "@media (max-width: 768px)": {
        fontSize: 14,
    },
>>>>>>> main
}));

/* Component */
export default function Footer() {
<<<<<<< HEAD
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
=======
    const linkGroups = [
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
            items: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility"],
        },
    ];

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
                        <LogoText>WaveGuard</LogoText>
                    </LogoRow>

                    <Description>
                        AI-powered platform connecting volunteers across Canada to protect
                        our 243,042 km of coastline. Together, we're making cleanup efforts
                        measurable and impactful.
                    </Description>

                    {/* Newsletter */}
                    <NewsletterSection>
                        <NewsletterTitle>Subscribe to our newsletter</NewsletterTitle>

                        <NewsletterForm>
                            <EmailInput
                                type="email"
                                placeholder="your@email.com"
                                aria-label="Email address"
                            />
                            <SubmitButton aria-label="Subscribe">
                                →
                            </SubmitButton>
                        </NewsletterForm>
                        <NewsletterHint>
                            Get updates on cleanup challenges and impact reports.
                        </NewsletterHint>
                    </NewsletterSection>
                </About>

                {/* Links Section */}
                <LinksSection>
                    {linkGroups.map((group, idx) => (
                        <LinkColumn key={idx}>
                            <ColumnTitle>{group.title}</ColumnTitle>
                            <LinkList>
                                {group.items.map((item) => (
                                    <LinkItem key={item}>{item}</LinkItem>
                                ))}
                            </LinkList>
                        </LinkColumn>
                    ))}
                </LinksSection>
            </TopSection>

            {/* Contact Information */}
            <ContactArea>
                <ContactCard>
                    <IconWrapper>
                        <Image
                            src="/images/mail.png"
                            alt="Mail Icon"
                            width={22}
                            height={22}
                        />
                    </IconWrapper>
                    <ContactInfo>
                        <ContactLabel>Email Us</ContactLabel>
                        <ContactValue>support@waveguard.ca</ContactValue>
                    </ContactInfo>
                </ContactCard>

                <ContactCard>
                    <IconWrapper>
                        <Image
                            src="/images/phone.png"
                            alt="Phone Icon"
                            width={22}
                            height={22}
                        />
                    </IconWrapper>
                    <ContactInfo>
                        <ContactLabel>Call Us</ContactLabel>
                        <ContactValue>1-800-WAVE-GUARD</ContactValue>
                    </ContactInfo>
                </ContactCard>

                <ContactCard>
                    <IconWrapper>
                        <Image
                            src="/images/location.png"
                            alt="Location Icon"
                            width={22}
                            height={22}
                        />
                    </IconWrapper>
                    <ContactInfo>
                        <ContactLabel>Location</ContactLabel>
                        <ContactValue>Coast to Coast, Canada</ContactValue>
                    </ContactInfo>
                </ContactCard>
            </ContactArea>
        </FooterContainer>
    );
}
>>>>>>> main
