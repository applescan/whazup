import { Category } from "@/hooks/useCategories";

export const questions = (categories: Category[]) => {
  const findCategoryBySlug = (slug: string): Category | undefined => {
    return categories.find((c) => c.url_slug === slug);
  };

  const allQuestions = [
    // 🎤 Concerts & Gig Guide (15 questions)
    {
      id: 1,
      text: "Would you sell your soul for front-row concert tickets?",
      categorySlug: "concerts-gig-guide",
    },
    {
      id: 2,
      text: "Do your neighbours secretly hate your shower singing?",
      categorySlug: "concerts-gig-guide",
    },
    {
      id: 3,
      text: "You hear live music nearby. Are you running toward it?",
      categorySlug: "concerts-gig-guide",
    },
    {
      id: 28,
      text: "Do you stalk setlists online before the show?",
      categorySlug: "concerts-gig-guide",
    },
    {
      id: 29,
      text: "Do you judge people who film the whole concert?",
      categorySlug: "concerts-gig-guide",
    },
    {
      id: 30,
      text: "Would you camp overnight for a ticket drop?",
      categorySlug: "concerts-gig-guide",
    },
    {
      id: 31,
      text: "Do you buy merch even if you're broke?",
      categorySlug: "concerts-gig-guide",
    },
    {
      id: 32,
      text: "Do you secretly hope for an encore every time?",
      categorySlug: "concerts-gig-guide",
    },
    {
      id: 101,
      text: "Do you arrive early just to get the perfect spot?",
      categorySlug: "concerts-gig-guide",
    },
    {
      id: 102,
      text: "Is your Spotify wrapped basically your life story?",
      categorySlug: "concerts-gig-guide",
    },
    {
      id: 103,
      text: "Do you know all the band members' birthdays?",
      categorySlug: "concerts-gig-guide",
    },
    {
      id: 104,
      text: "Would you follow your favorite band on tour?",
      categorySlug: "concerts-gig-guide",
    },
    {
      id: 105,
      text: "Do you get emotional during guitar solos?",
      categorySlug: "concerts-gig-guide",
    },
    {
      id: 106,
      text: "Is live music the reason you get out of bed?",
      categorySlug: "concerts-gig-guide",
    },
    {
      id: 107,
      text: "Do you collect concert posters like trophies?",
      categorySlug: "concerts-gig-guide",
    },

    // 🎭 Performing Arts (15 questions)
    {
      id: 4,
      text: "Do you cry at musicals and pretend it's just allergies?",
      categorySlug: "arts",
    },
    {
      id: 5,
      text: "Do you clap at the end of movies out of habit?",
      categorySlug: "arts",
    },
    {
      id: 6,
      text: "Is dramatic lighting your love language?",
      categorySlug: "arts",
    },
    {
      id: 33,
      text: "Do you analyze stage props like a detective?",
      categorySlug: "arts",
    },
    {
      id: 34,
      text: "Do you secretly wish for a standing ovation at work?",
      categorySlug: "arts",
    },
    {
      id: 35,
      text: "Would you rather be in the orchestra pit than the audience?",
      categorySlug: "arts",
    },
    {
      id: 36,
      text: "Do you compare real life to dramatic plot twists?",
      categorySlug: "arts",
    },
    {
      id: 37,
      text: "Does stage makeup fascinate you?",
      categorySlug: "arts",
    },
    {
      id: 108,
      text: "Do you practice your acceptance speech in the mirror?",
      categorySlug: "arts",
    },
    {
      id: 109,
      text: "Would you audition for a role you've never heard of?",
      categorySlug: "arts",
    },
    {
      id: 110,
      text: "Do you read the program cover to cover?",
      categorySlug: "arts",
    },
    {
      id: 111,
      text: "Is intermission your favorite part for the discussions?",
      categorySlug: "arts",
    },
    {
      id: 112,
      text: "Do you dress up for the theatre like it's 1920?",
      categorySlug: "arts",
    },
    {
      id: 113,
      text: "Would you volunteer just to be backstage?",
      categorySlug: "arts",
    },
    {
      id: 114,
      text: "Do you know the difference between upstage and downstage?",
      categorySlug: "arts",
    },

    // 🎟️ Theatre (15 questions)
    {
      id: 7,
      text: "Do you quote Shakespeare just to sound deep?",
      categorySlug: "theatre",
    },
    {
      id: 8,
      text: "Does a spotlight call your name?",
      categorySlug: "theatre",
    },
    {
      id: 9,
      text: "Do you think breaking the fourth wall should happen IRL?",
      categorySlug: "theatre",
    },
    {
      id: 38,
      text: "Do you sniff theatre programs like a fine wine?",
      categorySlug: "theatre",
    },
    {
      id: 39,
      text: "Would you rather be a villain or hero on stage?",
      categorySlug: "theatre",
    },
    {
      id: 40,
      text: "Do you mouth along when you know the script?",
      categorySlug: "theatre",
    },
    {
      id: 41,
      text: "Do you dress up for opening night?",
      categorySlug: "theatre",
    },
    {
      id: 42,
      text: "Do you feel the urge to give a monologue IRL?",
      categorySlug: "theatre",
    },
    {
      id: 115,
      text: "Do you have strong opinions about method acting?",
      categorySlug: "theatre",
    },
    {
      id: 116,
      text: "Would you rather have box seats or be on stage?",
      categorySlug: "theatre",
    },
    {
      id: 117,
      text: "Do you judge productions by their costume design?",
      categorySlug: "theatre",
    },
    {
      id: 118,
      text: "Is the curtain call your favorite moment?",
      categorySlug: "theatre",
    },
    {
      id: 119,
      text: "Do you know all the Tony winners by heart?",
      categorySlug: "theatre",
    },
    {
      id: 120,
      text: "Would you camp out for last-minute tickets?",
      categorySlug: "theatre",
    },
    {
      id: 121,
      text: "Do you prefer intimate black box or grand stages?",
      categorySlug: "theatre",
    },

    // 🏃‍♂️ Sports & Outdoors (15 questions)
    {
      id: 10,
      text: "Do you get excited about sporting events?",
      categorySlug: "sports",
    },
    {
      id: 11,
      text: "Do you enjoy outdoor activities?",
      categorySlug: "sports",
    },
    {
      id: 12,
      text: "Do you love wearing activewear?",
      categorySlug: "sports",
    },
    {
      id: 43,
      text: "Do you wear athleisure regularly?",
      categorySlug: "sports",
    },
    {
      id: 44,
      text: "Would you join a marathon?",
      categorySlug: "sports",
    },
    {
      id: 45,
      text: "Do you get emotional during sports games?",
      categorySlug: "sports",
    },
    {
      id: 46,
      text: "Do you look up sports rules when confused?",
      categorySlug: "sports",
    },
    {
      id: 47,
      text: "Do you enjoy early morning workouts?",
      categorySlug: "sports",
    },
    {
      id: 122,
      text: "Do you track your fitness progress?",
      categorySlug: "sports",
    },
    {
      id: 123,
      text: "Do you share your workout achievements?",
      categorySlug: "sports",
    },
    {
      id: 124,
      text: "Do you prefer watching sports over playing them?",
      categorySlug: "sports",
    },
    {
      id: 125,
      text: "Do you have favorite sports teams?",
      categorySlug: "sports",
    },
    {
      id: 126,
      text: "Are you very loyal to your sports teams?",
      categorySlug: "sports",
    },
    {
      id: 127,
      text: "Do you plan trips around sporting events?",
      categorySlug: "sports",
    },
    {
      id: 128,
      text: "Would you try an extreme sport?",
      categorySlug: "sports",
    },

    // 🎉 Festivals & Lifestyle (15 questions)
    {
      id: 13,
      text: "Would you attend a festival just for the vibes and fairy lights?",
      categorySlug: "lifestyle",
    },
    {
      id: 14,
      text: "Do you own glitter 'just in case' there's a festival?",
      categorySlug: "lifestyle",
    },
    {
      id: 15,
      text: "Do you only know the headliner's two most popular songs?",
      categorySlug: "lifestyle",
    },
    {
      id: 48,
      text: "Do you plan your outfits a month before the festival?",
      categorySlug: "lifestyle",
    },
    {
      id: 49,
      text: "Would you rather be in the mosh pit or chill zone?",
      categorySlug: "lifestyle",
    },
    {
      id: 50,
      text: "Do you collect wristbands as trophies?",
      categorySlug: "lifestyle",
    },
    {
      id: 51,
      text: "Do you chase food trucks more than bands?",
      categorySlug: "lifestyle",
    },
    {
      id: 52,
      text: "Do you treat festivals as your annual recharge?",
      categorySlug: "lifestyle",
    },
    {
      id: 129,
      text: "Is festival fashion more important than the music?",
      categorySlug: "lifestyle",
    },
    {
      id: 130,
      text: "Do you make friends in the porta-potty line?",
      categorySlug: "lifestyle",
    },
    {
      id: 131,
      text: "Would you sleep in a tent for three days for good music?",
      categorySlug: "lifestyle",
    },
    {
      id: 132,
      text: "Do you document every festival moment on social media?",
      categorySlug: "lifestyle",
    },
    {
      id: 133,
      text: "Is the festival lineup announcement day a holiday for you?",
      categorySlug: "lifestyle",
    },
    {
      id: 134,
      text: "Do you plan your year around festival seasons?",
      categorySlug: "lifestyle",
    },
    {
      id: 135,
      text: "Would you travel internationally for the perfect festival?",
      categorySlug: "lifestyle",
    },

    // 💃 Dance (15 questions)
    {
      id: 16,
      text: "Do you dance like no one's watching... and hope they aren't?",
      categorySlug: "dance",
    },
    {
      id: 17,
      text: "Would you join a dance class just to show off on TikTok?",
      categorySlug: "dance",
    },
    {
      id: 18,
      text: "Do you consider your clubbing moves a form of art?",
      categorySlug: "dance",
    },
    {
      id: 53,
      text: "Do you spin until you're dizzy just for fun?",
      categorySlug: "dance",
    },
    {
      id: 54,
      text: "Would you sign up for salsa after one cocktail?",
      categorySlug: "dance",
    },
    {
      id: 55,
      text: "Do you secretly rehearse your moves at work?",
      categorySlug: "dance",
    },
    {
      id: 56,
      text: "Do you follow dance challenges religiously?",
      categorySlug: "dance",
    },
    {
      id: 57,
      text: "Do you clap after every dance performance?",
      categorySlug: "dance",
    },
    {
      id: 136,
      text: "Is your kitchen your personal dance studio?",
      categorySlug: "dance",
    },
    {
      id: 137,
      text: "Do you judge dance shows from your couch?",
      categorySlug: "dance",
    },
    {
      id: 138,
      text: "Would you rather lead or follow in partner dancing?",
      categorySlug: "dance",
    },
    {
      id: 139,
      text: "Do you have a signature dance move?",
      categorySlug: "dance",
    },
    {
      id: 140,
      text: "Is rhythm something you're born with or can learn?",
      categorySlug: "dance",
    },
    {
      id: 141,
      text: "Do you practice dance moves in elevator mirrors?",
      categorySlug: "dance",
    },
    {
      id: 142,
      text: "Would you perform solo at a talent show?",
      categorySlug: "dance",
    },

    // 🖼️ Exhibitions (15 questions)
    {
      id: 19,
      text: "Do you enjoy visiting art exhibitions?",
      categorySlug: "exhibitions",
    },
    {
      id: 20,
      text: "Do you find abstract art intriguing?",
      categorySlug: "exhibitions",
    },
    {
      id: 21,
      text: "Do you enjoy spending time in galleries?",
      categorySlug: "exhibitions",
    },
    {
      id: 58,
      text: "Do you like reading about the artwork?",
      categorySlug: "exhibitions",
    },
    {
      id: 59,
      text: "Do you dress up for gallery visits?",
      categorySlug: "exhibitions",
    },
    {
      id: 60,
      text: "Do you prefer quieter gallery experiences?",
      categorySlug: "exhibitions",
    },
    {
      id: 61,
      text: "Do you collect art-related materials?",
      categorySlug: "exhibitions",
    },
    {
      id: 62,
      text: "Do you enjoy browsing museum gift shops?",
      categorySlug: "exhibitions",
    },
    {
      id: 143,
      text: "Do you feel peaceful in gallery spaces?",
      categorySlug: "exhibitions",
    },
    {
      id: 144,
      text: "Do you have strong opinions about art?",
      categorySlug: "exhibitions",
    },
    {
      id: 145,
      text: "Do you research exhibitions before visiting?",
      categorySlug: "exhibitions",
    },
    {
      id: 146,
      text: "Would you buy art for your home?",
      categorySlug: "exhibitions",
    },
    {
      id: 147,
      text: "Do you notice gallery presentation details?",
      categorySlug: "exhibitions",
    },
    {
      id: 148,
      text: "Do you enjoy gallery opening events?",
      categorySlug: "exhibitions",
    },
    {
      id: 149,
      text: "Do you follow artists you discover?",
      categorySlug: "exhibitions",
    },

    // 📚 Workshops, Conferences & Classes (15 questions)
    {
      id: 22,
      text: "Do you enjoy attending workshops and classes?",
      categorySlug: "workshops-conferences-classes",
    },
    {
      id: 23,
      text: "Do you love learning new things?",
      categorySlug: "workshops-conferences-classes",
    },
    {
      id: 24,
      text: "Do you attend events for networking opportunities?",
      categorySlug: "workshops-conferences-classes",
    },
    {
      id: 63,
      text: "Do you sign up for webinars regularly?",
      categorySlug: "workshops-conferences-classes",
    },
    {
      id: 64,
      text: "Do you like taking detailed notes?",
      categorySlug: "workshops-conferences-classes",
    },
    {
      id: 65,
      text: "Do you enjoy meeting new people at events?",
      categorySlug: "workshops-conferences-classes",
    },
    {
      id: 66,
      text: "Would you be comfortable teaching others?",
      categorySlug: "workshops-conferences-classes",
    },
    {
      id: 67,
      text: "Do you enjoy group activities and games?",
      categorySlug: "workshops-conferences-classes",
    },
    {
      id: 150,
      text: "Do you like earning certificates and credentials?",
      categorySlug: "workshops-conferences-classes",
    },
    {
      id: 151,
      text: "Do you actively build your professional skills?",
      categorySlug: "workshops-conferences-classes",
    },
    {
      id: 152,
      text: "Do you ask questions during presentations?",
      categorySlug: "workshops-conferences-classes",
    },
    {
      id: 153,
      text: "Do you prefer interactive learning experiences?",
      categorySlug: "workshops-conferences-classes",
    },
    {
      id: 154,
      text: "Do you use learning to explore new interests?",
      categorySlug: "workshops-conferences-classes",
    },
    {
      id: 155,
      text: "Do you enjoy weekend educational events?",
      categorySlug: "workshops-conferences-classes",
    },
    {
      id: 156,
      text: "Do you appreciate well-designed presentations?",
      categorySlug: "workshops-conferences-classes",
    },

    // 🎶 Musicals (15 questions)
    {
      id: 25,
      text: "Do you break into song when life gets dramatic?",
      categorySlug: "arts-culture-musicals",
    },
    {
      id: 26,
      text: "Do you believe life *should* be a musical?",
      categorySlug: "arts-culture-musicals",
    },
    {
      id: 27,
      text: "Have you ever belted 'Defying Gravity' alone in your car?",
      categorySlug: "arts-culture-musicals",
    },
    {
      id: 68,
      text: "Do you cry at the overture?",
      categorySlug: "arts-culture-musicals",
    },
    {
      id: 69,
      text: "Do you choreograph your commute in your head?",
      categorySlug: "arts-culture-musicals",
    },
    {
      id: 70,
      text: "Do you belt duets solo?",
      categorySlug: "arts-culture-musicals",
    },
    {
      id: 71,
      text: "Do you know all the backstage gossip?",
      categorySlug: "arts-culture-musicals",
    },
    {
      id: 72,
      text: "Do you clap at the big key change?",
      categorySlug: "arts-culture-musicals",
    },
    {
      id: 157,
      text: "Is your shower playlist all show tunes?",
      categorySlug: "arts-culture-musicals",
    },
    {
      id: 158,
      text: "Do you know the original cast better than your family?",
      categorySlug: "arts-culture-musicals",
    },
    {
      id: 159,
      text: "Would you audition for a musical you've never heard of?",
      categorySlug: "arts-culture-musicals",
    },
    {
      id: 160,
      text: "Do you judge movie musicals against Broadway versions?",
      categorySlug: "arts-culture-musicals",
    },
    {
      id: 161,
      text: "Is your dream vacation a Broadway week in NYC?",
      categorySlug: "arts-culture-musicals",
    },
    {
      id: 162,
      text: "Do you own multiple cast recordings of the same show?",
      categorySlug: "arts-culture-musicals",
    },
    {
      id: 163,
      text: "Would you camp out for lottery tickets?",
      categorySlug: "arts-culture-musicals",
    },
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

  return shuffled.slice(0, Math.min(25, shuffled.length));
};
