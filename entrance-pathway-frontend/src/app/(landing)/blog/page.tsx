import Link from "next/link";
import { Title, Subtitle, Paragraph, Small } from "@/components/atoms";
import { Card, CardContent } from "@/components/ui";
import { Calendar, User, ArrowRight } from "lucide-react";

const featuredPost = {
  title: "Complete Guide to BSc CSIT Entrance Exam 2026",
  excerpt:
    "Everything you need to know about the BSc CSIT entrance exam - syllabus, pattern, important dates, and preparation tips from our expert mentors.",
  author: "Dr. Ram Sharma",
  date: "January 15, 2026",
  category: "Exam Guide",
  image: "/blog/featured.jpg",
  href: "/blog/bsc-csit-entrance-guide-2026",
};

const posts = [
  {
    title: "Top 10 Study Tips for IT Entrance Exams",
    excerpt:
      "Proven strategies to maximize your preparation and score higher in entrance exams.",
    author: "Priya Adhikari",
    date: "January 12, 2026",
    category: "Study Tips",
    href: "/blog/study-tips-entrance-exams",
  },
  {
    title: "Understanding the BIT Entrance Exam Pattern",
    excerpt:
      "A detailed breakdown of the BIT entrance exam structure and marking scheme.",
    author: "Anil Thapa",
    date: "January 10, 2026",
    category: "Exam Guide",
    href: "/blog/bit-entrance-pattern",
  },
  {
    title: "How to Manage Time During Entrance Exams",
    excerpt:
      "Time management strategies that helped our top scorers ace their exams.",
    author: "Sita Gurung",
    date: "January 8, 2026",
    category: "Study Tips",
    href: "/blog/time-management-exams",
  },
  {
    title: "Important Math Topics for IT Entrance",
    excerpt:
      "Focus on these high-weightage math topics to boost your entrance exam score.",
    author: "Dr. Ram Sharma",
    date: "January 5, 2026",
    category: "Subject Guide",
    href: "/blog/math-topics-it-entrance",
  },
  {
    title: "Success Story: From Average to Top 10",
    excerpt:
      "How one student transformed their preparation strategy and secured a top rank.",
    author: "Editorial Team",
    date: "January 3, 2026",
    category: "Success Stories",
    href: "/blog/success-story-top-10",
  },
  {
    title: "Mock Tests: Why They Matter and How to Use Them",
    excerpt:
      "The importance of mock tests in your preparation and how to analyze your results.",
    author: "Priya Adhikari",
    date: "January 1, 2026",
    category: "Study Tips",
    href: "/blog/mock-tests-importance",
  },
];

const categories = [
  "All",
  "Exam Guide",
  "Study Tips",
  "Subject Guide",
  "Success Stories",
  "News",
];

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Title className="mb-4">Blog</Title>
            <Paragraph className="text-lg text-muted-foreground">
              Tips, guides, and insights to help you succeed in your entrance
              exam preparation.
            </Paragraph>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  category === "All"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Link href={featuredPost.href}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="grid md:grid-cols-2">
                <div className="bg-muted/30 h-64 md:h-auto flex items-center justify-center">
                  <Paragraph className="text-muted-foreground">
                    Featured Image
                  </Paragraph>
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <Small className="text-primary mb-2">
                    {featuredPost.category}
                  </Small>
                  <Subtitle as="h2" className="text-2xl mb-4">
                    {featuredPost.title}
                  </Subtitle>
                  <Paragraph className="text-muted-foreground mb-4">
                    {featuredPost.excerpt}
                  </Paragraph>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.date}
                    </span>
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Subtitle className="mb-8">Latest Posts</Subtitle>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.title} href={post.href}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="h-40 bg-muted/50 flex items-center justify-center">
                    <Paragraph className="text-muted-foreground text-sm">
                      Post Image
                    </Paragraph>
                  </div>
                  <CardContent className="p-6">
                    <Small className="text-primary mb-2">{post.category}</Small>
                    <Subtitle as="h3" className="text-lg mb-2 line-clamp-2">
                      {post.title}
                    </Subtitle>
                    <Paragraph className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </Paragraph>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-background border rounded-lg hover:bg-muted transition-colors">
              Load More Posts
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Subtitle className="mb-4">Subscribe to Our Newsletter</Subtitle>
            <Paragraph className="text-muted-foreground mb-6">
              Get the latest articles, study tips, and exam updates delivered to
              your inbox.
            </Paragraph>
            <form className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
