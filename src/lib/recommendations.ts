export type StreamingService = "netflix" | "prime" | "hbo" | "apple"
export type RecommendationType = "series" | "anime" | "movie"
export type RecommendationGroup = RecommendationType | "plan"
export type RecommendationStatus = "watching" | "dropped"

export type Genre =
  | "Action"
  | "Adventure"
  | "Anime"
  | "Comedy"
  | "Crime"
  | "Drama"
  | "Fantasy"
  | "Horror"
  | "Mystery"
  | "Romance"
  | "Sci-fi"
  | "Thriller"

export type Recommendation = {
  id: number
  title: string
  type: RecommendationType
  genres: Genre[]
  service?: StreamingService
  status?: RecommendationStatus
  planned?: true
  progress?: string
  badges?: string[]
}

type RecommendationSeed = Omit<Recommendation, "id">
type RecommendationDetails = Omit<
  RecommendationSeed,
  "title" | "type" | "genres"
>

function title(
  name: string,
  type: RecommendationType,
  genres: Genre[],
  details: RecommendationDetails = {}
): RecommendationSeed {
  return { title: name, type, genres, ...details }
}

const series: RecommendationSeed[] = [
  title("Prodigal Son", "series", ["Crime", "Thriller"], {
    status: "watching",
    progress: "Season 1 · Episode 9",
  }),
  title("Jack Ryan", "series", ["Action", "Thriller"], { service: "prime" }),
  title("Person of Interest", "series", ["Crime", "Sci-fi"]),
  title("Legion", "series", ["Sci-fi", "Drama"], { progress: "Season 1" }),
  title("Silo", "series", ["Sci-fi", "Mystery"], {
    service: "apple",
    badges: ["Editor’s choice", "2026 top 10"],
  }),
  title("Pluribus", "series", ["Sci-fi", "Drama"], {
    service: "apple",
    progress: "Season 1",
  }),
  title("The Mentalist", "series", ["Crime", "Mystery"], {
    badges: ["2026 top 10"],
  }),
  title("The Leftovers", "series", ["Drama", "Mystery"], {
    service: "hbo",
    badges: ["2026 top 10"],
  }),
  title("Fringe", "series", ["Sci-fi", "Mystery"]),
  title("Friends", "series", ["Comedy", "Romance"]),
  title("Spider-Noir", "series", ["Action", "Crime"]),
  title("The Pitt", "series", ["Drama"], { service: "hbo" }),
  title("Young Sherlock", "series", ["Mystery", "Adventure"]),
  title("Fallout", "series", ["Sci-fi", "Adventure"], {
    service: "prime",
    badges: ["2026 top 10"],
  }),
  title("House of the Dragon", "series", ["Fantasy", "Drama"], {
    service: "hbo",
  }),
  title("A Knight of the Seven Kingdoms", "series", ["Fantasy", "Adventure"], {
    service: "hbo",
  }),
  title("The White Lotus", "series", ["Drama", "Comedy"], { service: "hbo" }),
  title("The Boys", "series", ["Action", "Comedy"], { service: "prime" }),
  title("Peacemaker", "series", ["Action", "Comedy"], { service: "hbo" }),
  title("Dune: Prophecy", "series", ["Sci-fi", "Drama"], { service: "hbo" }),
  title("The 100", "series", ["Sci-fi", "Drama"], {
    badges: ["Editor’s choice", "All-time top 10"],
  }),
  title("The Expanse", "series", ["Sci-fi", "Drama"], { service: "prime" }),
  title("Dark", "series", ["Sci-fi", "Mystery"], {
    service: "netflix",
    badges: ["Editor’s choice", "All-time top 5"],
  }),
  title("Altered Carbon", "series", ["Sci-fi", "Thriller"], {
    service: "netflix",
    badges: ["All-time top 20"],
  }),
  title("Homeland", "series", ["Thriller", "Drama"], {
    badges: ["All-time top 20"],
  }),
  title("Seinfeld", "series", ["Comedy"]),
  title("Malcolm in the Middle", "series", ["Comedy"], {
    service: "netflix",
    badges: ["Netflix US"],
  }),
  title("The Middle", "series", ["Comedy"]),
  title("Jujutsu Kaisen", "anime", ["Anime", "Action"], {
    badges: ["2026 top 10"],
  }),
  title("The Amazing Digital Circus", "series", ["Comedy", "Fantasy"], {
    service: "netflix",
    badges: ["Editor’s choice"],
  }),
  title("The Wonderfools", "series", ["Fantasy", "Comedy"], {
    service: "netflix",
    status: "dropped",
  }),
  title("The Umbrella Academy", "series", ["Action", "Fantasy"], {
    service: "netflix",
  }),
  title("Parasyte: The Grey", "series", ["Horror", "Sci-fi"], {
    service: "netflix",
  }),
  title("Suits", "series", ["Drama", "Comedy"]),
  title("House", "series", ["Drama"], {
    badges: ["Editor’s choice", "All-time top 20"],
  }),
  title("Arrested Development", "series", ["Comedy"]),
  title("Designated Survivor", "series", ["Thriller", "Drama"]),
  title("The Resident", "series", ["Drama"]),
  title("Squid Game", "series", ["Thriller", "Drama"], { service: "netflix" }),
  title("Blue Eye Samurai", "series", ["Action", "Drama"], { service: "netflix" }),
  title("The Night Agent", "series", ["Thriller", "Action"], {
    service: "netflix",
    badges: ["Editor’s choice"],
  }),
  title("The Gentlemen", "series", ["Crime", "Comedy"], { service: "netflix" }),
  title("Trigger", "series", ["Action", "Thriller"], { service: "netflix" }),
  title("Love, Death & Robots", "series", ["Sci-fi", "Action"], {
    service: "netflix",
  }),
  title("Rick and Morty", "series", ["Comedy", "Sci-fi"]),
  title("Ted", "series", ["Comedy"], { progress: "Season 1 only" }),
  title("Lucifer", "series", ["Fantasy", "Crime"], {
    service: "netflix",
    badges: ["All-time top 20"],
  }),
  title("Shameless", "series", ["Comedy", "Drama"]),
  title("House of Cards", "series", ["Drama", "Thriller"], {
    service: "netflix",
    badges: ["Netflix original", "All-time top 20"],
  }),
  title("Devil May Cry", "anime", ["Anime", "Action"], {
    service: "netflix",
    badges: ["All-time top 30"],
  }),
  title("Black Mirror", "series", ["Sci-fi", "Drama"], {
    service: "netflix",
    badges: ["All-time top 20"],
  }),
  title("One Piece", "anime", ["Anime", "Adventure"], {
    badges: ["Peak anime", "No. 1"],
  }),
  title("3 Body Problem", "series", ["Sci-fi", "Mystery"], {
    service: "netflix",
  }),
  title("Alice in Borderland", "series", ["Thriller", "Sci-fi"], {
    service: "netflix",
    progress: "Seasons 1–2",
    badges: ["Editor’s choice"],
  }),
  title("Reply 1988", "series", ["Drama", "Comedy"], {
    badges: ["Editor’s choice"],
  }),
  title("Lupin", "series", ["Crime", "Mystery"], { service: "netflix" }),
  title("Atypical", "series", ["Comedy", "Drama"], { service: "netflix" }),
  title("Special Ops: Lioness", "series", ["Action", "Thriller"]),
  title("Inside Job", "series", ["Comedy", "Sci-fi"], { service: "netflix" }),
  title("All of Us Are Dead", "series", ["Horror", "Thriller"], {
    service: "netflix",
  }),
  title("Supacell", "series", ["Sci-fi", "Action"], {
    service: "netflix",
    badges: ["Fun watch"],
  }),
  title("Last Samurai Standing", "series", ["Action", "Drama"], {
    service: "netflix",
  }),
  title("Teen Wolf", "series", ["Fantasy", "Drama"], {
    badges: ["Editor’s choice"],
  }),
  title("GLOW", "series", ["Comedy", "Drama"], { service: "netflix" }),
  title("House of Guinness", "series", ["Drama"], { service: "netflix" }),
  title("Jupiter’s Legacy", "series", ["Action", "Fantasy"], {
    service: "netflix",
  }),
  title("The Rain", "series", ["Sci-fi", "Thriller"], { service: "netflix" }),
  title("The Empress", "series", ["Drama", "Romance"], { service: "netflix" }),
  title("Killing Eve", "series", ["Crime", "Thriller"], {
    badges: ["All-time top 20"],
  }),
  title("Better Call Saul", "series", ["Crime", "Drama"], {
    badges: ["Editor’s choice", "All-time top 10", "Peak cinema"],
  }),
  title("Breaking Bad", "series", ["Crime", "Drama"], {
    badges: ["Editor’s choice", "All-time top 10", "Peak cinema"],
  }),
  title("Vikings", "series", ["Action", "Drama"]),
  title("The Office", "series", ["Comedy"], { badges: ["All-time top 20"] }),
  title("Ozark", "series", ["Crime", "Drama"], { service: "netflix" }),
  title("Brooklyn Nine-Nine", "series", ["Comedy", "Crime"], {
    badges: ["All-time top 20"],
  }),
  title("The Good Doctor", "series", ["Drama"], {
    badges: ["Editor’s choice", "All-time top 20"],
  }),
  title("The Good Place", "series", ["Comedy", "Fantasy"]),
  title("Young Sheldon", "series", ["Comedy"]),
  title("Yellowstone", "series", ["Drama"]),
  title("The Lincoln Lawyer", "series", ["Crime", "Drama"], {
    service: "netflix",
  }),
  title("Manifest", "series", ["Mystery", "Drama"], {
    service: "netflix",
    badges: ["Editor’s choice"],
  }),
  title("Pantheon", "series", ["Sci-fi", "Drama"]),
  title("How to Sell Drugs Online (Fast)", "series", ["Comedy", "Crime"], {
    service: "netflix",
    badges: ["All-time top 20"],
  }),
  title("Snowpiercer", "series", ["Sci-fi", "Drama"], {
    badges: ["All-time top 20"],
  }),
  title("Sex Education", "series", ["Comedy", "Drama"], {
    service: "netflix",
    badges: ["Weird typeshit"],
  }),
  title("Foundation", "series", ["Sci-fi", "Drama"], { service: "apple" }),
  title("Severance", "series", ["Sci-fi", "Mystery"], { service: "apple" }),
  title("Slow Horses", "series", ["Thriller", "Comedy"], {
    service: "apple",
    badges: ["2026 top 10"],
  }),
  title("For All Mankind", "series", ["Sci-fi", "Drama"], {
    service: "apple",
    badges: ["2026 top 10"],
  }),
  title("The Blacklist", "series", ["Crime", "Thriller"]),
  title("Prison Break", "series", ["Crime", "Thriller"]),
  title("Money Heist", "series", ["Crime", "Thriller"], {
    service: "netflix",
  }),
  title("Stranger Things", "series", ["Sci-fi", "Horror"], {
    service: "netflix",
  }),
  title("Peaky Blinders", "series", ["Crime", "Drama"]),
  title("Narcos", "series", ["Crime", "Drama"], { service: "netflix" }),
  title("Dexter", "series", ["Crime", "Thriller"]),
  title("Sherlock", "series", ["Mystery", "Crime"]),
  title("Mr. Robot", "series", ["Thriller", "Drama"]),
  title("Westworld", "series", ["Sci-fi", "Mystery"]),
  title("Mindhunter", "series", ["Crime", "Thriller"], {
    service: "netflix",
  }),
  title("Lost", "series", ["Mystery", "Drama"]),
  title("The Walking Dead", "series", ["Horror", "Drama"]),
  title("The Witcher", "series", ["Fantasy", "Adventure"], {
    service: "netflix",
  }),
  title("You", "series", ["Thriller", "Drama"], { service: "netflix" }),
  title("The Last of Us", "series", ["Drama", "Horror"], {
    service: "hbo",
  }),
  title("Reacher", "series", ["Action", "Thriller"], { service: "prime" }),
  title("Daredevil", "series", ["Action", "Crime"]),
  title("The Punisher", "series", ["Action", "Crime"]),
  title("Arcane", "series", ["Fantasy", "Action"], { service: "netflix" }),
  title("Invincible", "series", ["Action", "Drama"], { service: "prime" }),
  title("True Detective", "series", ["Crime", "Mystery"], {
    service: "hbo",
  }),
  title("Counterpart", "series", ["Sci-fi", "Thriller"]),
  title("12 Monkeys", "series", ["Sci-fi", "Mystery"]),
  title("The Americans", "series", ["Thriller", "Drama"]),
  title("Fargo", "series", ["Crime", "Drama"]),
  title("Succession", "series", ["Drama", "Comedy"], { service: "hbo" }),
  title("Warrior", "series", ["Action", "Drama"]),
  title("From", "series", ["Horror", "Mystery"]),
  title("Monk", "series", ["Comedy", "Mystery"]),
  title("Leverage", "series", ["Crime", "Comedy"]),
  title("Scorpion", "series", ["Action", "Drama"]),
  title("How to Get Away with Murder", "series", ["Crime", "Drama"]),
  title("Criminal Minds", "series", ["Crime", "Mystery"]),
  title("Modern Family", "series", ["Comedy"]),
  title("Parks and Recreation", "series", ["Comedy"]),
  title("Superstore", "series", ["Comedy"]),
  title("Silicon Valley", "series", ["Comedy"], { service: "hbo" }),
  title("1899", "series", ["Mystery", "Sci-fi"], { service: "netflix" }),
  title("The Flash", "series", ["Action", "Sci-fi"]),
  title("The Big Bang Theory", "series", ["Comedy"]),
  title("Gotham", "series", ["Crime", "Drama"]),
  title("Psych", "series", ["Comedy", "Mystery"], {
    badges: ["All-time top 10"],
  }),
  title("The Peripheral", "series", ["Sci-fi", "Thriller"], {
    service: "prime",
  }),
  title("The Society", "series", ["Mystery", "Drama"], {
    service: "netflix",
  }),
  title("Agents of S.H.I.E.L.D.", "series", ["Action", "Sci-fi"]),
  title("Castle", "series", ["Crime", "Comedy"], {
    progress: "Started · paused for The Mentalist",
  }),
  title("Travelers", "series", ["Sci-fi", "Drama"], {
    status: "dropped",
  }),
  title("The OA", "series", ["Mystery", "Sci-fi"], {
    status: "dropped",
  }),
  title("Bones", "series", ["Crime", "Drama"], { status: "dropped" }),
  title("Lie to Me", "series", ["Crime", "Drama"], { status: "dropped" }),
]

