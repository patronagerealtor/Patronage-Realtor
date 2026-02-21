import { useEffect } from "react";
import { useParams, Link } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Calendar, ArrowRight, ArrowLeft, BookOpen } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { blogPost, getBlogPostById, type BlogPost } from "../data/blogs";

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

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.div variants={itemVariants}>
      <Link href={`/blogs/${post.id}`}>
        <Card className="overflow-hidden cursor-pointer transition-shadow hover:shadow-lg h-full flex flex-col">
          <div className="aspect-video w-full overflow-hidden bg-muted">
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            )}
          </div>
          <CardContent className="p-5 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-2">
              {post.category && (
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {post.date}
              </span>
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
              {post.content.slice(0, 120)}…
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

export default function Blogs() {
  const params = useParams<{ id?: string }>();
  const post = params?.id ? getBlogPostById(params.id) : undefined;
  const isDetailView = Boolean(params?.id);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [params?.id]);

  if (isDetailView) {
    if (!post) {
      return (
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <main className="container mx-auto px-4 py-24 text-center">
            <h1 className="text-2xl font-heading font-bold mb-4">
              Blog post not found
            </h1>
            <p className="text-muted-foreground mb-6">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/blogs">Back to Blogs</Link>
            </Button>
          </main>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <article className="pb-20">
          {post.image && (
            <div className="w-full aspect-[21/9] max-h-[420px] overflow-hidden bg-muted">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="container mx-auto px-4 -mt-16 relative z-10">
            <div className="max-w-3xl mx-auto">
              <Button
                variant="ghost"
                size="sm"
                className="mb-6 text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link href="/blogs" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blogs
                </Link>
              </Button>
              <div className="rounded-xl border border-border bg-card shadow-sm p-6 md:p-10">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                  {post.category && (
                    <Badge variant="secondary">{post.category}</Badge>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </span>
                  {post.readTime != null && post.readTime !== "" && (
                    <span>{post.readTime}</span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 leading-tight">
                  {post.title}
                </h1>
                <div className="prose prose-neutral dark:prose-invert max-w-none mt-6 text-muted-foreground prose-headings:text-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </article>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[blogPost].map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
