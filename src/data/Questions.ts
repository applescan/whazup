import { Category } from "@/hooks/useCategories";

export const questions = (categories: Category[]) => {
  const findCategoryBySlug = (slug: string): Category | undefined => {
    return categories.find((c) => c.url_slug === slug);
  };

  const allQuestions = [
  // 🎤 Concerts & Gig Guide
  { id: 1, text: "Would you sell your soul for front-row concert tickets?", categorySlug: "concerts-gig-guide" },
  { id: 2, text: "Do your neighbours secretly hate your shower singing?", categorySlug: "concerts-gig-guide" },
  { id: 3, text: "You hear live music nearby. Are you running toward it?", categorySlug: "concerts-gig-guide" },
  { id: 28, text: "Do you stalk setlists online before the show?", categorySlug: "concerts-gig-guide" },
  { id: 29, text: "Do you judge people who film the whole concert?", categorySlug: "concerts-gig-guide" },
  { id: 30, text: "Would you camp overnight for a ticket drop?", categorySlug: "concerts-gig-guide" },
  { id: 31, text: "Do you buy merch even if you’re broke?", categorySlug: "concerts-gig-guide" },
  { id: 32, text: "Do you secretly hope for an encore every time?", categorySlug: "concerts-gig-guide" },

  // 🎭 Performing Arts (Arts)
  { id: 4, text: "Do you cry at musicals and pretend it's just allergies?", categorySlug: "arts" },
  { id: 5, text: "Do you clap at the end of movies out of habit?", categorySlug: "arts" },
  { id: 6, text: "Is dramatic lighting your love language?", categorySlug: "arts" },
  { id: 33, text: "Do you analyze stage props like a detective?", categorySlug: "arts" },
  { id: 34, text: "Do you secretly wish for a standing ovation at work?", categorySlug: "arts" },
  { id: 35, text: "Would you rather be in the orchestra pit than in the audience?", categorySlug: "arts" },
  { id: 36, text: "Do you compare real life to dramatic plot twists?", categorySlug: "arts" },
  { id: 37, text: "Does stage makeup fascinate you?", categorySlug: "arts" },

  // 🎟️ Theatre
  { id: 7, text: "Do you quote Shakespeare just to sound deep?", categorySlug: "theatre" },
  { id: 8, text: "Does a spotlight call your name?", categorySlug: "theatre" },
  { id: 9, text: "Do you think breaking the fourth wall should happen IRL?", categorySlug: "theatre" },
  { id: 38, text: "Do you sniff theatre programs like a fine wine?", categorySlug: "theatre" },
  { id: 39, text: "Would you rather be a villain or hero on stage?", categorySlug: "theatre" },
  { id: 40, text: "Do you mouth along with the actors when you know the script?", categorySlug: "theatre" },
  { id: 41, text: "Do you dress up for opening night?", categorySlug: "theatre" },
  { id: 42, text: "Do you feel the urge to give a monologue IRL?", categorySlug: "theatre" },

  // 🏃‍♂️ Sports & Outdoors
  { id: 10, text: "Is your idea of cardio 'running late'?", categorySlug: "sports" },
  { id: 11, text: "Are you outdoorsy or just like drinking wine outside?", categorySlug: "sports" },
  { id: 12, text: "Do you own more activewear than actual workout plans?", categorySlug: "sports" },
  { id: 43, text: "Do you wear athleisure as a lifestyle?", categorySlug: "sports" },
  { id: 44, text: "Would you join a marathon just for the medal?", categorySlug: "sports" },
  { id: 45, text: "Do you scream at the TV during sports?", categorySlug: "sports" },
  { id: 46, text: "Do you secretly Google the rules mid-game?", categorySlug: "sports" },
  { id: 47, text: "Do you prefer sunrise hikes or sunset runs?", categorySlug: "sports" },

  // 🎉 Festivals & Lifestyle
  { id: 13, text: "Would you attend a festival just for the vibes and fairy lights?", categorySlug: "lifestyle" },
  { id: 14, text: "Do you own glitter 'just in case' there's a festival?", categorySlug: "lifestyle" },
  { id: 15, text: "Do you only know the headliner's two most popular songs?", categorySlug: "lifestyle" },
  { id: 48, text: "Do you plan your outfits a month before the festival?", categorySlug: "lifestyle" },
  { id: 49, text: "Would you rather be in the mosh pit or chill zone?", categorySlug: "lifestyle" },
  { id: 50, text: "Do you collect wristbands as trophies?", categorySlug: "lifestyle" },
  { id: 51, text: "Do you chase food trucks more than bands?", categorySlug: "lifestyle" },
  { id: 52, text: "Do you treat festivals as your annual recharge?", categorySlug: "lifestyle" },

  // 💃 Dance
  { id: 16, text: "Do you dance like no one's watching... and hope they aren't?", categorySlug: "dance" },
  { id: 17, text: "Would you join a dance class just to show off on TikTok?", categorySlug: "dance" },
  { id: 18, text: "Do you consider your clubbing moves a form of art?", categorySlug: "dance" },
  { id: 53, text: "Do you spin until you’re dizzy just for fun?", categorySlug: "dance" },
  { id: 54, text: "Would you sign up for salsa after one cocktail?", categorySlug: "dance" },
  { id: 55, text: "Do you secretly rehearse your moves at work?", categorySlug: "dance" },
  { id: 56, text: "Do you follow dance challenges religiously?", categorySlug: "dance" },
  { id: 57, text: "Do you clap after every dance performance?", categorySlug: "dance" },

  // 🖼️ Exhibitions
  { id: 19, text: "Do you pretend to understand abstract art?", categorySlug: "exhibitions" },
  { id: 20, text: "Do you touch the 'do not touch' sign with your eyes?", categorySlug: "exhibitions" },
  { id: 21, text: "Is gallery hopping your version of cardio?", categorySlug: "exhibitions" },
  { id: 58, text: "Do you take photos of every plaque?", categorySlug: "exhibitions" },
  { id: 59, text: "Do you plan your outfit to match the art?", categorySlug: "exhibitions" },
  { id: 60, text: "Would you rather attend a silent opening night or a packed one?", categorySlug: "exhibitions" },
  { id: 61, text: "Do you collect gallery brochures?", categorySlug: "exhibitions" },
  { id: 62, text: "Do you love the gift shop more than the art?", categorySlug: "exhibitions" },

  // 📚 Workshops, Conferences & Classes
  { id: 22, text: "Do you sign up for classes then forget to attend?", categorySlug: "workshops-conferences-classes" },
  { id: 23, text: "Is learning your favourite personality trait?", categorySlug: "workshops-conferences-classes" },
  { id: 24, text: "Would you attend a workshop just for free snacks?", categorySlug: "workshops-conferences-classes" },
  { id: 63, text: "Do you sign up for webinars but never attend?", categorySlug: "workshops-conferences-classes" },
  { id: 64, text: "Do you take notes just for the aesthetic?", categorySlug: "workshops-conferences-classes" },
  { id: 65, text: "Do you network for the free coffee?", categorySlug: "workshops-conferences-classes" },
  { id: 66, text: "Would you teach a class if asked on the spot?", categorySlug: "workshops-conferences-classes" },
  { id: 67, text: "Do you secretly love ice-breaker games?", categorySlug: "workshops-conferences-classes" },

  // 🎶 Musicals
  { id: 25, text: "Do you break into song when life gets dramatic?", categorySlug: "arts-culture-musicals" },
  { id: 26, text: "Do you believe life *should* be a musical?", categorySlug: "arts-culture-musicals" },
  { id: 27, text: "Have you ever belted 'Defying Gravity' alone in your car?", categorySlug: "arts-culture-musicals" },
  { id: 68, text: "Do you cry at the overture?", categorySlug: "arts-culture-musicals" },
  { id: 69, text: "Do you choreograph your commute in your head?", categorySlug: "arts-culture-musicals" },
  { id: 70, text: "Do you belt duets solo?", categorySlug: "arts-culture-musicals" },
  { id: 71, text: "Do you know all the backstage gossip?", categorySlug: "arts-culture-musicals" },
  { id: 72, text: "Do you clap at the big key change?", categorySlug: "arts-culture-musicals" },
];

  const validQuestions = allQuestions
    .map((q) => {
      const category = findCategoryBySlug(q.categorySlug);
      if (!category) {
        console.warn(`Category not found for slug: ${q.categorySlug}`);
        return null;
      }
      return {
        id: q.id,
        text: q.text,
        category: category,
      };
    })
    .filter((q): q is NonNullable<typeof q> => q !== null);

  const shuffled = [...validQuestions].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, Math.min(15, shuffled.length));
};
