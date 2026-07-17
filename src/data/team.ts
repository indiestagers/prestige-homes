export type TeamMember = {
  name: string;
  role: string;
  image: string;
  bio?: string;
  email?: string;
  phone?: string;
};

export const team: TeamMember[] = [
  {
    name: "Luis Matos",
    role: "Broker/Owner",
    image: "/team/luis-matos.jpg",
    bio: "Luis founded Prestige Florida Homes Realty to bring concierge-level service to buyers and sellers across North Port and greater Florida. Built on discretion, integrity, and an unwavering standard of excellence, the firm reflects his belief that true luxury lives in the details.",
    email: "luismatosthebroker@gmail.com",
    phone: "913-201-3242",
  },
  {
    name: "Janice Santiago",
    role: "Director of Business Operations",
    image: "/team/janice-santiago.jpg",
    bio: "The quiet force behind the firm's seamless client experience. A bachelor's in Business Administration, paired with a distinguished record in leadership and community service, lends rare poise to her work. Discerning, meticulous, and devoted to excellence, she ensures every detail and every interaction reflects the refined standard our clientele expect.",
  },
  {
    name: "Lisa Alvarez",
    role: "Licensed Realtor®",
    image: "/team/lisa-alvarez.jpg",
    bio: 'Based in Ocala, the "Horse Capital of the World," Lisa offers concierge service from the Gulf Coast through Florida\'s equestrian heartland. She serves discerning families, seasonal residents, and equestrian professionals who expect a home as refined as their lifestyle.',
  },
  {
    name: "Rodrigo Pulido",
    role: "Licensed Realtor®",
    image: "/team/rodrigo-pulido.jpg",
    bio: "Rodrigo Pulido is a licensed Realtor® serving distinguished clients across Florida, Kansas, and Missouri. Built on discretion, integrity, and bespoke solutions, his practice guides buyers, investors, and families through every acquisition, sale, or relocation with quiet confidence.",
  },
];
