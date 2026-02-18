import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Link } from "wouter";
import { useEffect } from "react";
import { BLOG_POSTS, type BlogPost } from "../data/blogs";

/* -------------------- Animations -------------------- */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* -------------------- Card -------------------- */
function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.div variants={itemVariants}>
      <Link href={`/blogs/${post.id}`}>
        <Card className="overflow-hidden cursor-pointer transition-shadow hover:shadow-lg h-full flex flex-col">
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <CardContent className="p-5 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {post.category}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {post.date}
              </span>
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
              {post.excerpt}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-3 group">
              Read more
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

/* -------------------- Page -------------------- */
export default function Blogs() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero */}
      <section className="relative py-20 bg-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 text-primary mb-4">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">
              Blog
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 tracking-tight">
            Insights & <span className="text-primary">Updates</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tips on real estate, investing, and making the most of your home.
          </p>
        </div>
      </section>

      {/* Blog grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {BLOG_POSTS.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