const anime: RecommendationSeed[] = [
  title("Frieren: Beyond Journey’s End", "anime", ["Anime", "Fantasy"], {
    badges: ["No. 2"],
  }),
  title("The Apothecary Diaries", "anime", ["Anime", "Mystery"]),
  title("Neon Genesis Evangelion", "anime", ["Anime", "Sci-fi"]),
  title("Black Clover", "anime", ["Anime", "Fantasy"], {
    badges: ["All-time top 10"],
  }),
  title("Naruto", "anime", ["Anime", "Action"], { badges: ["No. 3"] }),
  title("Bleach", "anime", ["Anime", "Action"], { badges: ["No. 4"] }),
  title("Akame ga Kill!", "anime", ["Anime", "Action"], { badges: ["Top 10"] }),
  title("Fullmetal Alchemist: Brotherhood", "anime", ["Anime", "Adventure"], {
    badges: ["No. 2"],
  }),
  title("Haikyu!!", "anime", ["Anime", "Drama"], { badges: ["No. 5"] }),
  title("Attack on Titan", "anime", ["Anime", "Action"]),
  title("Death Note", "anime", ["Anime", "Thriller"]),
  title("Hunter x Hunter", "anime", ["Anime", "Adventure"]),
  title("Demon Slayer: Kimetsu no Yaiba", "anime", ["Anime", "Action"]),
  title("Code Geass", "anime", ["Anime", "Sci-fi"]),
  title("Steins;Gate", "anime", ["Anime", "Sci-fi"]),
  title("Vinland Saga", "anime", ["Anime", "Action"]),
  title("Solo Leveling", "anime", ["Anime", "Action"]),
  title("Chainsaw Man", "anime", ["Anime", "Action"]),
  title("Mob Psycho 100", "anime", ["Anime", "Action"]),
  title("Cyberpunk: Edgerunners", "anime", ["Anime", "Sci-fi"]),
  title("One-Punch Man", "anime", ["Anime", "Action"]),
]

