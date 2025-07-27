import { Category } from "@/hooks/useCategories";

export const questions = (categories: Category[]) => {
  return [
    // 🎤 Concerts & Gig Guide
    {
      id: 1,
      text: "Would you sell your soul for front-row concert tickets?",
      category: categories.find((c) => c.url_slug === "concerts-gig-guide")!,
    },
    {
      id: 2,
      text: "Do your neighbours secretly hate your shower singing?",
      category: categories.find((c) => c.url_slug === "concerts-gig-guide")!,
    },
    {
      id: 3,
      text: "You hear live music nearby. Are you running toward it?",
      category: categories.find((c) => c.url_slug === "concerts-gig-guide")!,
    },

    // 🎭 Performing Arts
    {
      id: 4,
      text: "Do you cry at musicals and pretend it's just allergies?",
      category: categories.find((c) => c.url_slug === "arts")!,
    },
    {
      id: 5,
      text: "Do you clap at the end of movies out of habit?",
      category: categories.find((c) => c.url_slug === "arts")!,
    },
    {
      id: 6,
      text: "Is dramatic lighting your love language?",
      category: categories.find((c) => c.url_slug === "arts")!,
    },

    // 🎟️ Theatre
    {
      id: 7,
      text: "Do you quote Shakespeare just to sound deep?",
      category: categories.find((c) => c.url_slug === "theatre")!,
    },
    {
      id: 8,
      text: "Does a spotlight call your name?",
      category: categories.find((c) => c.url_slug === "theatre")!,
    },
    {
      id: 9,
      text: "Do you think breaking the fourth wall should happen IRL?",
      category: categories.find((c) => c.url_slug === "theatre")!,
    },

    // 🏃‍♂️ Sports & Outdoors
    {
      id: 10,
      text: "Is your idea of cardio ‘running late’?",
      category: categories.find((c) => c.url_slug === "sports")!,
    },
    {
      id: 11,
      text: "Are you outdoorsy or just like drinking wine outside?",
      category: categories.find((c) => c.url_slug === "sports")!,
    },
    {
      id: 12,
      text: "Do you own more activewear than actual workout plans?",
      category: categories.find((c) => c.url_slug === "sports")!,
    },

    // 🎉 Festivals & Lifestyle
    {
      id: 13,
      text: "Would you attend a festival just for the vibes and fairy lights?",
      category: categories.find((c) => c.url_slug === "lifestyle")!,
    },
    {
      id: 14,
      text: "Do you own glitter ‘just in case’ there’s a festival?",
      category: categories.find((c) => c.url_slug === "lifestyle")!,
    },
    {
      id: 15,
      text: "Do you only know the headliner’s two most popular songs?",
      category: categories.find((c) => c.url_slug === "lifestyle")!,
    },

    // 💃 Dance
    {
      id: 16,
      text: "Do you dance like no one’s watching... and hope they aren’t?",
      category: categories.find((c) => c.url_slug === "dance")!,
    },
    {
      id: 17,
      text: "Would you join a dance class just to show off on TikTok?",
      category: categories.find((c) => c.url_slug === "dance")!,
    },
    {
      id: 18,
      text: "Do you consider your clubbing moves a form of art?",
      category: categories.find((c) => c.url_slug === "dance")!,
    },

    // 🖼️ Exhibitions
    {
      id: 19,
      text: "Do you pretend to understand abstract art?",
      category: categories.find((c) => c.url_slug === "exhibitions")!,
    },
    {
      id: 20,
      text: "Do you touch the 'do not touch' sign with your eyes?",
      category: categories.find((c) => c.url_slug === "exhibitions")!,
    },
    {
      id: 21,
      text: "Is gallery hopping your version of cardio?",
      category: categories.find((c) => c.url_slug === "exhibitions")!,
    },

    // 📚 Workshops, Conferences & Classes
    {
      id: 22,
      text: "Do you sign up for classes then forget to attend?",
      category: categories.find(
        (c) => c.url_slug === "workshops-conferences-classes"
      )!,
    },
    {
      id: 23,
      text: "Is learning your favourite personality trait?",
      category: categories.find(
        (c) => c.url_slug === "workshops-conferences-classes"
      )!,
    },
    {
      id: 24,
      text: "Would you attend a workshop just for free snacks?",
      category: categories.find(
        (c) => c.url_slug === "workshops-conferences-classes"
      )!,
    },

    // 🎶 Musicals
    {
      id: 25,
      text: "Do you break into song when life gets dramatic?",
      category: categories.find((c) => c.url_slug === "arts-culture-musicals")!,
    },
    {
      id: 26,
      text: "Do you believe life *should* be a musical?",
      category: categories.find((c) => c.url_slug === "arts-culture-musicals")!,
    },
    {
      id: 27,
      text: "Have you ever belted 'Defying Gravity' alone in your car?",
      category: categories.find((c) => c.url_slug === "arts-culture-musicals")!,
    },
  ];
};
