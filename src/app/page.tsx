"use client";
import Image from "next/image";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [submittedEmails, setSubmittedEmails] = useState<string[]>([]);
  const [emailError, setEmailError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && emailRegex.test(email)) {
      // Check for duplicate in local state
      if (submittedEmails.includes(email)) {
        setEmailError("This email has already been registered");
        return;
      }

      try {
        const response = await fetch("/api/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 400) {
            setEmailError("This email has already been registered");
          } else {
            throw new Error("Failed to submit email");
          }
          return;
        }

        // Clear error message on success
        setEmailError("");
        // Update local state
        setSubmittedEmails([...submittedEmails, email]);
        // Clear input
        setEmail("");
      } catch (error) {
        console.error("Error:", error);
        setEmailError("Failed to submit email. Please try again.");
      }
    } else {
      setEmailError("Please provide a valid email address");
    }
  };

  return (
    <div className="parent-bg min-h-screen bg-no-repeat bg-cover flex justify-center items-center p-4">
      {/* hero */}
      <div className="flex overflow-hidden max-w-6xl w-full shadow-lg bg-white rounded-lg">
        {/* content-left */}
        <div className="flex-1 flex flex-col bg-[url('/images/bg.svg')] bg-cover bg-no-repeat p-8 md:p-16">
          <div className="max-w-md">
            {/* logo */}
            <div className="mb-16">
              <img src="images/logo.svg" alt="Logo" className="w-32" />
            </div>
            {/* Text */}
            <div className="flex flex-col gap-9">
              <h1 className="text-4xl md:text-6xl text-[hsl(0,36%,70%)]">
                WE'RE <br />
                <span className="text-black">
                  COMING <br /> SOON
                </span>
              </h1>
              <p className="text-[hsl(0,36%,70%)] font-bold text-sm md:text-base">
                Hello fellow shoppers! were currently building our new fashion
                store. Add your email below to stay up-to-date with
                announcements and our launch deals
              </p>
              {/* email address */}
              <div className="max-w-md">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-2" // Added gap for error message spacing
                >
                  <div className="relative flex items-center rounded-full shadow-sm border border-gray-100">
                    <textarea
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className={`w-full py-3 px-6 rounded-full resize-none overflow-hidden bg-transparent focus:outline-none ${
                        emailError ? "border-red-500" : ""
                      }`}
                      rows={1}
                      style={{ height: "50px" }}
                    />
                    <button
                      type="submit"
                      className="absolute right-0 rounded-full gradient-bg hover:opacity-50 hover:drop-shadow-xl cursor-pointer transition-colors text-white h-full flex items-center justify-center min-w-[20%]"
                      aria-label="Subscribe"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                  {emailError && (
                    <p className="text-red-500 text-sm pl-6">{emailError}</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* content-right */}
        <div className="w-1/2 hidden md:block">
          <img
            src="images/hero-desktop.jpg"
            alt="Hero"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