const movies: RecommendationSeed[] = [
  title("Project Hail Mary", "movie", ["Sci-fi", "Adventure"]),
  title("The Sixth Sense", "movie", ["Mystery", "Thriller"]),
  title("Avatar Aang — The Last Airbender", "movie", ["Fantasy", "Adventure"]),
  title("Spider-Man: Brand New Day", "movie", ["Action", "Adventure"], {
    badges: ["Editor’s choice", "2026 top 10"],
  }),
  title("Superman", "movie", ["Action", "Adventure"]),
  title("Thunderbolts*", "movie", ["Action", "Adventure"], {
    badges: ["The New Avengers"],
  }),
  title("Yes Man", "movie", ["Comedy", "Romance"]),
  title("It Takes Two", "movie", ["Comedy", "Romance"]),
  title("100 Meters", "movie", ["Anime", "Drama"]),
  title("The Fall Guy", "movie", ["Action", "Comedy"]),
  title("The Platform", "movie", ["Thriller", "Horror"], { service: "netflix" }),
  title("Lift", "movie", ["Action", "Comedy"], { service: "netflix" }),
  title("F1", "movie", ["Action", "Drama"]),
  title("Ford v Ferrari", "movie", ["Action", "Drama"]),
]

const planToWatch: RecommendationSeed[] = [
  title("Mr Inbetween", "series", ["Crime", "Drama"], { planned: true }),
  title("The Devil’s Hour", "series", ["Thriller", "Mystery"], {
    planned: true,
  }),
  title("Watchmen", "series", ["Action", "Drama"], { planned: true }),
  title("Black Sails", "series", ["Adventure", "Drama"], { planned: true }),
  title("Banshee", "series", ["Action", "Crime"], { planned: true }),
  title("Bodies", "series", ["Crime", "Sci-fi"], { planned: true }),
  title("Elementary", "series", ["Crime", "Mystery"], { planned: true }),
  title("White Collar", "series", ["Crime", "Comedy"], { planned: true }),
  title("Burn Notice", "series", ["Action", "Drama"], { planned: true }),
  title("Community", "series", ["Comedy"], { planned: true }),
  title("Hannibal", "series", ["Crime", "Thriller"], { planned: true }),
  title("The Following", "series", ["Crime", "Thriller"], { planned: true }),
  title("Luther", "series", ["Crime", "Drama"], { planned: true }),
  title("Broadchurch", "series", ["Crime", "Drama"], { planned: true }),
  title("Bosch", "series", ["Crime", "Drama"], { planned: true }),
  title("24", "series", ["Action", "Thriller"], { planned: true }),
  title("Quantico", "series", ["Thriller", "Drama"], { planned: true }),
  title("Shooter", "series", ["Action", "Thriller"], { planned: true }),
  title("Bodyguard", "series", ["Thriller", "Drama"], { planned: true }),
  title("The Recruit", "series", ["Action", "Comedy"], { planned: true }),
  title("Sons of Anarchy", "series", ["Crime", "Drama"], { planned: true }),
  title("Animal Kingdom", "series", ["Crime", "Drama"], { planned: true }),
  title("Power", "series", ["Crime", "Drama"], { planned: true }),
  title("Snowfall", "series", ["Crime", "Drama"], { planned: true }),
  title("Top Boy", "series", ["Crime", "Drama"], { planned: true }),
  title("The Last Kingdom", "series", ["Action", "Drama"], { planned: true }),
  title("Spartacus", "series", ["Action", "Drama"], { planned: true }),
  title("Rome", "series", ["Drama", "Action"], { planned: true }),
  title("Marco Polo", "series", ["Adventure", "Drama"], { planned: true }),
  title("Heroes", "series", ["Action", "Sci-fi"], { planned: true }),
  title("The 4400", "series", ["Sci-fi", "Mystery"], { planned: true }),
  title("Orphan Black", "series", ["Sci-fi", "Thriller"], { planned: true }),
  title("Sense8", "series", ["Sci-fi", "Drama"], { planned: true }),
  title("The Man in the High Castle", "series", ["Sci-fi", "Drama"], {
    planned: true,
  }),
  title("Continuum", "series", ["Sci-fi", "Action"], { planned: true }),
  title("Wayward Pines", "series", ["Mystery", "Sci-fi"], { planned: true }),
  title("Under the Dome", "series", ["Mystery", "Sci-fi"], { planned: true }),
  title("Colony", "series", ["Sci-fi", "Drama"], { planned: true }),
  title("Utopia", "series", ["Thriller", "Mystery"], { planned: true }),
  title("The Strain", "series", ["Horror", "Drama"], { planned: true }),
  title("Into the Night", "series", ["Sci-fi", "Thriller"], {
    planned: true,
  }),
  title("Arrow", "series", ["Action", "Drama"], { planned: true }),
  title("Titans", "series", ["Action", "Drama"], { planned: true }),
  title("Doom Patrol", "series", ["Action", "Comedy"], { planned: true }),
  title("Chuck", "series", ["Action", "Comedy"], { planned: true }),
  title("How I Met Your Mother", "series", ["Comedy", "Romance"], {
    planned: true,
  }),
  title("New Girl", "series", ["Comedy", "Romance"], { planned: true }),
]

export const recommendations: Recommendation[] = [
  ...series,
  ...movies,
  ...anime,
  ...planToWatch,
].map((recommendation, index) => ({ ...recommendation, id: index + 1 }))

export const serviceLabels: Record<StreamingService, string> = {
  netflix: "Netflix",
  prime: "Prime Video",
  hbo: "HBO",
  apple: "Apple TV+",
}

export const typeLabels: Record<RecommendationType, string> = {
  series: "Series",
  anime: "Anime",
  movie: "Movie",
}
