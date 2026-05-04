export const topics = ["All Topics", "Array", "String", "Hash Table", "Math", "Dynamic Programming"];

export const problems = [
  { id: "two-sum", title: "Two Sum Re-imagined", acceptance: 48.5, difficulty: "easy", topic: "Array", solved: true },
  { id: "recursive-tree", title: "Recursive Tree Architecture", acceptance: 32.1, difficulty: "medium", topic: "Dynamic Programming", solved: false },
  { id: "maximum-flow", title: "Maximum Flow Pulse", acceptance: 18.2, difficulty: "hard", topic: "Math", solved: true },
  { id: "sudoku", title: "Sudoku Structural Solver", acceptance: 25.4, difficulty: "hard", topic: "Hash Table", solved: false },
  { id: "anagram", title: "Valid Anagram Pulse", acceptance: 63.9, difficulty: "easy", topic: "String", solved: true },
  { id: "median", title: "Median of Two Sorted Arrays", acceptance: 29.4, difficulty: "hard", topic: "Array", solved: false },
  { id: "palindrome", title: "Longest Palindromic Substring", acceptance: 38.7, difficulty: "medium", topic: "String", solved: true }
];

export const todayChallenges = {
  solvedCount: 3,
  total: 10,
  exp: 100,
  problems: [
    { id: "reverse-string",   title: "Reverse String Pulse",       difficulty: "easy"   },
    { id: "palindrome-xl",    title: "Palindrome Check XL",        difficulty: "easy"   },
    { id: "two-sum",          title: "Two Sum Re-imagined",        difficulty: "easy"   },
    { id: "anagram",          title: "Valid Anagram Pulse",        difficulty: "easy"   },
    { id: "fib-dp",           title: "Fibonacci with DP",          difficulty: "easy"   },
    { id: "stack-basics",     title: "Stack Basics",               difficulty: "easy"   },
    { id: "binary-search",    title: "Binary Search Classic",      difficulty: "medium" },
    { id: "linked-list",      title: "Linked List Reversal",       difficulty: "medium" },
    { id: "bfs-grid",         title: "BFS Grid Traversal",         difficulty: "medium" },
    { id: "dp-coins",         title: "Coin Change (DP)",           difficulty: "medium" },
  ],
};

export const contestBars = [
  { month: "Jan", last: 72, now: 90 }, { month: "Feb", last: 58, now: 65 }, { month: "Mar", last: 81, now: 44 },
  { month: "Apr", last: 63, now: 70 }, { month: "May", last: 45, now: 87 }, { month: "Jun", last: 88, now: 71 },
  { month: "Jul", last: 67, now: 74 }, { month: "Aug", last: 49, now: 55 }, { month: "Sep", last: 61, now: 52 },
  { month: "Oct", last: 42, now: 93 }, { month: "Nov", last: 84, now: 73 }, { month: "Dec", last: 92, now: 67 }
];

export const dailyLine = [
  { d: "Mon", last: 40, now: 55 }, { d: "Tue", last: 52, now: 61 }, { d: "Wed", last: 43, now: 70 },
  { d: "Thu", last: 47, now: 63 }, { d: "Fri", last: 73, now: 35 }, { d: "Sat", last: 52, now: 44 }, { d: "Sun", last: 84, now: 79 }
];

export const posts = [
  { 
    id: 1,
    author: "Sarah Zen", 
    role: "Senior Dev @ Cloud Flow",
    timeAgo: "2h ago",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "Just refactored our microservices communication layer. Swapping REST for gRPC reduced latency by 40%! If anyone is struggling with payload overhead, it's a total game changer.", 
    likes: 124, 
    comments: 18,
    codeSnippet: `const pulseClient = new GrpcClient({
  service: "Inventory.Sync",
  retries: 3,
  timeout: 500
});`
  },
  { 
    id: 2,
    author: "Jordan Byte", 
    role: "Infrastructure Lead @ Shago",
    timeAgo: "5h ago",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Finally finished mapping out the system architecture for the new open-source project. Clean, modular, and scalable. Thoughts on the layer separation? 🏗️", 
    likes: 482, 
    comments: 56,
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800&h=400"
  }
];
