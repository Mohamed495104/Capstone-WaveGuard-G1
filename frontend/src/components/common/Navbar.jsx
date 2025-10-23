"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

/* Styled Components */
const NavBar = styled("header")(() => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 50px",
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 50,
    "@media (max-width: 768px)": {
        padding: "14px 24px",
    },
}));

const Logo = styled(Link)(() => ({
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
}));

const NavLinks = styled("nav")(({ open }) => ({
    display: "flex",
    alignItems: "center",
    gap: "16px",
    transition: "all 0.3s ease",
    "@media (max-width: 768px)": { //responsive
        position: "absolute",
        top: "64px",
        left: 0,
        width: "100%",
        flexDirection: "column",
        background: "#fff",
        padding: "20px 0",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        transform: open ? "translateY(0)" : "translateY(-120%)",
        opacity: open ? 1 : 0,
    },
    "& a": {
        color: "#333",
        textDecoration: "none",
        fontWeight: 500,
        fontSize: "15px",
        transition: "color 0.2s ease",
        "@media (max-width: 768px)": {
            padding: "10px 0",
            width: "100%",
            textAlign: "center",
        },
    },
    "& a:hover": {
        color: "#0077b6",
    },
}));

const MenuButton = styled("div")(() => ({
    display: "none",
    "@media (max-width: 768px)": {
        display: "block",
        cursor: "pointer",
    },
}));

/* Component */
export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <NavBar>
            <Logo href="/">
                <Image src="/images/logo.png" alt="WaveGuard Logo" width={40} height={40} />
            </Logo>

            <MenuButton onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <CloseIcon fontSize="large" /> : <MenuIcon fontSize="large" />}
            </MenuButton>

            <NavLinks open={menuOpen}>
                <Link href="/">Home</Link>
                <Link href="/challenges">Challenges</Link>
                <Link href="/upload">Upload</Link>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/achievements">Achievements</Link>
            </NavLinks>
        </NavBar>
    );
}
