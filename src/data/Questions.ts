import { Category } from "@/hooks/useCategories";

export const questions = (categories: Category[]) => {
  const findCategoryBySlug = (slug: string): Category | undefined => {
    return categories.find((c) => c.url_slug === slug);
  };

  const allQuestions = [
    // 🎤 Concerts & Gig Guide (20 questions)
    {
      id: 1,
      text: "Would you wait hours in line for concert tickets?",
      category: findCategoryBySlug("concerts-gig-guide"),
    },
    {
      id: 2,
      text: "Do you sing along loudly at concerts?",
      category: findCategoryBySlug("concerts-gig-guide"),
    },
    {
      id: 3,
      text: "Would you travel to another city for a show?",
      category: findCategoryBySlug("concerts-gig-guide"),
    },
    {
      id: 4,
      text: "Do you get excited when you hear live music?",
      category: findCategoryBySlug("concerts-gig-guide"),
    },
    {
      id: 5,
      text: "Would you buy expensive front-row seats?",
      category: findCategoryBySlug("concerts-gig-guide"),
    },
    {
      id: 6,
      text: "Do you research bands before seeing them live?",
      category: findCategoryBySlug("concerts-gig-guide"),
    },
    {
      id: 7,
      text: "Would you go to a concert alone?",
      category: findCategoryBySlug("concerts-gig-guide"),
    },
    {
      id: 8,
      text: "Do you collect concert merchandise?",
      category: findCategoryBySlug("concerts-gig-guide"),
    },
    {
      id: 9,
      text: "Would you dance at a standing concert?",
      category: findCategoryBySlug("concerts-gig-guide"),
    },
    {
      id: 10,
      text: "Do you prefer intimate venues over large arenas?",
      category: findCategoryBySlug("concerts-gig-guide"),
    },
    {
      id: 11,
      text: "Would you camp out for festival tickets?",
      category: findCategoryBySlug("concerts-gig-guide"),
    },
    {
      id: 12,
      text: "Do you get emotional during live performances?",
      category: findCategoryBySlug("concerts-gig-guide"),
    },
    {
      id: 13,
      text: "Would you join a fan club for early access?",
      category: findCategoryBySlug("concerts-gig-guide"),
    },
    {
      id: 14,
      text: "Do you enjoy discovering new artists at concerts?",
      category: findCategoryBySlug("concerts-gig-guide"),
    },
    {
      id: 15,
      text: "Would you attend multiple shows on the same tour?",
      category: findCategoryBySlug("concerts-gig-guide"),
    },
    {
      id: 16,
      text: "Do you love the energy of live crowds?",
      category: findCategoryBySlug("concerts-gig-guide"),
    },
    {
      id: 17,
      text: "Would you wait for an encore?",
      category: findCategoryBySlug("concerts-gig-guide"),
    },
    {
      id: 18,
      text: "Do you enjoy outdoor music festivals?",
      category: findCategoryBySlug("concerts-gig-guide"),
    },
    {
      id: 19,
      text: "Would you learn an instrument after seeing a great show?",
      category: findCategoryBySlug("concerts-gig-guide"),
    },
    {
      id: 20,
      text: "Do you feel connected to artists during live shows?",
      category: findCategoryBySlug("concerts-gig-guide"),
    },

    // 🎭 Performing Arts (20 questions)
    {
      id: 21,
      text: "Do you enjoy watching live theatre performances?",
      category: findCategoryBySlug("arts"),
    },
    {
      id: 22,
      text: "Would you audition for a community play?",
      category: findCategoryBySlug("arts"),
    },
    {
      id: 23,
      text: "Do you appreciate dramatic storytelling?",
      category: findCategoryBySlug("arts"),
    },
    {
      id: 24,
      text: "Would you attend an experimental art performance?",
      category: findCategoryBySlug("arts"),
    },
    {
      id: 25,
      text: "Do you enjoy watching people express themselves creatively?",
      category: findCategoryBySlug("arts"),
    },
    {
      id: 26,
      text: "Would you support local arts organizations?",
      category: findCategoryBySlug("arts"),
    },
    {
      id: 27,
      text: "Do you find artistic performances inspiring?",
      category: findCategoryBySlug("arts"),
    },
    {
      id: 28,
      text: "Would you attend a poetry reading?",
      category: findCategoryBySlug("arts"),
    },
    {
      id: 29,
      text: "Do you enjoy cultural arts festivals?",
      category: findCategoryBySlug("arts"),
    },
    {
      id: 30,
      text: "Would you take an acting or performance class?",
      category: findCategoryBySlug("arts"),
    },
    {
      id: 31,
      text: "Do you appreciate different artistic styles?",
      category: findCategoryBySlug("arts"),
    },
    {
      id: 32,
      text: "Would you volunteer at an arts event?",
      category: findCategoryBySlug("arts"),
    },
    {
      id: 33,
      text: "Do you enjoy discussing artistic performances afterward?",
      category: findCategoryBySlug("arts"),
    },
    {
      id: 34,
      text: "Would you attend a street performance?",
      category: findCategoryBySlug("arts"),
    },
    {
      id: 35,
      text: "Do you find live performances more engaging than recorded ones?",
      category: findCategoryBySlug("arts"),
    },
    {
      id: 36,
      text: "Would you dress up for a special arts event?",
      category: findCategoryBySlug("arts"),
    },
    {
      id: 37,
      text: "Do you enjoy discovering new artistic talents?",
      category: findCategoryBySlug("arts"),
    },
    {
      id: 38,
      text: "Would you attend an artist's opening night?",
      category: findCategoryBySlug("arts"),
    },
    {
      id: 39,
      text: "Do you appreciate the effort that goes into performances?",
      category: findCategoryBySlug("arts"),
    },
    {
      id: 40,
      text: "Would you recommend arts events to friends?",
      category: findCategoryBySlug("arts"),
    },

    // 🎟️ Theatre (20 questions)
    {
      id: 41,
      text: "Do you enjoy classic theatrical productions?",
      category: findCategoryBySlug("theatre"),
    },
    {
      id: 42,
      text: "Would you attend a Shakespeare performance?",
      category: findCategoryBySlug("theatre"),
    },
    {
      id: 43,
      text: "Do you appreciate good stage acting?",
      category: findCategoryBySlug("theatre"),
    },
    {
      id: 44,
      text: "Would you see the same play multiple times?",
      category: findCategoryBySlug("theatre"),
    },
    {
      id: 45,
      text: "Do you enjoy theatrical comedies?",
      category: findCategoryBySlug("theatre"),
    },
    {
      id: 46,
      text: "Would you attend a dramatic tragedy?",
      category: findCategoryBySlug("theatre"),
    },
    {
      id: 47,
      text: "Do you like getting dressed up for theatre nights?",
      category: findCategoryBySlug("theatre"),
    },
    {
      id: 48,
      text: "Would you join a theatre subscription series?",
      category: findCategoryBySlug("theatre"),
    },
    {
      id: 49,
      text: "Do you enjoy reading play programs?",
      category: findCategoryBySlug("theatre"),
    },
    {
      id: 50,
      text: "Would you participate in a theatre workshop?",
      category: findCategoryBySlug("theatre"),
    },
    {
      id: 51,
      text: "Do you appreciate innovative staging?",
      category: findCategoryBySlug("theatre"),
    },
    {
      id: 52,
      text: "Would you attend a one-person show?",
      category: findCategoryBySlug("theatre"),
    },
    {
      id: 53,
      text: "Do you enjoy intermission discussions?",
      category: findCategoryBySlug("theatre"),
    },
    {
      id: 54,
      text: "Would you support your local theatre company?",
      category: findCategoryBySlug("theatre"),
    },
    {
      id: 55,
      text: "Do you find theatrical performances thought-provoking?",
      category: findCategoryBySlug("theatre"),
    },
    {
      id: 56,
      text: "Would you attend a dinner theatre event?",
      category: findCategoryBySlug("theatre"),
    },
    {
      id: 57,
      text: "Do you enjoy both traditional and modern plays?",
      category: findCategoryBySlug("theatre"),
    },
    {
      id: 58,
      text: "Would you give a standing ovation for great performances?",
      category: findCategoryBySlug("theatre"),
    },
    {
      id: 59,
      text: "Do you appreciate detailed costume and set design?",
      category: findCategoryBySlug("theatre"),
    },
    {
      id: 60,
      text: "Would you attend theatre in different languages?",
      category: findCategoryBySlug("theatre"),
    },

    // 🏃‍♂️ Sports & Outdoors (20 questions)
    {
      id: 61,
      text: "Do you enjoy watching live sports events?",
      category: findCategoryBySlug("sports"),
    },
    {
      id: 62,
      text: "Would you participate in a community sports league?",
      category: findCategoryBySlug("sports"),
    },
    {
      id: 63,
      text: "Do you enjoy outdoor activities and adventures?",
      category: findCategoryBySlug("sports"),
    },
    {
      id: 64,
      text: "Would you attend a major sporting championship?",
      category: findCategoryBySlug("sports"),
    },
    {
      id: 65,
      text: "Do you like trying new physical activities?",
      category: findCategoryBySlug("sports"),
    },
    {
      id: 66,
      text: "Would you join a fitness or running group?",
      category: findCategoryBySlug("sports"),
    },
    {
      id: 67,
      text: "Do you enjoy competitive events?",
      category: findCategoryBySlug("sports"),
    },
    {
      id: 68,
      text: "Would you cheer loudly at sporting events?",
      category: findCategoryBySlug("sports"),
    },
    {
      id: 69,
      text: "Do you like outdoor festivals and activities?",
      category: findCategoryBySlug("sports"),
    },
    {
      id: 70,
      text: "Would you try an adventure sport?",
      category: findCategoryBySlug("sports"),
    },
    {
      id: 71,
      text: "Do you enjoy team-based activities?",
      category: findCategoryBySlug("sports"),
    },
    {
      id: 72,
      text: "Would you attend a sports training workshop?",
      category: findCategoryBySlug("sports"),
    },
    {
      id: 73,
      text: "Do you find physical challenges motivating?",
      category: findCategoryBySlug("sports"),
    },
    {
      id: 74,
      text: "Would you support your local sports teams?",
      category: findCategoryBySlug("sports"),
    },
    {
      id: 75,
      text: "Do you enjoy recreational sports activities?",
      category: findCategoryBySlug("sports"),
    },
    {
      id: 76,
      text: "Would you participate in a charity sports event?",
      category: findCategoryBySlug("sports"),
    },
    {
      id: 77,
      text: "Do you like spending time in nature?",
      category: findCategoryBySlug("sports"),
    },
    {
      id: 78,
      text: "Would you join a hiking or walking club?",
      category: findCategoryBySlug("sports"),
    },
    {
      id: 79,
      text: "Do you enjoy athletic competitions?",
      category: findCategoryBySlug("sports"),
    },
    {
      id: 80,
      text: "Would you attend sports-related social events?",
      category: findCategoryBySlug("sports"),
    },

    // 🎉 Festivals & Lifestyle (20 questions)
    {
      id: 81,
      text: "Do you enjoy attending festivals and celebrations?",
      category: findCategoryBySlug("lifestyle"),
    },
    {
      id: 82,
      text: "Would you spend a weekend at a music festival?",
      category: findCategoryBySlug("lifestyle"),
    },
    {
      id: 83,
      text: "Do you like trying different cultural experiences?",
      category: findCategoryBySlug("lifestyle"),
    },
    {
      id: 84,
      text: "Would you attend a food and wine festival?",
      category: findCategoryBySlug("lifestyle"),
    },
    {
      id: 85,
      text: "Do you enjoy community celebrations?",
      category: findCategoryBySlug("lifestyle"),
    },
    {
      id: 86,
      text: "Would you dress up for a themed festival?",
      category: findCategoryBySlug("lifestyle"),
    },
    {
      id: 87,
      text: "Do you like discovering new lifestyle trends?",
      category: findCategoryBySlug("lifestyle"),
    },
    {
      id: 88,
      text: "Would you attend a wellness or lifestyle expo?",
      category: findCategoryBySlug("lifestyle"),
    },
    {
      id: 89,
      text: "Do you enjoy outdoor lifestyle events?",
      category: findCategoryBySlug("lifestyle"),
    },
    {
      id: 90,
      text: "Would you participate in a cultural festival?",
      category: findCategoryBySlug("lifestyle"),
    },
    {
      id: 91,
      text: "Do you like meeting new people at social events?",
      category: findCategoryBySlug("lifestyle"),
    },
    {
      id: 92,
      text: "Would you attend a craft or makers festival?",
      category: findCategoryBySlug("lifestyle"),
    },
    {
      id: 93,
      text: "Do you enjoy seasonal celebrations?",
      category: findCategoryBySlug("lifestyle"),
    },
    {
      id: 94,
      text: "Would you join a lifestyle-focused community group?",
      category: findCategoryBySlug("lifestyle"),
    },
    {
      id: 95,
      text: "Do you appreciate diverse cultural expressions?",
      category: findCategoryBySlug("lifestyle"),
    },
    {
      id: 96,
      text: "Would you attend a sustainability or eco festival?",
      category: findCategoryBySlug("lifestyle"),
    },
    {
      id: 97,
      text: "Do you enjoy lifestyle and wellness activities?",
      category: findCategoryBySlug("lifestyle"),
    },
    {
      id: 98,
      text: "Would you participate in community lifestyle events?",
      category: findCategoryBySlug("lifestyle"),
    },
    {
      id: 99,
      text: "Do you like exploring different ways of living?",
      category: findCategoryBySlug("lifestyle"),
    },
    {
      id: 100,
      text: "Would you attend a celebration of local culture?",
      category: findCategoryBySlug("lifestyle"),
    },

    // 💃 Dance (20 questions)
    {
      id: 101,
      text: "Do you enjoy watching dance performances?",
      category: findCategoryBySlug("dance"),
    },
    {
      id: 102,
      text: "Would you take a dance class?",
      category: findCategoryBySlug("dance"),
    },
    {
      id: 103,
      text: "Do you like moving to music?",
      category: findCategoryBySlug("dance"),
    },
    {
      id: 104,
      text: "Would you attend a dance competition?",
      category: findCategoryBySlug("dance"),
    },
    {
      id: 105,
      text: "Do you enjoy different styles of dance?",
      category: findCategoryBySlug("dance"),
    },
    {
      id: 106,
      text: "Would you join a social dance group?",
      category: findCategoryBySlug("dance"),
    },
    {
      id: 107,
      text: "Do you find dance performances entertaining?",
      category: findCategoryBySlug("dance"),
    },
    {
      id: 108,
      text: "Would you attend a dance festival?",
      category: findCategoryBySlug("dance"),
    },
    {
      id: 109,
      text: "Do you appreciate the athleticism in dance?",
      category: findCategoryBySlug("dance"),
    },
    {
      id: 110,
      text: "Would you try partner dancing?",
      category: findCategoryBySlug("dance"),
    },
    {
      id: 111,
      text: "Do you enjoy cultural dance performances?",
      category: findCategoryBySlug("dance"),
    },
    {
      id: 112,
      text: "Would you attend a dance workshop?",
      category: findCategoryBySlug("dance"),
    },
    {
      id: 113,
      text: "Do you like expressing yourself through movement?",
      category: findCategoryBySlug("dance"),
    },
    {
      id: 114,
      text: "Would you support local dance companies?",
      category: findCategoryBySlug("dance"),
    },
    {
      id: 115,
      text: "Do you enjoy learning new dance moves?",
      category: findCategoryBySlug("dance"),
    },
    {
      id: 116,
      text: "Would you attend a dance theater production?",
      category: findCategoryBySlug("dance"),
    },
    {
      id: 117,
      text: "Do you find dance emotionally moving?",
      category: findCategoryBySlug("dance"),
    },
    {
      id: 118,
      text: "Would you participate in a community dance event?",
      category: findCategoryBySlug("dance"),
    },
    {
      id: 119,
      text: "Do you appreciate the artistry of dance?",
      category: findCategoryBySlug("dance"),
    },
    {
      id: 120,
      text: "Would you attend dance performances regularly?",
      category: findCategoryBySlug("dance"),
    },

    // 🖼️ Exhibitions (20 questions)
    {
      id: 121,
      text: "Do you enjoy visiting art galleries and museums?",
      category: findCategoryBySlug("exhibitions"),
    },
    {
      id: 122,
      text: "Would you attend a special art exhibition opening?",
      category: findCategoryBySlug("exhibitions"),
    },
    {
      id: 123,
      text: "Do you find visual art inspiring?",
      category: findCategoryBySlug("exhibitions"),
    },
    {
      id: 124,
      text: "Would you spend hours exploring an exhibition?",
      category: findCategoryBySlug("exhibitions"),
    },
    {
      id: 125,
      text: "Do you enjoy learning about different artists?",
      category: findCategoryBySlug("exhibitions"),
    },
    {
      id: 126,
      text: "Would you attend an interactive art installation?",
      category: findCategoryBySlug("exhibitions"),
    },
    {
      id: 127,
      text: "Do you appreciate various art styles and mediums?",
      category: findCategoryBySlug("exhibitions"),
    },
    {
      id: 128,
      text: "Would you visit multiple galleries in one day?",
      category: findCategoryBySlug("exhibitions"),
    },
    {
      id: 129,
      text: "Do you enjoy photography exhibitions?",
      category: findCategoryBySlug("exhibitions"),
    },
    {
      id: 130,
      text: "Would you attend a sculpture or installation show?",
      category: findCategoryBySlug("exhibitions"),
    },
    {
      id: 131,
      text: "Do you like discovering emerging artists?",
      category: findCategoryBySlug("exhibitions"),
    },
    {
      id: 132,
      text: "Would you join a gallery membership program?",
      category: findCategoryBySlug("exhibitions"),
    },
    {
      id: 133,
      text: "Do you enjoy cultural and historical exhibitions?",
      category: findCategoryBySlug("exhibitions"),
    },
    {
      id: 134,
      text: "Would you attend artist talks or gallery tours?",
      category: findCategoryBySlug("exhibitions"),
    },
    {
      id: 135,
      text: "Do you appreciate contemporary art?",
      category: findCategoryBySlug("exhibitions"),
    },
    {
      id: 136,
      text: "Would you travel to see a special exhibition?",
      category: findCategoryBySlug("exhibitions"),
    },
    {
      id: 137,
      text: "Do you enjoy exploring different exhibition themes?",
      category: findCategoryBySlug("exhibitions"),
    },
    {
      id: 138,
      text: "Would you support local artists and galleries?",
      category: findCategoryBySlug("exhibitions"),
    },
    {
      id: 139,
      text: "Do you find exhibitions thought-provoking?",
      category: findCategoryBySlug("exhibitions"),
    },
    {
      id: 140,
      text: "Would you attend art-related social events?",
      category: findCategoryBySlug("exhibitions"),
    },

    // 📚 Workshops, Conferences & Classes (20 questions)
    {
      id: 141,
      text: "Do you enjoy learning new skills and knowledge?",
      category: findCategoryBySlug("workshops-conferences-classes"),
    },
    {
      id: 142,
      text: "Would you attend a professional development workshop?",
      category: findCategoryBySlug("workshops-conferences-classes"),
    },
    {
      id: 143,
      text: "Do you like participating in educational events?",
      category: findCategoryBySlug("workshops-conferences-classes"),
    },
    {
      id: 144,
      text: "Would you join a specialized training course?",
      category: findCategoryBySlug("workshops-conferences-classes"),
    },
    {
      id: 145,
      text: "Do you enjoy meeting experts in various fields?",
      category: findCategoryBySlug("workshops-conferences-classes"),
    },
    {
      id: 146,
      text: "Would you attend a creative skills workshop?",
      category: findCategoryBySlug("workshops-conferences-classes"),
    },
    {
      id: 147,
      text: "Do you appreciate hands-on learning experiences?",
      category: findCategoryBySlug("workshops-conferences-classes"),
    },
    {
      id: 148,
      text: "Would you participate in a weekend intensive course?",
      category: findCategoryBySlug("workshops-conferences-classes"),
    },
    {
      id: 149,
      text: "Do you enjoy networking with like-minded people?",
      category: findCategoryBySlug("workshops-conferences-classes"),
    },
    {
      id: 150,
      text: "Would you attend an industry conference?",
      category: findCategoryBySlug("workshops-conferences-classes"),
    },
    {
      id: 151,
      text: "Do you like expanding your knowledge base?",
      category: findCategoryBySlug("workshops-conferences-classes"),
    },
    {
      id: 152,
      text: "Would you join a study group or learning circle?",
      category: findCategoryBySlug("workshops-conferences-classes"),
    },
    {
      id: 153,
      text: "Do you enjoy interactive learning sessions?",
      category: findCategoryBySlug("workshops-conferences-classes"),
    },
    {
      id: 154,
      text: "Would you attend a personal development seminar?",
      category: findCategoryBySlug("workshops-conferences-classes"),
    },
    {
      id: 155,
      text: "Do you appreciate expert-led discussions?",
      category: findCategoryBySlug("workshops-conferences-classes"),
    },
    {
      id: 156,
      text: "Would you participate in a skill-sharing event?",
      category: findCategoryBySlug("workshops-conferences-classes"),
    },
    {
      id: 157,
      text: "Do you enjoy collaborative learning environments?",
      category: findCategoryBySlug("workshops-conferences-classes"),
    },
    {
      id: 158,
      text: "Would you attend a masterclass with renowned experts?",
      category: findCategoryBySlug("workshops-conferences-classes"),
    },
    {
      id: 159,
      text: "Do you like gaining practical skills and insights?",
      category: findCategoryBySlug("workshops-conferences-classes"),
    },
    {
      id: 160,
      text: "Would you join a continuous learning program?",
      category: findCategoryBySlug("workshops-conferences-classes"),
    },

    // 🎶 Musicals (20 questions)
    {
      id: 161,
      text: "Do you enjoy musical theatre performances?",
      category: findCategoryBySlug("arts-culture-musicals"),
    },
    {
      id: 162,
      text: "Would you attend a Broadway-style show?",
      category: findCategoryBySlug("arts-culture-musicals"),
    },
    {
      id: 163,
      text: "Do you like stories told through song?",
      category: findCategoryBySlug("arts-culture-musicals"),
    },
    {
      id: 164,
      text: "Would you sing along to familiar musical numbers?",
      category: findCategoryBySlug("arts-culture-musicals"),
    },
    {
      id: 165,
      text: "Do you appreciate elaborate musical productions?",
      category: findCategoryBySlug("arts-culture-musicals"),
    },
    {
      id: 166,
      text: "Would you attend a local community musical?",
      category: findCategoryBySlug("arts-culture-musicals"),
    },
    {
      id: 167,
      text: "Do you enjoy both classic and modern musicals?",
      category: findCategoryBySlug("arts-culture-musicals"),
    },
    {
      id: 168,
      text: "Would you see the same musical multiple times?",
      category: findCategoryBySlug("arts-culture-musicals"),
    },
    {
      id: 169,
      text: "Do you find musical performances uplifting?",
      category: findCategoryBySlug("arts-culture-musicals"),
    },
    {
      id: 170,
      text: "Would you attend a musical theatre festival?",
      category: findCategoryBySlug("arts-culture-musicals"),
    },
    {
      id: 171,
      text: "Do you appreciate the combination of music and drama?",
      category: findCategoryBySlug("arts-culture-musicals"),
    },
    {
      id: 172,
      text: "Would you take part in a musical theatre workshop?",
      category: findCategoryBySlug("arts-culture-musicals"),
    },
    {
      id: 173,
      text: "Do you enjoy the spectacle of musical productions?",
      category: findCategoryBySlug("arts-culture-musicals"),
    },
    {
      id: 174,
      text: "Would you support your local musical theatre group?",
      category: findCategoryBySlug("arts-culture-musicals"),
    },
    {
      id: 175,
      text: "Do you find musical storytelling engaging?",
      category: findCategoryBySlug("arts-culture-musicals"),
    },
    {
      id: 176,
      text: "Would you attend a musical theatre masterclass?",
      category: findCategoryBySlug("arts-culture-musicals"),
    },
    {
      id: 177,
      text: "Do you enjoy the energy of live musical performances?",
      category: findCategoryBySlug("arts-culture-musicals"),
    },
    {
      id: 178,
      text: "Would you plan a trip around seeing musicals?",
      category: findCategoryBySlug("arts-culture-musicals"),
    },
    {
      id: 179,
      text: "Do you appreciate the talent in musical theatre?",
      category: findCategoryBySlug("arts-culture-musicals"),
    },
    {
      id: 180,
      text: "Would you recommend great musicals to friends?",
      category: findCategoryBySlug("arts-culture-musicals"),
    },
  ];

  const validQuestions = allQuestions
    .filter((q) => q.category !== undefined)
    .map((q) => ({
      id: q.id,
      text: q.text,
      category: q.category!,
    }));

  const shuffled = [...validQuestions].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, Math.min(30, shuffled.length));
};
